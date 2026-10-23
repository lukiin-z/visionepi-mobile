// ============================================================
//  VisionEPI — Alerta multiplataforma
//  No Android/iOS é o Alert nativo, sem mudança de comportamento.
//  No navegador (Expo Web) o Alert.alert do react-native-web não faz
//  nada: o aviso sumiria e os botões nunca disparariam. Lá usamos
//  window.alert / window.confirm.
// ============================================================

import { Alert, AlertButton, Platform } from "react-native";

export function alerta(titulo: string, mensagem?: string, botoes?: AlertButton[]) {
  if (Platform.OS !== "web") {
    Alert.alert(titulo, mensagem, botoes);
    return;
  }

  const texto = mensagem ? titulo + "\n\n" + mensagem : titulo;
  if (!botoes || botoes.length < 2) {
    window.alert(texto);
    botoes?.[0]?.onPress?.();
    return;
  }

  // Dois botões: OK = primeiro botão que não é "cancel"; Cancelar = o outro.
  const principal = botoes.find((b) => b.style !== "cancel") ?? botoes[0];
  const outro = botoes.find((b) => b !== principal);
  const rodape = "\n\nOK: " + principal.text + (outro ? "  ·  Cancelar: " + outro.text : "");
  if (window.confirm(texto + rodape)) {
    principal.onPress?.();
  } else {
    outro?.onPress?.();
  }
}
