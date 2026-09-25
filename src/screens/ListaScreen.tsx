// ============================================================
//  VisionEPI — Tela Lista de Registros
//  GET /deteccoes via camada de serviços (useEffect / useFocusEffect).
//  Estados tratados: carregando, erro (backend fora) e sucesso.
// ============================================================

import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList, StatusEPI, DeteccaoEpi, statusDoRisco } from "../types";
import { listar } from "../services/deteccaoService";
import { BASE_URL } from "../services/api";
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
  const [registros, setRegistros] = useState<DeteccaoEpi[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtroAtivo, setFiltroAtivo] = useState<Filtro>("todos");
  const [busca, setBusca] = useState("");

  const carregar = useCallback(async () => {
    try {
      setErro(null);
      const dados = await listar();
      setRegistros(dados);
    } catch (e) {
      setErro(
        "Não foi possível conectar ao backend em " + BASE_URL +
        ". Verifique se a API Spring Boot está rodando."
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  // Recarrega sempre que a tela ganha foco (ex.: voltando do cadastro).
  useFocusEffect(
    useCallback(() => {
      setCarregando(true);
      carregar();
    }, [carregar])
  );

  const registrosFiltrados = registros
    .filter((r) => filtroAtivo === "todos" || statusDoRisco(r.nivelRisco) === filtroAtivo)
    .filter((r) => {
      const termo = busca.toLowerCase();
      return (
        r.nomeOperador.toLowerCase().includes(termo) ||
        r.matricula.toLowerCase().includes(termo) ||
        r.setor.toLowerCase().includes(termo) ||
        r.descricaoCamera.toLowerCase().includes(termo)
      );
    });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 Registros</Text>
        <Text style={styles.headerSub}>
          {carregando
            ? "Carregando da API..."
            : erro
            ? "Sem conexão com a API"
            : registros.length + " detecções vindas da API"}
        </Text>
      </View>

      {/* Busca */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍  Buscar por operador, matrícula, setor ou câmera..."
          placeholderTextColor={Colors.placeholder}
          value={busca}
          onChangeText={setBusca}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Filtros (ocultos no erro: as contagens seriam de uma carga anterior) */}
      {!erro && (
        <View style={styles.filtrosRow}>
          {FILTROS.map((f) => {
            const count =
              f.key === "todos"
                ? registros.length
                : registros.filter((r) => statusDoRisco(r.nivelRisco) === f.key).length;
            const isActive = filtroAtivo === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[styles.filtroBtn, isActive && styles.filtroBtnActive]}
                onPress={() => setFiltroAtivo(f.key)}
              >
                <Text style={[styles.filtroBtnText, isActive && styles.filtroBtnTextActive]}>
                  {f.emoji} {f.label} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Estado: carregando */}
      {carregando && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.blue} />
          <Text style={styles.loadingText}>Buscando detecções na API...</Text>
        </View>
      )}

      {/* Estado: erro (backend fora do ar) */}
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
        <FlatList
          data={registrosFiltrados}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <RegistroCard
              registro={item}
              onPress={(id) => navigation.navigate("Detalhe", { id })}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={carregar} tintColor={Colors.blue} />
          }
          ListEmptyComponent={
            <EmptyState
              emoji="🔎"
              title="Nenhum registro encontrado"
              subtitle={
                busca
                  ? "Nenhum resultado para a busca informada."
                  : "Toque em + para cadastrar a primeira detecção na API."
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
      )}

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
  filtroBtnActive: { backgroundColor: Colors.navy, borderColor: Colors.navy },
  filtroBtnText: { fontSize: 12, fontWeight: "500", color: Colors.textSecondary },
  filtroBtnTextActive: { color: Colors.white, fontWeight: "700" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: Spacing.md },
  loadingText: { ...Typography.small, marginTop: Spacing.sm },
  retryBtn: {
    backgroundColor: Colors.blue,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
  },
  retryText: { color: Colors.white, fontWeight: "700" },
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
