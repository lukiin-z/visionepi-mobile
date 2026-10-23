// ============================================================
//  VisionEPI — Tela Cadastro de Registro
//  POST /deteccoes via camada de serviços.
//  Estados tratados: salvando, erro e sucesso.
// ============================================================

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList, TipoEPI, EPIS, NovaDeteccao } from "../types";
import { criar } from "../services/deteccaoService";
import { BASE_URL, errosDeValidacao } from "../services/api";
import { alerta } from "../utils/alerta";
import {
  Colors, Spacing, Typography, Radius, Shadow,
  EPILabels, EPIIcons,
} from "../components/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Cadastro">;

const SETORES = [
  "Soldagem A", "Soldagem B", "Caldeiraria",
  "Montagem", "Manutenção", "Entrada Principal", "Almoxarifado",
];
const CAMERAS = [
  "CAM-01 - Entrada", "CAM-02 - Montagem", "CAM-03 - Soldagem",
  "CAM-04 - Caldeiraria", "CAM-05 - Manutenção",
];

export function CadastroScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const [nomeOperador, setNomeOperador] = useState("");
  const [matricula,    setMatricula]    = useState("");
  const [setor,        setSetor]        = useState(SETORES[0]);
  const [camera,       setCamera]       = useState(CAMERAS[0]);
  const [presentes,    setPresentes]    = useState<TipoEPI[]>([...EPIS]);
  const [confianca,    setConfianca]    = useState("90");
  const [salvando,     setSalvando]     = useState(false);

  function toggleEPI(epi: TipoEPI) {
    setPresentes((prev) =>
      prev.includes(epi) ? prev.filter((e) => e !== epi) : [...prev, epi]
    );
  }

  async function salvar() {
    if (!nomeOperador.trim()) {
      alerta("Campo obrigatório", "Informe o nome do operador.");
      return;
    }
    if (!matricula.trim()) {
      alerta("Campo obrigatório", "Informe a matrícula do operador.");
      return;
    }
    const conf = parseFloat(confianca.replace(",", "."));
    if (isNaN(conf) || conf < 0 || conf > 100) {
      alerta("Valor inválido", "A confiança deve ser um número entre 0 e 100.");
      return;
    }

    // Monta o payload exatamente no formato esperado pelo backend.
    const payload: NovaDeteccao = {
      nomeOperador: nomeOperador.trim(),
      matricula: matricula.trim().toUpperCase(),
      setor,
      descricaoCamera: camera,
      capacete: presentes.includes("capacete") ? "S" : "N",
      colete:   presentes.includes("colete")   ? "S" : "N",
      luva:     presentes.includes("luva")     ? "S" : "N",
      oculos:   presentes.includes("oculos")   ? "S" : "N",
      botina:   presentes.includes("botina")   ? "S" : "N",
      confianca: conf,
    };

    try {
      setSalvando(true);
      const criado = await criar(payload);
      alerta(
        "✅ Sucesso",
        "Detecção #" + criado.id + " registrada na API (nível de risco " +
        criado.nivelRisco + "/5).",
        [
          { text: "Ver Lista", onPress: () => navigation.navigate("Lista") },
          { text: "Novo Registro", onPress: resetForm },
        ]
      );
    } catch (e) {
      const recusa = errosDeValidacao(e);
      if (recusa) {
        alerta("Registro recusado pela API", recusa);
        return;
      }
      alerta(
        "Erro ao salvar",
        "Não foi possível enviar o registro para " + BASE_URL +
        ". Verifique se a API Spring Boot está rodando."
      );
    } finally {
      setSalvando(false);
    }
  }

  function resetForm() {
    setNomeOperador("");
    setMatricula("");
    setSetor(SETORES[0]);
    setCamera(CAMERAS[0]);
    setPresentes([...EPIS]);
    setConfianca("90");
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
          <Text style={styles.headerSub}>POST /deteccoes — enviado para a API</Text>
        </View>

        <View style={styles.form}>
          <Field label="Nome do Operador *">
            <TextInput
              style={styles.input}
              placeholder="ex: Carlos Silva"
              placeholderTextColor={Colors.placeholder}
              value={nomeOperador}
              onChangeText={setNomeOperador}
              maxLength={100}
            />
          </Field>

          <Field label="Matrícula *">
            <TextInput
              style={styles.input}
              placeholder="ex: OP-117"
              placeholderTextColor={Colors.placeholder}
              value={matricula}
              onChangeText={setMatricula}
              maxLength={20}
              autoCapitalize="characters"
            />
          </Field>

          <Field label="Setor *">
            <SelectorRow options={SETORES} selected={setor} onSelect={setSetor} />
          </Field>

          <Field label="Câmera *">
            <SelectorRow options={CAMERAS} selected={camera} onSelect={setCamera} />
          </Field>

          <Field label="EPIs Detectados (marque os PRESENTES)">
            <View style={styles.epiRow}>
              {EPIS.map((epi) => {
                const isPresente = presentes.includes(epi);
                return (
                  <TouchableOpacity
                    key={epi}
                    style={[
                      styles.epiToggle,
                      isPresente ? styles.epiToggleOn : styles.epiToggleOff,
                    ]}
                    onPress={() => toggleEPI(epi)}
                  >
                    <Text
                      style={[
                        styles.epiToggleText,
                        isPresente ? styles.epiToggleTextOn : styles.epiToggleTextOff,
                      ]}
                    >
                      {EPIIcons[epi]}  {EPILabels[epi]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={styles.hint}>
              💡 O nível de risco (1–5) é calculado pelo backend a partir dos EPIs ausentes.
            </Text>
          </Field>

          <Field label="Confiança do Modelo (0 a 100) *">
            <TextInput
              style={styles.input}
              placeholder="ex: 94.5"
              placeholderTextColor={Colors.placeholder}
              value={confianca}
              onChangeText={setConfianca}
              keyboardType="decimal-pad"
            />
          </Field>

          <TouchableOpacity
            style={[styles.saveBtn, salvando && styles.saveBtnDisabled]}
            onPress={salvar}
            disabled={salvando}
            activeOpacity={0.85}
          >
            <Text style={styles.saveBtnText}>
              {salvando ? "Enviando para a API..." : "💾  Salvar Registro"}
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
  epiRow: { flexDirection: "row", gap: Spacing.sm, flexWrap: "wrap" },
  epiToggle: {
    minWidth: 100,
    flexGrow: 1,
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
  hint: { fontSize: 12, color: Colors.textMuted, marginTop: Spacing.xs },
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
  btnActive:  { backgroundColor: Colors.navy, borderColor: Colors.navy },
  text:       { fontSize: 13, color: Colors.textSecondary },
  textActive: { color: Colors.white, fontWeight: "700" },
});
