// ============================================================
//  VisionEPI — Tela Home (Dashboard)
//  Duas chamadas simultâneas à API com Promise.all:
//    GET /deteccoes                     → total e conformidade
//    GET /deteccoes?nivelRiscoMinimo=4  → detecções críticas
//  Estados tratados: carregando, erro (backend fora) e sucesso.
// ============================================================

import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList, DeteccaoEpi, statusDoRisco } from "../types";
import { listar, listarPorRiscoMinimo } from "../services/deteccaoService";
import { BASE_URL } from "../services/api";
import { Colors, Spacing, Typography, Radius, Shadow } from "../components/theme";
import { StatusBadge } from "../components/StatusBadge";
import { EmptyState } from "../components/EmptyState";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const [registros, setRegistros] = useState<DeteccaoEpi[]>([]);
  const [criticas, setCriticas]   = useState<DeteccaoEpi[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      setErro(null);
      // Duas chamadas em paralelo (requisito da Sprint 3).
      const [todas, deAltoRisco] = await Promise.all([
        listar(),
        listarPorRiscoMinimo(4),
      ]);
      setRegistros(todas);
      setCriticas(deAltoRisco);
    } catch (e) {
      setErro(
        "Não foi possível conectar ao backend em " + BASE_URL +
        ". Suba a API Spring Boot e toque em Tentar novamente."
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setCarregando(true);
      carregar();
    }, [carregar])
  );

  const total     = registros.length;
  const conformes = registros.filter((r) => statusDoRisco(r.nivelRisco) === "normal").length;
  const atencao   = registros.filter((r) => statusDoRisco(r.nivelRisco) === "alerta").length;
  const conformidade = total > 0 ? Math.round((conformes / total) * 100) : 100;

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
        {/* Estado: carregando */}
        {carregando && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={Colors.blue} />
            <Text style={styles.loadingText}>Consultando a API...</Text>
          </View>
        )}

        {/* Estado: erro */}
        {!carregando && erro && (
          <View style={styles.center}>
            <EmptyState emoji="📡" title="Backend indisponível" subtitle={erro} />
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => {
                setCarregando(true);
                carregar();
              }}
            >
              <Text style={styles.retryText}>🔄  Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Estado: sucesso */}
        {!carregando && !erro && (
          <>
            <Text style={styles.sectionTitle}>Resumo do Turno</Text>
            <View style={styles.kpiGrid}>
              <KPICard label="Conformidade" value={conformidade + "%"}       color={Colors.normal}  bg={Colors.normalBg} />
              <KPICard label="Detecções"    value={String(total)}            color={Colors.blue}    bg="#EEF3FA" />
              <KPICard label="Críticas"     value={String(criticas.length)}  color={Colors.critico} bg={Colors.criticoBg} />
              <KPICard label="Atenção"      value={String(atencao)}          color={Colors.alerta}  bg={Colors.alertaBg} />
            </View>

            <Text style={styles.sectionTitle}>Ações</Text>
            <View style={styles.actionsGrid}>
              <ActionCard emoji="📋" label="Ver Registros" onPress={() => navigation.navigate("Lista")} />
              <ActionCard emoji="➕" label="Novo Registro" onPress={() => navigation.navigate("Cadastro")} />
              <ActionCard
                emoji="🚨"
                label="Alto Risco"
                onPress={() => navigation.navigate("Lista")}
                badge={criticas.length > 0 ? String(criticas.length) : undefined}
              />
            </View>

            <Text style={styles.sectionTitle}>Últimas Detecções</Text>
            {registros.length === 0 && (
              <Text style={styles.emptyText}>
                Nenhuma detecção na API ainda — cadastre a primeira em "Novo Registro".
              </Text>
            )}
            {registros.slice(-3).reverse().map((r) => (
              <TouchableOpacity
                key={r.id}
                style={styles.miniCard}
                onPress={() => navigation.navigate("Detalhe", { id: r.id })}
                activeOpacity={0.75}
              >
                <View style={styles.miniCardLeft}>
                  <Text style={styles.miniOperador}>{r.nomeOperador}</Text>
                  <Text style={styles.miniZona}>
                    📍 {r.setor}  •  📷 {r.descricaoCamera}
                  </Text>
                </View>
                <StatusBadge status={statusDoRisco(r.nivelRisco)} size="sm" />
              </TouchableOpacity>
            ))}
          </>
        )}
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
  scroll: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.navy,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  headerTitle: { ...Typography.h1, color: Colors.white, fontSize: 26 },
  headerSub:   { color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 2 },
  headerDate:  { color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 6 },
  content: { padding: Spacing.md, gap: Spacing.sm },
  center: { alignItems: "center", justifyContent: "center", paddingVertical: Spacing.xl },
  loadingText: { ...Typography.small, marginTop: Spacing.sm },
  retryBtn: {
    backgroundColor: Colors.blue,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
  },
  retryText: { color: Colors.white, fontWeight: "700" },
  emptyText: { ...Typography.small, color: Colors.textMuted },
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
  miniCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.sm,
    ...Shadow.card,
  },
  miniCardLeft: { flex: 1, gap: 2 },
  miniOperador: { ...Typography.h3, fontSize: 14 },
  miniZona: { ...Typography.small, color: Colors.textSecondary },
});
