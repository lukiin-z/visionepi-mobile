// ============================================================
//  VisionEPI — Tela de Alertas
//  Lista todos os alertas gerados pelo sistema.
//  Futura integração: GET /api/alertas
// ============================================================

import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList, Alerta } from "../types";
import { alertasMock } from "../data/mock";
import { EmptyState } from "../components/EmptyState";
import { Colors, Spacing, Typography, Radius, Shadow } from "../components/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Alertas">;

const STATUS_COLORS: Record<Alerta["status"], { bg: string; text: string; label: string }> = {
  PENDENTE:  { bg: Colors.criticoBg, text: Colors.critico, label: "🔴 Pendente" },
  RESOLVIDO: { bg: Colors.normalBg,  text: Colors.normal,  label: "🟢 Resolvido" },
  EXPIRADO:  { bg: "#F5F5F5",        text: Colors.textMuted, label: "⚫ Expirado" },
};

const TIPO_LABELS: Record<Alerta["tipoAlerta"], string> = {
  VIOLACAO_EPI:   "⛑️ Violação de EPI",
  RISCO_POSTURAL: "🦴 Risco Postural",
  ZONA_PROIBIDA:  "🚧 Zona Proibida",
};

export function AlertasScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  // Estado local: em integração real virá da API
  const [alertas, setAlertas] = useState<Alerta[]>(alertasMock);

  const pendentes  = alertas.filter((a) => a.status === "PENDENTE").length;
  const resolvidos = alertas.filter((a) => a.status === "RESOLVIDO").length;

  function marcarResolvido(id: number) {
    setAlertas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "RESOLVIDO" as const } : a))
    );
  }

  function formatarData(iso: string) {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🔔 Alertas</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statVal, { color: Colors.critico }]}>{pendentes}</Text>
            <Text style={styles.statLabel}>Pendentes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={[styles.statVal, { color: Colors.normal }]}>{resolvidos}</Text>
            <Text style={styles.statLabel}>Resolvidos</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={alertas}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const sc = STATUS_COLORS[item.status];
          return (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.tipoText}>{TIPO_LABELS[item.tipoAlerta]}</Text>
                <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                  <Text style={[styles.statusBadgeText, { color: sc.text }]}>
                    {sc.label}
                  </Text>
                </View>
              </View>

              <Text style={styles.mensagem}>{item.mensagem}</Text>

              <View style={styles.cardFooter}>
                <Text style={styles.footerText}>
                  🕐 {formatarData(item.dataAlerta)}
                </Text>
                <Text style={styles.footerText}>ID #{item.id}</Text>
              </View>

              {item.status === "PENDENTE" && (
                <TouchableOpacity
                  style={styles.resolverBtn}
                  onPress={() => marcarResolvido(item.id)}
                >
                  <Text style={styles.resolverBtnText}>✅  Marcar como Resolvido</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            emoji="🎉"
            title="Nenhum alerta registrado"
            subtitle="O sistema não detectou violações no período atual."
          />
        }
        contentContainerStyle={{
          padding: Spacing.md,
          gap: Spacing.sm,
          paddingBottom: insets.bottom + Spacing.xl,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.navy,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  backBtn:     { alignSelf: "flex-start" },
  backText:    { color: "rgba(255,255,255,0.8)", fontSize: 14 },
  headerTitle: { ...Typography.h2, color: Colors.white },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: Radius.md,
    padding: Spacing.sm,
  },
  stat: { flex: 1, alignItems: "center" },
  statVal:    { fontSize: 22, fontWeight: "700", color: Colors.white },
  statLabel:  { fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  statDivider:{ width: 1, backgroundColor: "rgba(255,255,255,0.2)" },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadow.card,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tipoText: { fontSize: 13, fontWeight: "700", color: Colors.navy, flex: 1 },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  statusBadgeText: { fontSize: 11, fontWeight: "600" },
  mensagem: {
    ...Typography.body,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerText: { ...Typography.micro },
  resolverBtn: {
    backgroundColor: Colors.normalBg,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.normal,
  },
  resolverBtnText: { color: Colors.normal, fontWeight: "600", fontSize: 13 },
});
