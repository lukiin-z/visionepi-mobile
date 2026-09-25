// ============================================================
//  VisionEPI — Tela Detalhe do Registro
//  GET /deteccoes/{id} via camada de serviços.
//  Estados tratados: carregando, erro e sucesso.
// ============================================================

import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  RootStackParamList, DeteccaoEpi,
  statusDoRisco, episAusentes, episPresentes,
} from "../types";
import { buscarPorId, remover } from "../services/deteccaoService";
import { BASE_URL } from "../services/api";
import { StatusBadge } from "../components/StatusBadge";
import { EmptyState } from "../components/EmptyState";
import {
  Colors, Spacing, Typography, Radius, Shadow,
  EPILabels, EPIIcons,
} from "../components/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Detalhe">;

function formatarDataCompleta(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    weekday: "long", day: "numeric", month: "long",
    year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

export function DetalheScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { id } = route.params;

  const [registro, setRegistro] = useState<DeteccaoEpi | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      setErro(null);
      const dados = await buscarPorId(id);
      setRegistro(dados);
    } catch (e) {
      setErro(
        "Não foi possível carregar a detecção #" + id + " em " + BASE_URL +
        ". Verifique se a API Spring Boot está rodando."
      );
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function confirmarRemocao() {
    if (!registro) return;
    Alert.alert(
      "Remover Registro",
      "Deseja remover a detecção do operador " + registro.nomeOperador + "?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              await remover(id);
              navigation.goBack();
            } catch (e) {
              Alert.alert("Erro", "Não foi possível remover o registro na API.");
            }
          },
        },
      ]
    );
  }

  if (carregando) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.blue} />
        <Text style={styles.loadingText}>Carregando detecção #{id}...</Text>
      </View>
    );
  }

  if (erro || !registro) {
    return (
      <View style={styles.center}>
        <EmptyState
          emoji="📡"
          title="Não foi possível carregar"
          subtitle={erro ?? "Registro não encontrado na API."}
        />
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => {
            setCarregando(true);
            carregar();
          }}
        >
          <Text style={styles.retryText}>🔄  Tentar novamente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.voltarBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.voltarText}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const ausentes  = episAusentes(registro);
  const presentes = episPresentes(registro);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xl }}
    >
      {/* Header colorido por status */}
      <View style={[styles.headerBlock, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerOperador}>{registro.nomeOperador}</Text>
        <Text style={styles.headerId}>
          ID #{registro.id} · Matrícula {registro.matricula}
        </Text>
        <StatusBadge status={statusDoRisco(registro.nivelRisco)} size="lg" />
      </View>

      <View style={styles.content}>
        {/* Localização */}
        <Section title="📍 Localização">
          <InfoRow label="Setor"  value={registro.setor} />
          <InfoRow label="Câmera" value={registro.descricaoCamera} />
        </Section>

        {/* Detecção */}
        <Section title="🤖 Resultado da Detecção">
          <InfoRow
            label="Confiança do modelo"
            value={registro.confianca.toFixed(1) + "%"}
            highlight={registro.confianca >= 85}
          />
          <InfoRow label="Nível de risco" value={registro.nivelRisco + " / 5"} />
          <InfoRow label="Data e hora" value={formatarDataCompleta(registro.dataDeteccao)} />
        </Section>

        {/* EPIs */}
        <Section title="⛑️ EPIs Verificados">
          {presentes.length > 0 && (
            <View style={styles.episGroup}>
              <Text style={styles.episGroupLabel}>✅ Presentes</Text>
              <View style={styles.episChipsRow}>
                {presentes.map((epi) => (
                  <View key={epi} style={[styles.epiChip, styles.epiChipOk]}>
                    <Text style={styles.epiChipOkText}>
                      {EPIIcons[epi]}  {EPILabels[epi]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          {ausentes.length > 0 ? (
            <View style={styles.episGroup}>
              <Text style={styles.episGroupLabel}>❌ Ausentes</Text>
              <View style={styles.episChipsRow}>
                {ausentes.map((epi) => (
                  <View key={epi} style={[styles.epiChip, styles.epiChipBad]}>
                    <Text style={styles.epiChipBadText}>
                      {EPIIcons[epi]}  {EPILabels[epi]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <Text style={styles.allOkText}>
              ✅ Todos os EPIs identificados corretamente.
            </Text>
          )}
        </Section>

        {/* Ações */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={confirmarRemocao}
          activeOpacity={0.8}
        >
          <Text style={styles.deleteBtnText}>🗑️  Remover Registro</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sectionStyles.container}>
      <Text style={sectionStyles.title}>{title}</Text>
      <View style={sectionStyles.card}>{children}</View>
    </View>
  );
}

function InfoRow({
  label, value, highlight = false,
}: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={infoStyles.row}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={[infoStyles.value, highlight && { color: Colors.normal, fontWeight: "700" }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  center: {
    flex: 1, alignItems: "center", justifyContent: "center",
    padding: Spacing.md, backgroundColor: Colors.background,
  },
  loadingText: { ...Typography.small, marginTop: Spacing.sm },
  retryBtn: {
    backgroundColor: Colors.blue,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
  },
  retryText: { color: Colors.white, fontWeight: "700" },
  voltarBtn: { marginTop: Spacing.sm, paddingVertical: Spacing.sm },
  voltarText: { color: Colors.blue, fontWeight: "600" },
  headerBlock: {
    backgroundColor: Colors.navy,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  backBtn: { alignSelf: "flex-start" },
  backText: { color: "rgba(255,255,255,0.8)", fontSize: 14 },
  headerOperador: { ...Typography.h1, color: Colors.white, fontSize: 22 },
  headerId:       { color: "rgba(255,255,255,0.6)", fontSize: 12 },
  content: { padding: Spacing.md, gap: Spacing.md },
  episGroup: { marginBottom: Spacing.sm },
  episGroupLabel: {
    fontSize: 13, fontWeight: "600",
    color: Colors.textSecondary, marginBottom: Spacing.xs,
  },
  episChipsRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.xs },
  epiChip: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  epiChipOk:  { backgroundColor: Colors.normalBg },
  epiChipBad: { backgroundColor: Colors.criticoBg },
  epiChipOkText:  { fontSize: 13, color: Colors.normal,  fontWeight: "500" },
  epiChipBadText: { fontSize: 13, color: Colors.critico, fontWeight: "600" },
  allOkText: { color: Colors.normal, fontSize: 14, fontWeight: "500" },
  deleteBtn: {
    backgroundColor: Colors.criticoBg,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: "center",
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.critico,
  },
  deleteBtnText: { color: Colors.critico, fontSize: 15, fontWeight: "600" },
});

const sectionStyles = StyleSheet.create({
  container: {},
  title: { ...Typography.h3, color: Colors.navy, marginBottom: Spacing.xs },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadow.card,
  },
});

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  label: { ...Typography.small, flex: 1, color: Colors.textMuted },
  value: { ...Typography.body, flex: 2, textAlign: "right" },
});
