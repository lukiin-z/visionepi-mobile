// ============================================================
//  VisionEPI — Cliente HTTP (Axios)
//  Única instância usada por toda a camada de serviços.
// ============================================================

import axios from "axios";

// BASE_URL por plataforma:
//   Celular físico (Expo Go) .. http://<IP-DA-MAQUINA>:8080   ← em uso
//   Web / iOS simulador ....... http://localhost:8080
//   Emulador Android .......... http://10.0.2.2:8080
//
// O IP da máquina funciona em todos os casos desde que o celular e o
// computador estejam na mesma rede Wi-Fi. Se o IP mudar, troque aqui:
export const BASE_URL = "http://192.168.0.201:8080";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});
