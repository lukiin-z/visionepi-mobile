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

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});
