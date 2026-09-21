// ============================================================
//  VisionEPI — Cliente HTTP (Axios)
//  Única instância usada por toda a camada de serviços.
// ============================================================

import axios from "axios";
import { Platform } from "react-native";

// BASE_URL por plataforma:
//   Web / iOS simulador ....... http://localhost:8080
//   Emulador Android .......... http://10.0.2.2:8080
//   Celular físico (Expo Go) .. http://<IP-DA-MAQUINA>:8080
//     → neste caso troque a linha abaixo por, ex.:
//       export const BASE_URL = "http://192.168.0.12:8080";
export const BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});
