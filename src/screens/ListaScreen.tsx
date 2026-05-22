// ============================================================
//  VisionEPI — Tela Lista de Registros
//  Exibe todos os registros de detecção com filtro por status.
// ============================================================

import React, { useContext, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList, StatusEPI } from "../types";
import { DeteccoesContext } from "../navigation/DeteccoesContext";
import { RegistroCard } from "../components/RegistroCard";
import { EmptyState } from "../components/EmptyState";
import { Colors, Spacing, Typography, Radius } from "../components/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Lista">;

type Filtro = "todos" | StatusEPI;

const FILTROS: { key: Filtro; label: string; emoji: string }[] = [
  { key: "todos",   label: "Todos",    emoji: "📋" },
  { key: "critico", label: "Crítico",  emoji: "🚨" },
  { key: "alerta",  label: "Atenção",  emoji: "⚠️" },
  { key: "normal",  label: "Conforme", emoji: "✅" },
];

export function ListaScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { registros } = useContext(DeteccoesContext);
  const [filtroAtivo, setFiltroAtivo] = useState<Filtro>("todos");
  const [busca, setBusca] = useState("");

  const registrosFiltrados = registros
    .filter((r) => filtroAtivo === "todos" || r.status === filtroAtivo)
    .filter(
      (r) =>
        r.nome.toLowerCase().includes(busca.toLowerCase()) ||
        r.zona.toLowerCase().includes(busca.toLowerCase()) ||
        r.camera.toLowerCase().includes(busca.toLowerCase())
    );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 Registros</Text>
        <Text style={styles.headerSub}>
          {registros.length} detecção{registros.length !== 1 ? "ões" : ""} registradas
        </Text>
      </View>

      {/* Busca */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍  Buscar por operador, zona ou câmera..."
          placeholderTextColor={Colors.placeholder}
          value={busca}
          onChangeText={setBusca}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Filtros */}
      <View style={styles.filtrosRow}>
        {FILTROS.map((f) => {
          const count =
            f.key === "todos"
              ? registros.length
              : registros.filter((r) => r.status === f.key).length;
          const isActive = filtroAtivo === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.filtroBtn, isActive && styles.filtroBtnActive]}
              onPress={() => setFiltroAtivo(f.key)}
            >
              <Text
                style={[
                  styles.filtroBtnText,
                  isActive && styles.filtroBtnTextActive,
                ]}
              >
                {f.emoji} {f.label} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Lista */}
      <FlatList
        data={registrosFiltrados}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <RegistroCard
            registro={item}
            onPress={(id) => navigation.navigate("Detalhe", { id })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            emoji="🔎"
            title="Nenhum registro encontrado"
            subtitle={
              busca
                ? `Nenhum resultado para "${busca}".`
                : "Toque em + para cadastrar a primeira detecção."
            }
          />
        }
        contentContainerStyle={{
          paddingTop: Spacing.sm,
          paddingBottom: insets.bottom + Spacing.xxl,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + Spacing.lg }]}
        onPress={() => navigation.navigate("Cadastro")}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.navy,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  headerTitle: { ...Typography.h2, color: Colors.white },
  headerSub:   { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 },
  searchContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.navy,
  },
  searchInput: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  filtrosRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filtroBtn: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  filtroBtnActive: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  filtroBtnText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  filtroBtnTextActive: {
    color: Colors.white,
    fontWeight: "700",
  },
  fab: {
    position: "absolute",
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.blue,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: { color: Colors.white, fontSize: 28, lineHeight: 32, fontWeight: "300" },
});
