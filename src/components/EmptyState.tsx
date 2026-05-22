// ============================================================
//  VisionEPI — Componente EmptyState
//  Exibido quando uma lista não possui registros.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, Typography, Spacing } from "./theme";

interface EmptyStateProps {
  emoji?: string;
  title: string;
  subtitle?: string;
}

export function EmptyState({
  emoji = "📭",
  title,
  subtitle,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
  },
  emoji: {
    fontSize: 52,
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h3,
    textAlign: "center",
    marginBottom: Spacing.sm,
    color: Colors.textSecondary,
  },
  subtitle: {
    ...Typography.body,
    textAlign: "center",
    color: Colors.textMuted,
    lineHeight: 20,
  },
});
