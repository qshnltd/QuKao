import { OPENROUTER_MODELS, ModelCategory } from "./ai-models";

// Load keys from environment variable
const keysString = process.env.OPENROUTER_API_KEYS || "";
const RAW_API_KEYS = keysString.split(",").map(k => k.trim()).filter(Boolean);

// Production-ready API Key Manager
class APIKeyManager {
  private keys = RAW_API_KEYS.map((key) => ({
    key,
    isExhausted: false // For 402 Payment Required
  }));
  private currentIndex = 0;

  getAvailableKey(): string | null {
    for (let i = 0; i < this.keys.length; i++) {
      const index = (this.currentIndex + i) % this.keys.length;
      const k = this.keys[index];
      if (!k.isExhausted) {
        this.currentIndex = (index + 1) % this.keys.length; // Round-robin
        return k.key;
      }
    }
    return null; // All keys exhausted
  }

  markExhausted(keyString: string) {
    const k = this.keys.find(k => k.key === keyString);
    if (k) {
      k.isExhausted = true;
      console.warn(`[OpenRouter] Key ending in *${keyString.slice(-4)} marked EXHAUSTED (402)`);
    }
  }
}

const keyManager = new APIKeyManager();

// Helper for fetch with timeout (Vercel/Cloud Run environments often hang otherwise)
async function fetchWithTimeout(resource: RequestInfo, options: RequestInit & { timeout?: number } = {}) {
  const { timeout = 15000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal  
  });
  clearTimeout(id);
  
  return response;
}

export async function generateWithOpenRouter(
  messages: any[],
  category: ModelCategory = "tutor",
  systemPrompt?: string
) {
  const modelsToTry = [
    ...OPENROUTER_MODELS[category],
    ...OPENROUTER_MODELS.backup
  ];

  let preparedMessages = [...messages];
  if (systemPrompt && preparedMessages[0]?.role !== "system") {
    preparedMessages.unshift({ role: "system", content: systemPrompt });
  }

  // Ensure user messages with images only go to vision models
  const hasImages = messages.some(m => 
    Array.isArray(m.content) && m.content.some((c: any) => c.type === "image_url")
  );

  let allowedModels = modelsToTry;
  if (hasImages && category !== "vision") {
     allowedModels = [...OPENROUTER_MODELS.vision, ...OPENROUTER_MODELS.backup];
  }

  const MAX_GLOBAL_ATTEMPTS = 15;
  let globalAttempts = 0;

  for (const model of allowedModels) {
    if (globalAttempts >= MAX_GLOBAL_ATTEMPTS) break;
    
    // Internal retry loop for the same model if we encounter 429/402
    let modelAttempts = 0;
    while (modelAttempts < 3 && globalAttempts < MAX_GLOBAL_ATTEMPTS) {
      const apiKey = keyManager.getAvailableKey();
      
      if (!apiKey) {
        console.error("[OpenRouter] CRITICAL: All API keys are exhausted or rate limited.");
        return {
          content: "Sisa limit dari API Key bawaan OpenRouter sedang penuh. Untuk akses stabil, silakan tambahkan kunci OPENROUTER_API_KEYS milik Anda di menu pengaturan (Settings), atau coba lagi dalam beberapa menit.",
          model: "none",
          success: false
        };
      }

      try {
        console.log(`[OpenRouter] Attempt ${globalAttempts + 1}: Model [${model}]`);
        
        const safePayload = JSON.stringify({
            model: model,
            messages: preparedMessages,
          }, (key, value) => {
            if (typeof value === 'object' && value !== null) {
              if (value instanceof Event || (value.constructor && value.constructor.name === 'SyntheticBaseEvent')) {
                 return '[Event omitted]';
              }
            }
            return value;
          });

        const response = await fetchWithTimeout("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://qukao.qzz.io",
            "X-Title": "QuKao Learning Platform",
            "Content-Type": "application/json"
          },
          body: safePayload,
          timeout: 10000 // 10s timeout per attempt to allow retrying quickly
        });

        if (response.ok) {
          const data = await response.json();
          if (data.choices && data.choices.length > 0) {
            return {
              content: data.choices[0].message.content,
              model: data.model || model,
              success: true
            };
          }
        } 
        
        // Handle Errors based on HTTP Status
        console.warn(`[OpenRouter] HTTP ${response.status} from ${model}`);
        
        if (response.status === 402) {
          keyManager.markExhausted(apiKey);
          globalAttempts++; modelAttempts++;
          continue; // Retry same model with next key (if available)
        } else if (response.status === 429) {
          // OpenRouter free models have strict rate limits. 
          // If we hit 429, we shouldn't retry the same model immediately, as it usually has a cooldown.
          // Let's just move to the NEXT model.
          globalAttempts++;
          break; // Break inner loop, move to next model
        } else if (response.status === 400 || response.status === 404) {
          // Model likely doesn't support the format, or is completely offline
          globalAttempts++;
          break; // Break inner loop, move to next model
        } else {
          // 500, 502, 503, etc...
          globalAttempts++;
          break; // Break inner loop, move to next model
        }
        
      } catch (error: any) {
        console.error(`[OpenRouter] Exception calling ${model}:`, error.message || error);
        globalAttempts++;
        break; // Assume network or timeout, move to next model
      }
    }
  }

  return {
    content: "Sisa limit/kuota gratis aplikasi sudah tercapai untuk saat ini. Supaya lancar, Anda bisa menambahkan OPENROUTER_API_KEYS Anda secara mandiri di pengaturan (Settings) aplikasi, atau silakan coba beberapa saat lagi.",
    model: "none",
    success: false
  };
}
