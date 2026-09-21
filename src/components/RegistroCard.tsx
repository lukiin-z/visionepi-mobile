// ============================================================
//  VisionEPI — Componente RegistroCard
//  Exibe um registro de detecção vindo da API na lista.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { DeteccaoEpi, statusDoRisco, episAusentes, episPresentes } from "../types";
import {
  Colors, StatusConfig, EPILabels, EPIIcons,
  Typography, Spacing, Radius, Shadow,
} from "./theme";

interface RegistroCardProps {
  registro: DeteccaoEpi;
  onPress: (id: number) => void;
}

function formatarData(iso: string): string {
  const d = new Date(iso);
  const data = d.toLocaleDateString("pt-BR");
  const hora = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${data} às ${hora}`;
}

export function RegistroCard({ registro, onPress }: RegistroCardProps) {
  const cfg = StatusConfig[statusDoRisco(registro.nivelRisco)];
  const ausentes  = episAusentes(registro);
  const presentes = episPresentes(registro);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(registro.id)}
      activeOpacity={0.75}
    >
      <View style={[styles.sideBar, { backgroundColor: cfg.color }]} />

      <View style={styles.body}>
        {/* Operador + badge de status */}
        <View style={styles.row}>
          <Text style={styles.operador}>{registro.nomeOperador}</Text>
          <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.badgeText, { color: cfg.color }]}>
              {cfg.emoji} {cfg.label}
            </Text>
          </View>
        </View>

        {/* Setor e matrícula */}
        <View style={styles.row}>
          <Text style={styles.metaText}>📍 {registro.setor}</Text>
          <Text style={styles.metaText}>🪪 {registro.matricula}</Text>
        </View>

        <Text style={styles.metaText}>📷 {registro.descricaoCamera}</Text>

        {/* EPIs ausentes — destaque */}
        {ausentes.length > 0 && (
          <View style={styles.episRow}>
            <Text style={styles.episLabel}>Ausentes: </Text>
            {ausentes.map((epi) => (
              <View key={epi} style={styles.epiChip}>
                <Text style={styles.epiChipText}>
                  {EPIIcons[epi]} {EPILabels[epi]}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* EPIs presentes */}
        {presentes.length > 0 && (
          <View style={styles.episRow}>
            <Text style={[styles.episLabel, { color: Colors.normal }]}>Presentes: </Text>
            {presentes.map((epi) => (
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
          <Text style={styles.footerText}>🕐 {formatarData(registro.dataDeteccao)}</Text>
          <Text style={styles.footerText}>
            Confiança: {registro.confianca.toFixed(1)}% · Risco {registro.nivelRisco}/5
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
  sideBar: { width: 5 },
  body: { flex: 1, padding: Spacing.md, gap: Spacing.xs },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  operador: { ...Typography.h3, fontSize: 15 },
  badge: { paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.full },
  badgeText: { fontSize: 12, fontWeight: "600" },
  metaText: { ...Typography.small, color: Colors.textSecondary },
  episRow: {
    flexDirection: "row", alignItems: "center", flexWrap: "wrap",
    gap: Spacing.xs, marginTop: 2,
  },
  episLabel: { fontSize: 12, fontWeight: "600", color: Colors.critico },
  epiChip: {
    backgroundColor: Colors.criticoBg,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  epiChipOk: { backgroundColor: Colors.normalBg },
  epiChipText: { fontSize: 11, fontWeight: "500", color: Colors.critico },
  footer: {
    marginTop: Spacing.xs, paddingTop: Spacing.xs,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  footerText: { ...Typography.micro },
});
