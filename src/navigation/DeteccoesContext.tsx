// ============================================================
//  VisionEPI — Context de Detecções (Estado Global)
//  Gerencia o estado local dos registros de detecção de EPI.
//
//  Em integração futura:
//    - adicionarRegistro()  → POST /api/deteccoes
//    - removerRegistro()    → DELETE /api/deteccoes/:id
//    - O estado inicial virá de GET /api/deteccoes
// ============================================================

import React, { createContext, useState, ReactNode } from "react";
import { DeteccaoEPI, NovaDeteccaoPayload } from "../types";
import { deteccoesMock } from "../data/mock";

interface DeteccoesContextData {
  registros: DeteccaoEPI[];
  adicionarRegistro: (payload: NovaDeteccaoPayload) => void;
  removerRegistro:   (id: number) => void;
}

export const DeteccoesContext = createContext<DeteccoesContextData>({
  registros: [],
  adicionarRegistro: () => {},
  removerRegistro:   () => {},
});

interface Props {
  children: ReactNode;
}

export function DeteccoesProvider({ children }: Props) {
  // Inicializa com dados mockados.
  // Futura integração: substituir por fetch() + setRegistros(data)
  const [registros, setRegistros] = useState<DeteccaoEPI[]>(deteccoesMock);

  function adicionarRegistro(payload: NovaDeteccaoPayload) {
    const novoId = Math.max(0, ...registros.map((r) => r.id)) + 1;
    const novoRegistro: DeteccaoEPI = {
      ...payload,
      id: novoId,
      data: payload.data ?? new Date().toISOString(),
    };
    // Insere no início da lista (mais recente primeiro)
    setRegistros((prev) => [novoRegistro, ...prev]);
  }

  function removerRegistro(id: number) {
    setRegistros((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <DeteccoesContext.Provider
      value={{ registros, adicionarRegistro, removerRegistro }}
    >
      {children}
    </DeteccoesContext.Provider>
  );
}
