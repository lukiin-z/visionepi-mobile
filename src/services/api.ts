// ============================================================
//  VisionEPI — Cliente HTTP (Axios)
//  Única instância usada por toda a camada de serviços.
// ============================================================

import axios from "axios";
import { Platform } from "react-native";

// BASE_URL:
//   1) EXPO_PUBLIC_API_URL do arquivo .env, se definida (modelo em .env.example);
//   2) senão, padrão por plataforma:
//        Emulador Android .......... http://10.0.2.2:8080  (localhost do PC visto pelo emulador)
//        Web / iOS simulador ....... http://localhost:8080
//
// Celular físico (Expo Go) não alcança localhost/10.0.2.2: defina no .env
//   EXPO_PUBLIC_API_URL=http://<IP-DA-MAQUINA>:8080  (mesma rede Wi-Fi)
export const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080");

// Timeout de 8s: com o backend fora (ou IP errado) o erro aparece rápido na tela,
// em vez de um carregando sem fim.
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
});

/** Mensagens por campo quando a API recusa o corpo (HTTP 400); null para qualquer outro erro. */
export function errosDeValidacao(e: unknown): string | null {
  if (axios.isAxiosError(e) && e.response?.status === 400 && typeof e.response.data === "object") {
    return Object.values(e.response.data as Record<string, string>).join("\n");
  }
  return null;
}
