import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ROLE_COLORS } from '../../constants/colors';
import { ROLE_LABELS, USER_ROLES } from '../../constants/roles';

export function RoleBadge({ role = USER_ROLES.STUDENT, style, textStyle }) {
  const roleConfig = ROLE_COLORS[role] || {
    background: '#F1F5F9',
    accent: '#64748B',
  };

  const label = ROLE_LABELS[role] || role;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: roleConfig.background,
          borderColor: roleConfig.accent + '33',
        },
        style,
      ]}
    >
      <View style={[styles.indicatorDot, { backgroundColor: roleConfig.accent }]} />
      <Text style={[styles.badgeText, { color: roleConfig.accent }, textStyle]}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default RoleBadge;
