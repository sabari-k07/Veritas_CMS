import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';
import { RoleBadge } from './RoleBadge';

export function UserProfileBar({ currentRole }) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <View style={styles.container}>
      <View style={styles.userSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userInitial}</Text>
        </View>
        <View style={styles.userInfo}>
          <RoleBadge role={user?.role || currentRole} style={styles.badge} />
          <Text style={styles.emailText} numberOfLines={1}>
            {user?.email || 'Authenticated Session'}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleLogout}
        style={styles.logoutButton}
      >
        <Ionicons name="log-out-outline" size={16} color={COLORS.danger} style={{ marginRight: 4 }} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  badge: {
    marginBottom: 3,
  },
  emailText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.danger,
  },
});

export default UserProfileBar;
