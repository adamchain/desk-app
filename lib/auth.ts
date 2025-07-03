import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// For web, we'll use localStorage as a fallback
const storage = {
  async setItem(key: string, value: string) {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },
  
  async removeItem(key: string) {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
};

export interface User {
  id: string;
  phoneNumber: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Utility function to sanitize phone numbers for use as SecureStore keys
function sanitizePhoneForKey(phoneNumber: string): string {
  // Remove all non-alphanumeric characters and replace with underscores
  return phoneNumber.replace(/[^a-zA-Z0-9]/g, '_');
}

// Twilio service for production SMS
class TwilioService {
  private accountSid: string;
  private authToken: string;
  private serviceSid: string;

  constructor() {
    // These should be set in your environment variables
    this.accountSid = process.env.EXPO_PUBLIC_TWILIO_ACCOUNT_SID || '';
    this.authToken = process.env.EXPO_PUBLIC_TWILIO_AUTH_TOKEN || '';
    this.serviceSid = process.env.EXPO_PUBLIC_TWILIO_VERIFY_SERVICE_SID || '';
  }

  async sendVerificationCode(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    try {
      // In production, this would make an API call to your backend
      // which would then use Twilio's server-side SDK
      const response = await fetch('/api/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const result = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          message: `Verification code sent to ${phoneNumber}`
        };
      } else {
        return {
          success: false,
          message: result.error || 'Failed to send verification code'
        };
      }
    } catch (error) {
      console.error('Error sending verification code via Twilio:', error);
      return {
        success: false,
        message: 'Failed to send verification code. Please try again.'
      };
    }
  }

  async verifyCode(phoneNumber: string, code: string): Promise<{ success: boolean; message: string }> {
    try {
      // In production, this would make an API call to your backend
      // which would then use Twilio's server-side SDK
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, code }),
      });

      const result = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          message: 'Code verified successfully'
        };
      } else {
        return {
          success: false,
          message: result.error || 'Invalid verification code'
        };
      }
    } catch (error) {
      console.error('Error verifying code via Twilio:', error);
      return {
        success: false,
        message: 'Failed to verify code. Please try again.'
      };
    }
  }
}

class AuthService {
  private static instance: AuthService;
  private user: User | null = null;
  private listeners: ((state: AuthState) => void)[] = [];
  private twilioService: TwilioService;
  private isDevelopment: boolean;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private constructor() {
    this.twilioService = new TwilioService();
    this.isDevelopment = __DEV__ || process.env.NODE_ENV === 'development';
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      const userData = await storage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    }
  }

  private notifyListeners() {
    const state: AuthState = {
      user: this.user,
      isLoading: false,
      isAuthenticated: !!this.user,
    };
    this.listeners.forEach(listener => listener(state));
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    // Immediately call with current state
    listener({
      user: this.user,
      isLoading: false,
      isAuthenticated: !!this.user,
    });

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  async sendVerificationCode(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    try {
      // Use Twilio in production, fallback to demo mode in development
      if (!this.isDevelopment) {
        return await this.twilioService.sendVerificationCode(phoneNumber);
      }

      // Development mode - simulate sending SMS
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Sanitize phone number for SecureStore key
      const sanitizedPhone = sanitizePhoneForKey(phoneNumber);
      
      // Store the code temporarily (in production, this would be server-side)
      await storage.setItem(`verification_code_${sanitizedPhone}`, code);
      await storage.setItem(`verification_code_timestamp_${sanitizedPhone}`, Date.now().toString());
      
      // For demo purposes, we'll show the code in console
      console.log(`Verification code for ${phoneNumber}: ${code}`);
      
      return {
        success: true,
        message: `Verification code sent to ${phoneNumber}. Check console for demo code.`
      };
    } catch (error) {
      console.error('Error sending verification code:', error);
      return {
        success: false,
        message: 'Failed to send verification code. Please try again.'
      };
    }
  }

  async verifyCode(phoneNumber: string, code: string): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      // Use Twilio in production, fallback to demo mode in development
      if (!this.isDevelopment) {
        const twilioResult = await this.twilioService.verifyCode(phoneNumber, code);
        if (!twilioResult.success) {
          return twilioResult;
        }
      } else {
        // Development mode - verify against stored code
        const sanitizedPhone = sanitizePhoneForKey(phoneNumber);
        
        // Get stored code and timestamp
        const storedCode = await storage.getItem(`verification_code_${sanitizedPhone}`);
        const timestamp = await storage.getItem(`verification_code_timestamp_${sanitizedPhone}`);
        
        if (!storedCode || !timestamp) {
          return {
            success: false,
            message: 'No verification code found. Please request a new code.'
          };
        }

        // Check if code is expired (5 minutes)
        const codeAge = Date.now() - parseInt(timestamp);
        if (codeAge > 5 * 60 * 1000) {
          await storage.removeItem(`verification_code_${sanitizedPhone}`);
          await storage.removeItem(`verification_code_timestamp_${sanitizedPhone}`);
          return {
            success: false,
            message: 'Verification code has expired. Please request a new code.'
          };
        }

        // Verify code
        if (storedCode !== code) {
          return {
            success: false,
            message: 'Invalid verification code. Please try again.'
          };
        }

        // Clean up verification code
        await storage.removeItem(`verification_code_${sanitizedPhone}`);
        await storage.removeItem(`verification_code_timestamp_${sanitizedPhone}`);
      }

      // Create or get user
      let user = await this.getUserByPhone(phoneNumber);
      if (!user) {
        user = await this.createUser(phoneNumber);
      } else {
        user.lastLoginAt = new Date().toISOString();
        await this.saveUser(user);
      }

      this.user = user;
      await storage.setItem('user', JSON.stringify(user));
      this.notifyListeners();

      return {
        success: true,
        message: 'Successfully signed in!',
        user
      };
    } catch (error) {
      console.error('Error verifying code:', error);
      return {
        success: false,
        message: 'Failed to verify code. Please try again.'
      };
    }
  }

  private async getUserByPhone(phoneNumber: string): Promise<User | null> {
    try {
      const usersData = await storage.getItem('users');
      if (!usersData) return null;
      
      const users: User[] = JSON.parse(usersData);
      return users.find(u => u.phoneNumber === phoneNumber) || null;
    } catch (error) {
      console.error('Error getting user by phone:', error);
      return null;
    }
  }

  private async createUser(phoneNumber: string): Promise<User> {
    const user: User = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      phoneNumber,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    await this.saveUser(user);
    return user;
  }

  private async saveUser(user: User) {
    try {
      const usersData = await storage.getItem('users');
      let users: User[] = usersData ? JSON.parse(usersData) : [];
      
      const existingIndex = users.findIndex(u => u.id === user.id);
      if (existingIndex >= 0) {
        users[existingIndex] = user;
      } else {
        users.push(user);
      }
      
      await storage.setItem('users', JSON.stringify(users));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }

  async signOut() {
    this.user = null;
    await storage.removeItem('user');
    this.notifyListeners();
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.user;
  }
}

export const authService = AuthService.getInstance();