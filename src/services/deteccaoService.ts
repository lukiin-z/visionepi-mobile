// ============================================================
//  VisionEPI — Serviço de Detecções
//  A tela nunca chama Axios nem monta URL: tudo passa por aqui.
//  Backend: DeteccaoEpiController → /deteccoes
// ============================================================

import { api } from "./api";
import { DeteccaoEpi, NovaDeteccao } from "../types";

/** GET /deteccoes */
export async function listar(): Promise<DeteccaoEpi[]> {
  const { data } = await api.get<DeteccaoEpi[]>("/deteccoes");
  return data;
}

/** GET /deteccoes/{id} */
export async function buscarPorId(id: number): Promise<DeteccaoEpi> {
  const { data } = await api.get<DeteccaoEpi>(`/deteccoes/${id}`);
  return data;
}

/** POST /deteccoes */
export async function criar(payload: NovaDeteccao): Promise<DeteccaoEpi> {
  const { data } = await api.post<DeteccaoEpi>("/deteccoes", payload);
  return data;
}

/** GET /deteccoes?nivelRiscoMinimo=4 — usado no dashboard. */
export async function listarPorRiscoMinimo(nivel: number): Promise<DeteccaoEpi[]> {
  const { data } = await api.get<DeteccaoEpi[]>("/deteccoes", {
    params: { nivelRiscoMinimo: nivel },
  });
  return data;
}

/** DELETE /deteccoes/{id} (opcional na Sprint 3) */
export async function remover(id: number): Promise<void> {
  await api.delete(`/deteccoes/${id}`);
}
