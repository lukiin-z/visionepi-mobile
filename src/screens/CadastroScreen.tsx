// ============================================================
//  VisionEPI — Tela Cadastro de Registro
//  Formulário para criar uma nova detecção de EPI.
//  Futura integração: POST /api/deteccoes
// ============================================================

import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList, StatusEPI, TipoEPI } from "../types";
import { DeteccoesContext } from "../navigation/DeteccoesContext";
import {
  Colors, Spacing, Typography, Radius, Shadow,
  EPILabels, EPIIcons, StatusConfig,
} from "../components/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Cadastro">;

const ZONAS = ["Soldagem A", "Soldagem B", "Caldeiraria", "Montagem", "Manutenção", "Entrada Principal", "Almoxarifado"];
const CAMERAS = ["CAM-01", "CAM-02", "CAM-03", "CAM-04", "CAM-05", "CAM-06", "CAM-07"];
const EPIS: TipoEPI[] = ["capacete", "colete", "luva"];
const STATUS_OPTS: StatusEPI[] = ["normal", "alerta", "critico"];

export function CadastroScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { adicionarRegistro } = useContext(DeteccoesContext);

  const [nome,        setNome]        = useState("");
  const [descricao,   setDescricao]   = useState("");
  const [zona,        setZona]        = useState(ZONAS[0]);
  const [camera,      setCamera]      = useState(CAMERAS[0]);
  const [status,      setStatus]      = useState<StatusEPI>("normal");
  const [episPresentes, setEpisPresentes] = useState<TipoEPI[]>(["capacete", "colete", "luva"]);
  const [confianca,   setConfianca]   = useState("0.90");
  const [salvando,    setSalvando]    = useState(false);

  const episAusentes = EPIS.filter((e) => !episPresentes.includes(e));

  function toggleEPI(epi: TipoEPI) {
    setEpisPresentes((prev) =>
      prev.includes(epi) ? prev.filter((e) => e !== epi) : [...prev, epi]
    );
  }

  function calcularStatusSugerido(): StatusEPI {
    if (episAusentes.includes("capacete") && episAusentes.length > 1) return "critico";
    if (episAusentes.length > 0) return "alerta";
    return "normal";
  }

  function aplicarStatusSugerido() {
    setStatus(calcularStatusSugerido());
  }

  async function salvar() {
    if (!nome.trim()) {
      Alert.alert("Campo obrigatório", "Informe o código do operador.");
      return;
    }
    if (!descricao.trim()) {
      Alert.alert("Campo obrigatório", "Informe uma descrição da detecção.");
      return;
    }
    const conf = parseFloat(confianca);
    if (isNaN(conf) || conf < 0 || conf > 1) {
      Alert.alert("Valor inválido", "A confiança deve ser um número entre 0 e 1.");
      return;
    }

    setSalvando(true);
    // Simula latência de API (substituir por fetch() na integração)
    await new Promise((res) => setTimeout(res, 600));

    adicionarRegistro({
      nome: nome.trim().toUpperCase(),
      descricao: descricao.trim(),
      status,
      camera,
      zona,
      episPresentes,
      episAusentes,
      confianca: conf,
    });

    setSalvando(false);
    Alert.alert("✅ Sucesso", "Detecção registrada com sucesso!", [
      { text: "Ver Lista", onPress: () => navigation.navigate("Lista") },
      { text: "Novo Registro", onPress: () => resetForm() },
    ]);
  }

  function resetForm() {
    setNome(""); setDescricao(""); setZona(ZONAS[0]); setCamera(CAMERAS[0]);
    setStatus("normal"); setEpisPresentes(["capacete", "colete", "luva"]);
    setConfianca("0.90");
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xxl }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>➕ Nova Detecção</Text>
          <Text style={styles.headerSub}>Registrar manualmente uma detecção de EPI</Text>
        </View>

        <View style={styles.form}>
          {/* Operador */}
          <Field label="Código do Operador *">
            <TextInput
              style={styles.input}
              placeholder="ex: OP-117"
              placeholderTextColor={Colors.placeholder}
              value={nome}
              onChangeText={setNome}
              autoCapitalize="characters"
            />
          </Field>

          {/* Zona */}
          <Field label="Zona de Risco *">
            <SelectorRow
              options={ZONAS}
              selected={zona}
              onSelect={setZona}
            />
          </Field>

          {/* Câmera */}
          <Field label="Câmera *">
            <SelectorRow
              options={CAMERAS}
              selected={camera}
              onSelect={setCamera}
            />
          </Field>

          {/* EPIs presentes */}
          <Field label="EPIs Detectados (marque os PRESENTES)">
            <View style={styles.epiRow}>
              {EPIS.map((epi) => {
                const isPresente = episPresentes.includes(epi);
                return (
                  <TouchableOpacity
                    key={epi}
                    style={[
                      styles.epiToggle,
                      isPresente ? styles.epiToggleOn : styles.epiToggleOff,
                    ]}
                    onPress={() => toggleEPI(epi)}
                  >
                    <Text style={[
                      styles.epiToggleText,
                      isPresente ? styles.epiToggleTextOn : styles.epiToggleTextOff,
                    ]}>
                      {EPIIcons[epi]}  {EPILabels[epi]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity
              style={styles.suggestBtn}
              onPress={aplicarStatusSugerido}
            >
              <Text style={styles.suggestText}>
                💡 Status sugerido: {StatusConfig[calcularStatusSugerido()].label}
              </Text>
            </TouchableOpacity>
          </Field>

          {/* Status */}
          <Field label="Status de Risco *">
            <View style={styles.statusRow}>
              {STATUS_OPTS.map((s) => {
                const cfg = StatusConfig[s];
                const isActive = status === s;
                return (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.statusBtn,
                      isActive && { backgroundColor: cfg.bg, borderColor: cfg.color },
                    ]}
                    onPress={() => setStatus(s)}
                  >
                    <Text style={[
                      styles.statusBtnText,
                      isActive && { color: cfg.color, fontWeight: "700" },
                    ]}>
                      {cfg.emoji} {cfg.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Field>

          {/* Confiança */}
          <Field label="Confiança do Modelo (0.00 a 1.00)">
            <TextInput
              style={styles.input}
              placeholder="ex: 0.92"
              placeholderTextColor={Colors.placeholder}
              value={confianca}
              onChangeText={setConfianca}
              keyboardType="decimal-pad"
            />
          </Field>

          {/* Descrição */}
          <Field label="Descrição da Detecção *">
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Descreva o que foi detectado..."
              placeholderTextColor={Colors.placeholder}
              value={descricao}
              onChangeText={setDescricao}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </Field>

          {/* Botão salvar */}
          <TouchableOpacity
            style={[styles.saveBtn, salvando && styles.saveBtnDisabled]}
            onPress={salvar}
            disabled={salvando}
            activeOpacity={0.85}
          >
            <Text style={styles.saveBtnText}>
              {salvando ? "Salvando..." : "💾  Salvar Registro"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={fieldStyles.container}>
      <Text style={fieldStyles.label}>{label}</Text>
      {children}
    </View>
  );
}

function SelectorRow({
  options, selected, onSelect,
}: { options: string[]; selected: string; onSelect: (v: string) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={selStyles.row}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[selStyles.btn, selected === opt && selStyles.btnActive]}
            onPress={() => onSelect(opt)}
          >
            <Text style={[selStyles.text, selected === opt && selStyles.textActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.navy,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  backBtn:     { alignSelf: "flex-start" },
  backText:    { color: "rgba(255,255,255,0.8)", fontSize: 14 },
  headerTitle: { ...Typography.h2, color: Colors.white },
  headerSub:   { color: "rgba(255,255,255,0.7)", fontSize: 12 },
  form: { padding: Spacing.md, gap: Spacing.md },
  input: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  textarea: { minHeight: 80, paddingTop: Spacing.sm },
  epiRow:   { flexDirection: "row", gap: Spacing.sm, flexWrap: "wrap" },
  epiToggle: {
    flex: 1,
    minWidth: 90,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 2,
    alignItems: "center",
  },
  epiToggleOn:  { backgroundColor: Colors.normalBg, borderColor: Colors.normal },
  epiToggleOff: { backgroundColor: Colors.criticoBg, borderColor: Colors.critico },
  epiToggleText:    { fontSize: 13, fontWeight: "600" },
  epiToggleTextOn:  { color: Colors.normal },
  epiToggleTextOff: { color: Colors.critico },
  suggestBtn: {
    marginTop: Spacing.xs,
    alignSelf: "flex-start",
    backgroundColor: "#EEF3FA",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
  },
  suggestText: { fontSize: 12, color: Colors.blue, fontWeight: "500" },
  statusRow: { flexDirection: "row", gap: Spacing.sm },
  statusBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: "center",
  },
  statusBtnText: { fontSize: 12, fontWeight: "500", color: Colors.textSecondary },
  saveBtn: {
    backgroundColor: Colors.blue,
    borderRadius: Radius.md,
    padding: Spacing.md + 2,
    alignItems: "center",
    marginTop: Spacing.sm,
    ...Shadow.card,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: Colors.white, fontSize: 16, fontWeight: "700" },
});

const fieldStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadow.card,
  },
  label: { fontSize: 13, fontWeight: "600", color: Colors.navy },
});

const selStyles = StyleSheet.create({
  row: { flexDirection: "row", gap: Spacing.xs },
  btn: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  btnActive:    { backgroundColor: Colors.navy, borderColor: Colors.navy },
  text:         { fontSize: 13, color: Colors.textSecondary },
  textActive:   { color: Colors.white, fontWeight: "700" },
});
