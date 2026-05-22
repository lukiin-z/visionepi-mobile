// ============================================================
//  VisionEPI — Tela Detalhe do Registro
//  Exibe todas as informações de uma detecção de EPI.
// ============================================================

import React, { useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList } from "../types";
import { DeteccoesContext } from "../navigation/DeteccoesContext";
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
  const { registros, removerRegistro } = useContext(DeteccoesContext);
  const { id } = route.params;

  const registro = registros.find((r) => r.id === id);

  if (!registro) {
    return (
      <EmptyState
        emoji="❓"
        title="Registro não encontrado"
        subtitle="Este registro pode ter sido removido."
      />
    );
  }

  function confirmarRemocao() {
    Alert.alert(
      "Remover Registro",
      `Deseja remover a detecção do operador ${registro!.nome}? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => {
            removerRegistro(id);
            navigation.goBack();
          },
        },
      ]
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xl }}
    >
      {/* Header colorido por status */}
      <View
        style={[
          styles.headerBlock,
          { paddingTop: insets.top + Spacing.sm },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerOperador}>{registro.nome}</Text>
        <Text style={styles.headerId}>ID #{registro.id}</Text>
        <StatusBadge status={registro.status} size="lg" />
      </View>

      <View style={styles.content}>
        {/* Localização */}
        <Section title="📍 Localização">
          <InfoRow label="Zona de risco" value={registro.zona} />
          <InfoRow label="Câmera"        value={registro.camera} />
        </Section>

        {/* Detecção */}
        <Section title="🤖 Resultado da Detecção">
          <InfoRow
            label="Confiança do modelo"
            value={`${Math.round(registro.confianca * 100)}%`}
            highlight={registro.confianca >= 0.85}
          />
          <InfoRow
            label="Data e hora"
            value={formatarDataCompleta(registro.data)}
          />
          <InfoRow label="Descrição" value={registro.descricao} />
        </Section>

        {/* EPIs */}
        <Section title="⛑️ EPIs Verificados">
          {registro.episPresentes.length > 0 && (
            <View style={styles.episGroup}>
              <Text style={styles.episGroupLabel}>✅ Presentes</Text>
              <View style={styles.episChipsRow}>
                {registro.episPresentes.map((epi) => (
                  <View key={epi} style={[styles.epiChip, styles.epiChipOk]}>
                    <Text style={styles.epiChipOkText}>
                      {EPIIcons[epi]}  {EPILabels[epi]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          {registro.episAusentes.length > 0 && (
            <View style={styles.episGroup}>
              <Text style={styles.episGroupLabel}>❌ Ausentes</Text>
              <View style={styles.episChipsRow}>
                {registro.episAusentes.map((epi) => (
                  <View key={epi} style={[styles.epiChip, styles.epiChipBad]}>
                    <Text style={styles.epiChipBadText}>
                      {EPIIcons[epi]}  {EPILabels[epi]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          {registro.episAusentes.length === 0 && (
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
      <Text
        style={[infoStyles.value, highlight && { color: Colors.normal, fontWeight: "700" }]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll:   { flex: 1, backgroundColor: Colors.background },
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
  content:  { padding: Spacing.md, gap: Spacing.md },
  episGroup: { marginBottom: Spacing.sm },
  episGroupLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  episChipsRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.xs },
  epiChip: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  epiChipOk:    { backgroundColor: Colors.normalBg },
  epiChipBad:   { backgroundColor: Colors.criticoBg },
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
  title: {
    ...Typography.h3,
    color: Colors.navy,
    marginBottom: Spacing.xs,
  },
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
