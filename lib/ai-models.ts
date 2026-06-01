export const OPENROUTER_MODELS = {
  tutor: [
    "google/gemini-2.0-flash-lite-preview-02-05:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "deepseek/deepseek-r1-distill-llama-70b:free",
    "qwen/qwen-vw-7b-instruct:free",
  ],
  reasoning: [
    "deepseek/deepseek-r1:free",
    "google/gemini-2.0-pro-exp-02-05:free",
  ],
  coding: [
    "qwen/qwen-2.5-coder-32b-instruct:free",
    "meta-llama/llama-3.3-70b-instruct:free"
  ],
  vision: [
    "google/gemini-2.0-flash-lite-preview-02-05:free",
    "qwen/qwen-vl-plus:free"
  ],
  flash: [
    "google/gemini-2.0-flash-lite-preview-02-05:free",
    "meta-llama/llama-3.1-8b-instruct:free"
  ],
  backup: [
    "openrouter/free"
  ]
};

export type ModelCategory = keyof typeof OPENROUTER_MODELS;
