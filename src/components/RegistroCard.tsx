// ============================================================
//  VisionEPI — Componente RegistroCard
//  Exibe um registro de detecção de EPI na lista.
// ============================================================

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { DeteccaoEPI } from "../types";
import {
  Colors,
  StatusConfig,
  EPILabels,
  EPIIcons,
  Typography,
  Spacing,
  Radius,
  Shadow,
} from "./theme";

interface RegistroCardProps {
  registro: DeteccaoEPI;
  onPress: (id: number) => void;
}

function formatarData(iso: string): string {
  const d = new Date(iso);
  const data = d.toLocaleDateString("pt-BR");
  const hora = d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${data} às ${hora}`;
}

export function RegistroCard({ registro, onPress }: RegistroCardProps) {
  const cfg = StatusConfig[registro.status];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(registro.id)}
      activeOpacity={0.75}
    >
      {/* Barra lateral colorida */}
      <View style={[styles.sideBar, { backgroundColor: cfg.color }]} />

      <View style={styles.body}>
        {/* Linha superior: operador + badge status */}
        <View style={styles.row}>
          <Text style={styles.operador}>{registro.nome}</Text>
          <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.badgeText, { color: cfg.color }]}>
              {cfg.emoji} {cfg.label}
            </Text>
          </View>
        </View>

        {/* Zona e câmera */}
        <View style={styles.row}>
          <Text style={styles.metaText}>📍 {registro.zona}</Text>
          <Text style={styles.metaText}>📷 {registro.camera}</Text>
        </View>

        {/* EPIs ausentes — destaque */}
        {registro.episAusentes.length > 0 && (
          <View style={styles.episRow}>
            <Text style={styles.episLabel}>Ausentes: </Text>
            {registro.episAusentes.map((epi) => (
              <View key={epi} style={styles.epiChip}>
                <Text style={styles.epiChipText}>
                  {EPIIcons[epi]} {EPILabels[epi]}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* EPIs presentes */}
        {registro.episPresentes.length > 0 && (
          <View style={styles.episRow}>
            <Text style={[styles.episLabel, { color: Colors.normal }]}>
              Presentes:{" "}
            </Text>
            {registro.episPresentes.map((epi) => (
              <View key={epi} style={[styles.epiChip, styles.epiChipOk]}>
                <Text style={[styles.epiChipText, { color: Colors.normal }]}>
                  {EPIIcons[epi]} {EPILabels[epi]}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Rodapé: data + confiança */}
        <View style={[styles.row, styles.footer]}>
          <Text style={styles.footerText}>🕐 {formatarData(registro.data)}</Text>
          <Text style={styles.footerText}>
            Confiança: {Math.round(registro.confianca * 100)}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs + 2,
    overflow: "hidden",
    ...Shadow.card,
  },
  sideBar: {
    width: 5,
  },
  body: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  operador: {
    ...Typography.h3,
    fontSize: 15,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  metaText: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  episRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.xs,
    marginTop: 2,
  },
  episLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.critico,
  },
  epiChip: {
    backgroundColor: Colors.criticoBg,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  epiChipOk: {
    backgroundColor: Colors.normalBg,
  },
  epiChipText: {
    fontSize: 11,
    fontWeight: "500",
    color: Colors.critico,
  },
  footer: {
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerText: {
    ...Typography.micro,
  },
});
