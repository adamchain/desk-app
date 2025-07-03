import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Smartphone, MessageSquare, Shield, ArrowRight, Copy } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';

export default function AuthScreen() {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoCode, setDemoCode] = useState('');

  const { sendVerificationCode, verifyCode } = useAuth();

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (cleaned.length >= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    } else if (cleaned.length >= 3) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return cleaned;
    }
  };

  const handlePhoneSubmit = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    // Extract digits only
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await sendVerificationCode(`+1${cleanPhone}`);
    
    setIsLoading(false);

    if (result.success) {
      setStep('code');
      
      // For demo purposes, generate and show the code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setDemoCode(code);
      
      Alert.alert(
        'Verification Code Sent',
        `${result.message}\n\nDemo Code: ${code}`,
        [{ text: 'OK' }]
      );
    } else {
      setError(result.message);
    }
  };

  const handleCodeSubmit = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    if (verificationCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // For demo purposes, accept the demo code or any 6-digit code
    let codeToVerify = verificationCode;
    if (demoCode && verificationCode === demoCode) {
      codeToVerify = demoCode;
    } else if (verificationCode === '123456') {
      // Accept default demo code
      codeToVerify = '123456';
    }
    
    const result = await verifyCode(`+1${cleanPhone}`, codeToVerify);
    
    setIsLoading(false);

    if (!result.success) {
      setError(result.message);
    }
    // If successful, the auth state will update and the user will be redirected
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setVerificationCode('');
    setError('');
    setDemoCode('');
  };

  const handleResendCode = async () => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    setIsLoading(true);
    const result = await sendVerificationCode(`+1${cleanPhone}`);
    setIsLoading(false);
    
    if (result.success) {
      // Generate new demo code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setDemoCode(code);
      Alert.alert('Code Resent', `${result.message}\n\nDemo Code: ${code}`);
    } else {
      setError(result.message);
    }
  };

  const copyCodeToClipboard = () => {
    if (demoCode) {
      setVerificationCode(demoCode);
      Alert.alert('Code Copied', 'The verification code has been entered for you!');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Shield size={48} color="#8B4513" />
          </View>
          <Text style={styles.title}>Welcome to Your Desk</Text>
          <Text style={styles.subtitle}>
            {step === 'phone' 
              ? 'Enter your phone number to get started' 
              : 'Enter the verification code sent to your phone'
            }
          </Text>
        </View>

        <View style={styles.formContainer}>
          {step === 'phone' ? (
            <>
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Smartphone size={20} color="#8B4513" />
                </View>
                <TextInput
                  style={styles.textInput}
                  value={phoneNumber}
                  onChangeText={(text) => setPhoneNumber(formatPhoneNumber(text))}
                  placeholder="(555) 123-4567"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  maxLength={14}
                  autoFocus
                />
              </View>

              <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.disabledButton]}
                onPress={handlePhoneSubmit}
                disabled={isLoading}
              >
                <Text style={styles.submitButtonText}>
                  {isLoading ? 'Sending...' : 'Send Code'}
                </Text>
                <ArrowRight size={20} color="#FFF" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.phoneDisplay}>
                <Text style={styles.phoneDisplayText}>
                  Code sent to {phoneNumber}
                </Text>
                <TouchableOpacity onPress={handleBackToPhone}>
                  <Text style={styles.changePhoneText}>Change number</Text>
                </TouchableOpacity>
              </View>

              {/* Demo Code Display */}
              {demoCode && (
                <View style={styles.demoCodeContainer}>
                  <Text style={styles.demoCodeLabel}>Demo Verification Code:</Text>
                  <View style={styles.demoCodeDisplay}>
                    <Text style={styles.demoCodeText}>{demoCode}</Text>
                    <TouchableOpacity 
                      style={styles.copyButton}
                      onPress={copyCodeToClipboard}
                    >
                      <Copy size={16} color="#8B4513" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.demoCodeNote}>
                    Tap the copy button to auto-fill the code below
                  </Text>
                </View>
              )}

              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <MessageSquare size={20} color="#8B4513" />
                </View>
                <TextInput
                  style={[styles.textInput, styles.codeInput]}
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  placeholder="123456"
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                  maxLength={6}
                  autoFocus
                />
              </View>

              <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.disabledButton]}
                onPress={handleCodeSubmit}
                disabled={isLoading}
              >
                <Text style={styles.submitButtonText}>
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </Text>
                <ArrowRight size={20} color="#FFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resendButton}
                onPress={handleResendCode}
                disabled={isLoading}
              >
                <Text style={styles.resendButtonText}>
                  Didn't receive the code? Resend
                </Text>
              </TouchableOpacity>
            </>
          )}

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            We'll send you a unique verification code each time you sign in to keep your desk secure.
          </Text>
          {step === 'code' && (
            <Text style={styles.testingNote}>
              Testing Mode: Use the demo code above or enter "123456"
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    paddingLeft: 16,
    paddingRight: 12,
  },
  textInput: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
    fontSize: 16,
    color: '#333',
  },
  codeInput: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 4,
    textAlign: 'center',
  },
  phoneDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  phoneDisplayText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  changePhoneText: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '600',
  },
  demoCodeContainer: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  demoCodeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 8,
    textAlign: 'center',
  },
  demoCodeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  demoCodeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    letterSpacing: 2,
    marginRight: 12,
  },
  copyButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F5F5DC',
  },
  demoCodeNote: {
    fontSize: 12,
    color: '#8B4513',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B4513',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  resendButtonText: {
    color: '#8B4513',
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FFE6E6',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FFB3B3',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 8,
  },
  testingNote: {
    fontSize: 11,
    color: '#8B4513',
    textAlign: 'center',
    fontWeight: '600',
    backgroundColor: 'rgba(139, 69, 19, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
});