import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, ROLE_COLORS } from '../src/constants/colors';
import { USER_ROLES, ROLE_ROUTES } from '../src/constants/roles';
import { useApiStatus } from '../src/hooks/useApiStatus';
import { useAuth } from '../src/hooks/useAuth';
import { Card, Button, RoleBadge } from '../src/components';

const ROLE_PREVIEWS = [
  {
    role: USER_ROLES.ADMIN,
    title: 'College Administrator',
    email: 'admin@college.edu',
    icon: '🏛️',
    desc: 'Institution-wide metrics, departments, and user governance.',
    accent: ROLE_COLORS[USER_ROLES.ADMIN].accent,
    bg: ROLE_COLORS[USER_ROLES.ADMIN].background,
  },
  {
    role: USER_ROLES.DEPARTMENT_STAFF,
    title: 'Department Staff / HOD',
    email: 'hod.cse@college.edu',
    icon: '🏢',
    desc: 'Department allocations, faculty timetables, and batch governance.',
    accent: ROLE_COLORS[USER_ROLES.DEPARTMENT_STAFF].accent,
    bg: ROLE_COLORS[USER_ROLES.DEPARTMENT_STAFF].background,
  },
  {
    role: USER_ROLES.FACULTY,
    title: 'Faculty Member',
    email: 'faculty.alan@college.edu',
    icon: '👨‍🏫',
    desc: 'Class attendance, PIN session generation, and student grading.',
    accent: ROLE_COLORS[USER_ROLES.FACULTY].accent,
    bg: ROLE_COLORS[USER_ROLES.FACULTY].background,
  },
  {
    role: USER_ROLES.STUDENT,
    title: 'Student Scholar',
    email: 'student.alex@college.edu',
    icon: '🎓',
    desc: 'Live attendance telemetry, enrolled courses, and notices.',
    accent: ROLE_COLORS[USER_ROLES.STUDENT].accent,
    bg: ROLE_COLORS[USER_ROLES.STUDENT].background,
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const { data: healthData, isLoading, isError, refetch, isFetching } = useApiStatus();
  const { isAuthenticated, user, role, login, logout } = useAuth();
  const [loggingInRole, setLoggingInRole] = useState(null);

  const handleQuickLogin = async (email, targetRole) => {
    try {
      setLoggingInRole(targetRole);
      const res = await login(email, 'Password@123');
      if (res?.success) {
        router.push(ROLE_ROUTES[targetRole] || '/');
      }
    } catch {
      router.push('/(auth)/login');
    } finally {
      setLoggingInRole(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Institutional Header */}
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View style={styles.crestContainer}>
              <Text style={styles.crestText}>🏛️</Text>
            </View>
            <View style={styles.brandTextGroup}>
              <Text style={styles.brandInstitution}>VERITAS INSTITUTION</Text>
              <Text style={styles.brandApp}>College Management Portal</Text>
            </View>
          </View>

          {/* Sleek Live Server Status Chip */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => refetch()}
            style={[
              styles.statusChip,
              isError ? styles.statusChipOffline : styles.statusChipOnline,
            ]}
          >
            {isLoading || isFetching ? (
              <ActivityIndicator size="small" color={COLORS.primary} style={{ marginRight: 6 }} />
            ) : (
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isError ? COLORS.danger : COLORS.success },
                ]}
              />
            )}
            <Text style={styles.statusChipText}>
              {isLoading || isFetching
                ? 'Connecting...'
                : isError
                  ? 'Offline • Tap Retry'
                  : 'Cloud Online'}
            </Text>
            <Ionicons
              name="refresh-outline"
              size={12}
              color={COLORS.textSecondary}
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
        </View>

        {/* Authentication Card */}
        <Card style={styles.heroCard}>
          {isAuthenticated && user ? (
            <View>
              <View style={styles.userBanner}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </View>
                <View style={styles.userInfo}>
                  <RoleBadge role={role} />
                  <Text style={styles.userEmail} numberOfLines={1}>
                    {user.email}
                  </Text>
                </View>
              </View>

              <Button
                title={`Enter ${role || 'User'} Workspace →`}
                variant="primary"
                onPress={() => router.push(ROLE_ROUTES[role] || '/')}
                style={styles.mainActionButton}
              />
              <Button
                title="Sign Out / Switch Account"
                variant="outline"
                onPress={async () => {
                  await logout();
                  router.push('/(auth)/login');
                }}
                style={styles.secondaryActionButton}
              />
            </View>
          ) : (
            <View>
              <Text style={styles.heroCardTitle}>Academic Role Portal</Text>
              <Text style={styles.heroCardSubtitle}>
                Unified mobile companion for administrators, department staff, faculty, and students.
              </Text>
              <Button
                title="Sign In to Your Account"
                variant="primary"
                onPress={() => router.push('/(auth)/login')}
                style={styles.mainActionButton}
              />
            </View>
          )}
        </Card>

        {/* Quick Role Explorers */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore Roles & Workspaces</Text>
          <Text style={styles.sectionSubtitle}>
            Tap a role to test or sign in directly with verified institutional demo accounts:
          </Text>
        </View>

        {ROLE_PREVIEWS.map((item) => {
          const isLoggingIn = loggingInRole === item.role;
          return (
            <Card key={item.role} style={styles.roleCard}>
              <View style={styles.roleHeader}>
                <View style={[styles.roleIconContainer, { backgroundColor: item.bg }]}>
                  <Text style={styles.roleIcon}>{item.icon}</Text>
                </View>
                <View style={styles.roleDetails}>
                  <Text style={styles.roleTitle}>{item.title}</Text>
                  <Text style={styles.roleDesc}>{item.desc}</Text>
                </View>
              </View>

              <View style={styles.roleActions}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  disabled={isLoggingIn}
                  onPress={() => handleQuickLogin(item.email, item.role)}
                  style={[styles.quickLoginButton, { backgroundColor: item.bg, borderColor: item.accent }]}
                >
                  {isLoggingIn ? (
                    <ActivityIndicator size="small" color={item.accent} />
                  ) : (
                    <>
                      <Ionicons name="flash" size={14} color={item.accent} style={{ marginRight: 4 }} />
                      <Text style={[styles.quickLoginText, { color: item.accent }]}>
                        One-Tap Login
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.push(ROLE_ROUTES[item.role])}
                  style={styles.inspectButton}
                >
                  <Text style={styles.inspectButtonText}>Preview Space</Text>
                  <Ionicons name="chevron-forward" size={14} color={COLORS.primaryLight} />
                </TouchableOpacity>
              </View>
            </Card>
          );
        })}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerInstitution}>Veritas College of Engineering & Technology</Text>
          <Text style={styles.footerNote}>Continuous Academic & Campus Governance Platform • v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  crestContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  crestText: {
    fontSize: 22,
  },
  brandTextGroup: {
    flex: 1,
  },
  brandInstitution: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.8,
  },
  brandApp: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusChipOnline: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  statusChipOffline: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  heroCard: {
    padding: 18,
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  heroCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  heroCardSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  userBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  mainActionButton: {
    width: '100%',
    borderRadius: 10,
    paddingVertical: 14,
    marginBottom: 8,
  },
  secondaryActionButton: {
    width: '100%',
    borderRadius: 10,
    paddingVertical: 10,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  roleCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  roleIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  roleIcon: {
    fontSize: 22,
  },
  roleDetails: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  roleDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  roleActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  quickLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  quickLoginText: {
    fontSize: 12,
    fontWeight: '700',
  },
  inspectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  inspectButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryLight,
    marginRight: 2,
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  footerInstitution: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  footerNote: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
