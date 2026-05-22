// ============================================================
//  VisionEPI — Componente StatusBadge
//  Badge reutilizável para exibir status de conformidade.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { StatusEPI } from "../types";
import { StatusConfig, Radius, Spacing } from "./theme";

interface StatusBadgeProps {
  status: StatusEPI;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const cfg = StatusConfig[status];
  const fontSize = size === "sm" ? 11 : size === "lg" ? 16 : 13;
  const px = size === "sm" ? Spacing.sm : size === "lg" ? Spacing.lg : Spacing.md;
  const py = size === "sm" ? 2 : size === "lg" ? 8 : 4;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: cfg.bg,
          paddingHorizontal: px,
          paddingVertical: py,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          { fontSize, color: cfg.color, fontWeight: size === "lg" ? "700" : "600" },
        ]}
      >
        {cfg.emoji}  {cfg.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: Radius.full,
    alignSelf: "flex-start",
  },
  text: {
    letterSpacing: 0.3,
  },
});
