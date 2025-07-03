import { useState, useEffect } from 'react';
import { authService, type AuthState } from '@/lib/auth';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  const sendVerificationCode = async (phoneNumber: string) => {
    return await authService.sendVerificationCode(phoneNumber);
  };

  const verifyCode = async (phoneNumber: string, code: string) => {
    return await authService.verifyCode(phoneNumber, code);
  };

  const signOut = async () => {
    await authService.signOut();
  };

  return {
    ...authState,
    sendVerificationCode,
    verifyCode,
    signOut,
  };
}