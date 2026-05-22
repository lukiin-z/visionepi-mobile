// ============================================================
//  VisionEPI — Tela Home (Dashboard)
//  Exibe resumo estatístico dos registros e alertas ativos.
// ============================================================

import React, { useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList } from "../types";
import { DeteccoesContext } from "../navigation/DeteccoesContext";
import { alertasMock, zonasMock } from "../data/mock";
import { Colors, Spacing, Typography, Radius, Shadow } from "../components/theme";
import { StatusBadge } from "../components/StatusBadge";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { registros } = useContext(DeteccoesContext);

  const total    = registros.length;
  const criticos = registros.filter((r) => r.status === "critico").length;
  const alertas  = registros.filter((r) => r.status === "alerta").length;
  const normais  = registros.filter((r) => r.status === "normal").length;
  const conformidade = total > 0 ? Math.round((normais / total) * 100) : 100;
  const alertasPendentes = alertasMock.filter((a) => a.status === "PENDENTE").length;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xl }}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Text style={styles.headerTitle}>⛑️ VisionEPI</Text>
        <Text style={styles.headerSub}>Sistema de Segurança Industrial</Text>
        <Text style={styles.headerDate}>
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long", day: "numeric", month: "long", year: "numeric",
          })}
        </Text>
      </View>

      <View style={styles.content}>
        {/* KPI Cards */}
        <Text style={styles.sectionTitle}>Resumo do Turno</Text>
        <View style={styles.kpiGrid}>
          <KPICard label="Conformidade" value={`${conformidade}%`} color={Colors.normal} bg={Colors.normalBg} />
          <KPICard label="Críticos"     value={String(criticos)}   color={Colors.critico} bg={Colors.criticoBg} />
          <KPICard label="Alertas"      value={String(alertas)}    color={Colors.alerta}  bg={Colors.alertaBg} />
          <KPICard label="Alertas Pend." value={String(alertasPendentes)} color={Colors.blue} bg="#EEF3FA" />
        </View>

        {/* Ações rápidas */}
        <Text style={styles.sectionTitle}>Ações</Text>
        <View style={styles.actionsGrid}>
          <ActionCard
            emoji="📋"
            label="Ver Registros"
            onPress={() => navigation.navigate("Lista")}
          />
          <ActionCard
            emoji="➕"
            label="Novo Registro"
            onPress={() => navigation.navigate("Cadastro")}
          />
          <ActionCard
            emoji="🔔"
            label="Alertas"
            onPress={() => navigation.navigate("Alertas")}
            badge={alertasPendentes > 0 ? String(alertasPendentes) : undefined}
          />
        </View>

        {/* Zonas */}
        <Text style={styles.sectionTitle}>Zonas de Risco</Text>
        {zonasMock.map((zona) => (
          <View key={zona.id} style={styles.zonaCard}>
            <View style={styles.zonaInfo}>
              <Text style={styles.zonaNome}>{zona.nome}</Text>
              <Text style={styles.zonaTipo}>{zona.tipoRisco}</Text>
            </View>
            <View style={styles.zonaRight}>
              <Text style={styles.zonaConf}>{zona.percentualConformidade}%</Text>
              <StatusBadge status={zona.nivelRisco} size="sm" />
            </View>
          </View>
        ))}

        {/* Últimas detecções */}
        <Text style={styles.sectionTitle}>Últimas Detecções</Text>
        {registros.slice(0, 3).map((r) => (
          <TouchableOpacity
            key={r.id}
            style={styles.miniCard}
            onPress={() => navigation.navigate("Detalhe", { id: r.id })}
            activeOpacity={0.75}
          >
            <View style={styles.miniCardLeft}>
              <Text style={styles.miniOperador}>{r.nome}</Text>
              <Text style={styles.miniZona}>📍 {r.zona}  •  📷 {r.camera}</Text>
            </View>
            <StatusBadge status={r.status} size="sm" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

function KPICard({
  label, value, color, bg,
}: { label: string; value: string; color: string; bg: string }) {
  return (
    <View style={[styles.kpiCard, { backgroundColor: bg }]}>
      <Text style={[styles.kpiValue, { color }]}>{value}</Text>
      <Text style={[styles.kpiLabel, { color }]}>{label}</Text>
    </View>
  );
}

function ActionCard({
  emoji, label, onPress, badge,
}: { emoji: string; label: string; onPress: () => void; badge?: string }) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.actionEmoji}>{emoji}</Text>
      <Text style={styles.actionLabel}>{label}</Text>
      {badge && (
        <View style={styles.actionBadge}>
          <Text style={styles.actionBadgeText}>{badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scroll:   { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.navy,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  headerTitle: { ...Typography.h1, color: Colors.white, fontSize: 26 },
  headerSub:   { color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 2 },
  headerDate:  { color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 6 },
  content:    { padding: Spacing.md, gap: Spacing.sm },
  sectionTitle: {
    ...Typography.h3,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    color: Colors.navy,
  },
  kpiGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  kpiCard: {
    flex: 1,
    minWidth: "44%",
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: "center",
    ...Shadow.card,
  },
  kpiValue: { fontSize: 28, fontWeight: "700" },
  kpiLabel: { fontSize: 12, fontWeight: "500", marginTop: 2 },

  actionsGrid: { flexDirection: "row", gap: Spacing.sm },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: "center",
    gap: Spacing.xs,
    ...Shadow.card,
  },
  actionEmoji: { fontSize: 26 },
  actionLabel: { fontSize: 12, fontWeight: "600", color: Colors.navy, textAlign: "center" },
  actionBadge: {
    backgroundColor: Colors.critico,
    borderRadius: Radius.full,
    paddingHorizontal: 6,
    paddingVertical: 1,
    position: "absolute",
    top: 6,
    right: 6,
  },
  actionBadgeText: { color: Colors.white, fontSize: 10, fontWeight: "700" },

  zonaCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
    ...Shadow.card,
  },
  zonaInfo: { flex: 1 },
  zonaNome: { ...Typography.h3, fontSize: 14 },
  zonaTipo: { ...Typography.small, marginTop: 2 },
  zonaRight: { alignItems: "flex-end", gap: 4 },
  zonaConf: { fontSize: 18, fontWeight: "700", color: Colors.navy },

  miniCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
    ...Shadow.card,
  },
  miniCardLeft: { flex: 1 },
  miniOperador: { ...Typography.h3, fontSize: 14 },
  miniZona:     { ...Typography.micro, marginTop: 3 },
});
