import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/colors';
import { getRoleRoute } from '../../src/constants/roles';
import { useAuth } from '../../src/hooks/useAuth';
import { Card, Button } from '../../src/components';

const DEMO_ACCOUNTS = [
  {
    role: 'ADMIN',
    label: 'Admin',
    icon: '🏛️',
    email: 'admin@college.edu',
    color: '#4F46E5',
    bg: '#EEF2FF',
  },
  {
    role: 'DEPARTMENT_STAFF',
    label: 'HOD',
    icon: '🏢',
    email: 'hod.cse@college.edu',
    color: '#16A34A',
    bg: '#F0FDF4',
  },
  {
    role: 'FACULTY',
    label: 'Faculty',
    icon: '👨‍🏫',
    email: 'faculty.alan@college.edu',
    color: '#D97706',
    bg: '#FEF3C7',
  },
  {
    role: 'STUDENT',
    label: 'Student',
    icon: '🎓',
    email: 'student.alex@college.edu',
    color: '#059669',
    bg: '#ECFDF5',
  },
];

export default function LoginScreen() {
  const router = useRouter();
  const { login, isAuthenticated, user, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState(null);

  // Redirect already authenticated users directly to their assigned role dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const destination = getRoleRoute(user.role);
      router.replace(destination);
    }
  }, [isLoading, isAuthenticated, user]);

  const handleSelectDemo = (account) => {
    setEmail(account.email);
    setPassword('Password@123');
    setSelectedDemoRole(account.role);
    setErrorMessage('');
  };

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Please enter your institutional email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const result = await login(trimmedEmail, password);
      if (result?.success && result?.user?.role) {
        const destination = getRoleRoute(result.user.role);
        router.replace(destination);
      }
    } catch (err) {
      setErrorMessage(
        err.message || 'Authentication failed. Please verify credentials and backend connectivity.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header & Logo Banner */}
          <View style={styles.header}>
            <View style={styles.brandIconContainer}>
              <Text style={styles.brandIconText}>🏛️</Text>
            </View>
            <Text style={styles.title}>Veritas Portal</Text>
            <Text style={styles.subtitle}>
              Sign in with institutional credentials to access your academic dashboard.
            </Text>
          </View>

          {/* Quick Demo Accounts Selection */}
          <View style={styles.demoSection}>
            <Text style={styles.demoSectionTitle}>⚡ ONE-TAP DEMO ACCOUNTS</Text>
            <View style={styles.demoRow}>
              {DEMO_ACCOUNTS.map((acc) => {
                const isSelected = selectedDemoRole === acc.role;
                return (
                  <TouchableOpacity
                    key={acc.role}
                    activeOpacity={0.7}
                    onPress={() => handleSelectDemo(acc)}
                    style={[
                      styles.demoPill,
                      { backgroundColor: acc.bg, borderColor: isSelected ? acc.color : 'transparent' },
                      isSelected && styles.demoPillSelected,
                    ]}
                  >
                    <Text style={styles.demoPillIcon}>{acc.icon}</Text>
                    <Text style={[styles.demoPillText, { color: acc.color }]}>{acc.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Login Form Card */}
          <Card style={styles.formCard}>
            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={18} color={COLORS.danger} style={styles.errorIcon} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Institutional Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setSelectedDemoRole(null);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="name@college.edu"
                  placeholderTextColor={COLORS.textMuted}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  autoCorrect={false}
                  style={styles.input}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <View style={styles.passwordHeader}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                  <Text style={styles.toggleText}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter password"
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity
              onPress={() => setShowForgotModal(true)}
              style={styles.forgotPasswordContainer}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <Button
              title={isSubmitting ? 'Authenticating...' : 'Sign In'}
              variant="primary"
              loading={isSubmitting}
              onPress={handleLogin}
              style={styles.loginButton}
            />
          </Card>

          {/* Institutional Compliance Notice */}
          <View style={styles.noticeCard}>
            <View style={styles.noticeHeaderRow}>
              <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
              <Text style={styles.noticeHeading}>Official Institutional Access</Text>
            </View>
            <Text style={styles.noticeText}>
              Access is restricted to authorized College Administrators, Department Staff, Faculty, and Enrolled Students. All sessions are encrypted with secure JWT storage.
            </Text>
          </View>

          {/* Return to Welcome Screen */}
          <Button
            title="← Back to Welcome Screen"
            variant="outline"
            onPress={() => router.replace('/')}
            style={styles.returnButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot Password Modal */}
      <Modal
        visible={showForgotModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowForgotModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalCard}>
            <View style={styles.modalIconCircle}>
              <Text style={styles.modalIconText}>🔑</Text>
            </View>
            <Text style={styles.modalTitle}>Password Recovery</Text>
            <Text style={styles.modalBody}>
              Self-service password reset is disabled for institutional security.
              {'\n\n'}
              Please contact your College IT Administrator or Department Office with your institutional ID to request a password reset.
            </Text>
            <Button
              title="Understood"
              variant="primary"
              onPress={() => setShowForgotModal(false)}
              style={styles.modalButton}
            />
          </Card>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  brandIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  brandIconText: {
    fontSize: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  demoSection: {
    marginBottom: 16,
  },
  demoSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 8,
    paddingLeft: 2,
  },
  demoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  demoPill: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoPillSelected: {
    transform: [{ scale: 1.03 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  demoPillIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  demoPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  formCard: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    fontSize: 13,
    color: COLORS.danger,
    lineHeight: 18,
    flex: 1,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 16,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  toggleText: {
    fontSize: 12,
    color: COLORS.primaryLight,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FAFAFA',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 18,
  },
  forgotPasswordText: {
    fontSize: 12,
    color: COLORS.primaryLight,
    fontWeight: '600',
  },
  loginButton: {
    width: '100%',
    borderRadius: 10,
    paddingVertical: 14,
  },
  noticeCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 14,
    marginBottom: 16,
  },
  noticeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  noticeHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  noticeText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  returnButton: {
    width: '100%',
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    padding: 24,
    alignItems: 'center',
    borderRadius: 16,
  },
  modalIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalIconText: {
    fontSize: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalBody: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalButton: {
    width: '100%',
    borderRadius: 10,
  },
});
