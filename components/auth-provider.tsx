"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, createUserWithEmailAndPassword, signInWithCustomToken } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export type Role = "guru" | "siswa" | null;

const safeStringify = (obj: any) => {
  const cache = new Set();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) return undefined;
      cache.add(value);
    }
    return value;
  });
};

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : "Undefined error occurred",
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', errInfo);
  throw new Error(`Firestore operation failed: ${errInfo.error}. Please ensure Cloud Firestore API is enabled in your Google Cloud Project.`);
}

interface AuthContextType {
  user: User | null;
  userData: any | null;
  role: Role;
  loading: boolean;
  needsOnboarding: boolean;
  needsEmailVerification: boolean;
  needsOtp: boolean;
  markOtpVerified: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithCustomTokenVal: (token: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: (data: any) => Promise<void>;
  updateRole: (newRole: Role) => Promise<void>;
  updateProfileData: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  role: null,
  loading: true,
  needsOnboarding: false,
  needsEmailVerification: false,
  needsOtp: false,
  markOtpVerified: () => {},
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  signInWithCustomTokenVal: async () => {},
  resetPassword: async () => {},
  resendVerification: async () => {},
  signOut: async () => {},
  completeOnboarding: async () => {},
  updateRole: async () => {},
  updateProfileData: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [needsOtp, setNeedsOtp] = useState(false);

  // Read cache on mount
  useEffect(() => {
    const loadCache = () => {
      try {
        const cachedUser = localStorage.getItem("qukao_cached_user");
        if (cachedUser) {
          setUser(JSON.parse(cachedUser) as User);
          setLoading(false);
        }
        
        const cachedUserData = localStorage.getItem("qukao_cached_userdata");
        if (cachedUserData) {
          setUserData(JSON.parse(cachedUserData));
        }
        
        const cachedRole = localStorage.getItem("qukao_cached_role");
        if (cachedRole) {
          setRole(cachedRole as Role);
        }
        
        const cachedNeedsOnboarding = localStorage.getItem("qukao_cached_needs_onboarding");
        if (cachedNeedsOnboarding === "true") {
          setNeedsOnboarding(true);
        }
      } catch (e) {
        console.error("Failed to load cached auth state:", e);
      }
    };

    // Use requestAnimationFrame or setTimeout to ensure it is not synchronous inside the initial render run
    const timer = setTimeout(loadCache, 0);
    return () => clearTimeout(timer);
  }, []);

  // We set this if the user exists but hasn't verified their email
  const needsEmailVerification = !!user && !user.emailVerified;

  const markOtpVerified = () => {
     if (user) {
        localStorage.setItem(`trusted_device_${user.uid}`, 'true');
        setNeedsOtp(false);
     }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Cache basic user fields
        const simpleUser = {
          uid: currentUser.uid,
          email: currentUser.email,
          emailVerified: currentUser.emailVerified,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL
        };
        localStorage.setItem("qukao_cached_user", safeStringify(simpleUser));

        const isTrusted = localStorage.getItem(`trusted_device_${currentUser.uid}`);
        if (!isTrusted) {
           setNeedsOtp(true);
        } else {
           setNeedsOtp(false);
        }

        if (!currentUser.emailVerified) {
          // If not verified, stop loading but don't fetch role yet
          setLoading(false);
          return;
        }

        // Allow all registered users to complete onboarding and access dashboard directly without email blocks
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            setRole(data.role as Role);
            setNeedsOnboarding(data.onboardingCompleted === false);

            localStorage.setItem("qukao_cached_role", data.role || "");
            localStorage.setItem("qukao_cached_userdata", safeStringify(data));
            localStorage.setItem("qukao_cached_needs_onboarding", String(data.onboardingCompleted === false));
          } else {
            // New user via Google or Email who just got verified
            setUserData(null);
            setRole(null);
            setNeedsOnboarding(true); 

            localStorage.removeItem("qukao_cached_role");
            localStorage.removeItem("qukao_cached_userdata");
            localStorage.setItem("qukao_cached_needs_onboarding", "true");
          }
        } catch (error) {
          console.error("Failed to fetch user doc, possibly offline.", error);
          setUserData(null);
          setRole(null);
          setNeedsOnboarding(true); 
        } finally {
          setLoading(false);
        }
      } else {
        setRole(null);
        setNeedsOnboarding(false);
        setLoading(false);

        localStorage.removeItem("qukao_cached_user");
        localStorage.removeItem("qukao_cached_role");
        localStorage.removeItem("qukao_cached_userdata");
        localStorage.removeItem("qukao_cached_needs_onboarding");
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userDocRef = doc(db, "users", user.uid);
      let userDoc;
      try {
        userDoc = await getDoc(userDocRef);
      } catch (error) {
        console.error("Failed to fetch user doc, possibly offline.", error);
      }
      
      if (!userDoc || !userDoc.exists()) {
        try {
          await setDoc(userDocRef, {
            email: user.email,
            role: "siswa", // Default, will be asked in onboarding if we want, or just default to siswa
            onboardingCompleted: false
          });
        } catch (error) {
           console.error("Failed to set user doc, possibly offline.", error);
        }
        setUserData(null);
        setRole("siswa");
        setNeedsOnboarding(true);
      } else {
        const data = userDoc.data();
        setUserData(data);
        setRole(data.role as Role);
        setNeedsOnboarding(data.onboardingCompleted === false);
      }
    } catch (error) {
      console.error("Sign in failed", error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    await sendEmailVerification(result.user);
  };

  const signInWithCustomTokenVal = async (token: string) => {
    await signInWithCustomToken(auth, token);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const resendVerification = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  };

  const signOut = async () => {
    localStorage.removeItem("qukao_cached_user");
    localStorage.removeItem("qukao_cached_role");
    localStorage.removeItem("qukao_cached_userdata");
    localStorage.removeItem("qukao_cached_needs_onboarding");
    await firebaseSignOut(auth);
  };

  const completeOnboarding = async (data: any) => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    // Determine the role from onboarding data or default to current role
    const finalRole = data.role || role || "siswa"; 
    try {
      await setDoc(userDocRef, {
        ...data,
        role: finalRole,
        onboardingCompleted: true
      }, { merge: true });
    } catch (error) {
      console.error("Failed to fetch user doc, possibly offline.", error);
    }
    const nextUserData = { ...userData, ...data, role: finalRole as Role, onboardingCompleted: true };
    setUserData(nextUserData);
    setRole(finalRole as Role);
    setNeedsOnboarding(false);

    localStorage.setItem("qukao_cached_role", finalRole);
    localStorage.setItem("qukao_cached_userdata", safeStringify(nextUserData));
    localStorage.setItem("qukao_cached_needs_onboarding", "false");
  };

  const updateRole = async (newRole: Role) => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    try {
      await setDoc(userDocRef, { role: newRole }, { merge: true });
    } catch (error) {
      console.error("Failed to fetch user doc, possibly offline.", error);
    }
    const nextUserData = { ...userData, role: newRole };
    setUserData(nextUserData);
    setRole(newRole);

    if (newRole) {
      localStorage.setItem("qukao_cached_role", newRole);
    } else {
      localStorage.removeItem("qukao_cached_role");
    }
    localStorage.setItem("qukao_cached_userdata", safeStringify(nextUserData));
  };

  const updateProfileData = async (data: any) => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    try {
      await setDoc(userDocRef, data, { merge: true });
    } catch (error) {
      console.error("Failed to fetch user doc, possibly offline.", error);
    }
    const nextUserData = { ...userData, ...data };
    setUserData(nextUserData);
    localStorage.setItem("qukao_cached_userdata", safeStringify(nextUserData));
  };

  return (
    <AuthContext.Provider value={{ user, userData, role, loading, needsOnboarding, needsEmailVerification, needsOtp, markOtpVerified, signInWithGoogle, signInWithEmail, signUpWithEmail, signInWithCustomTokenVal, resetPassword, resendVerification, signOut, completeOnboarding, updateRole, updateProfileData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
