// ============================================================
//  VisionEPI — Tipos TypeScript
//  Alinhados ao JSON retornado pela API Spring Boot (Sprint 1).
//  GET /deteccoes → [{ id, nomeOperador, matricula, setor,
//    descricaoCamera, dataDeteccao, capacete, colete, luva,
//    oculos, botina, confianca, nivelRisco }]
// ============================================================

/** Flag de EPI no backend: "S" = presente, "N" = ausente. */
export type FlagEPI = "S" | "N";

/** Tipos de EPI monitorados (mesmos campos fl_* da entidade JPA). */
export type TipoEPI = "capacete" | "colete" | "luva" | "oculos" | "botina";

/** Status de conformidade usado na UI — derivado do nivelRisco da API. */
export type StatusEPI = "normal" | "alerta" | "critico";

/**
 * Detecção de EPI — espelha a entidade DeteccaoEpi do backend.
 * Endpoint: /deteccoes
 */
export type DeteccaoEpi = {
  id: number;
  nomeOperador: string;
  matricula: string;
  setor: string;
  descricaoCamera: string;
  /** ISO 8601 gerado pelo backend (@PrePersist) */
  dataDeteccao: string;
  capacete: FlagEPI;
  colete: FlagEPI;
  luva: FlagEPI;
  oculos: FlagEPI;
  botina: FlagEPI;
  /** Percentual de confiança do modelo (0 a 100) */
  confianca: number;
  /** Nível de risco 1–5 calculado pelo backend */
  nivelRisco: number;
};

/**
 * Payload de criação — o backend preenche dataDeteccao e nivelRisco.
 * POST /deteccoes
 */
export type NovaDeteccao = Omit<DeteccaoEpi, "id" | "dataDeteccao" | "nivelRisco">;

export const EPIS: TipoEPI[] = ["capacete", "colete", "luva", "oculos", "botina"];

/** Converte o nivelRisco (1–5) da API no status usado pela UI. */
export function statusDoRisco(nivelRisco: number): StatusEPI {
  if (nivelRisco >= 4) return "critico";
  if (nivelRisco >= 2) return "alerta";
  return "normal";
}

/** EPIs com flag "N" na detecção. */
export function episAusentes(d: DeteccaoEpi): TipoEPI[] {
  return EPIS.filter((epi) => d[epi] === "N");
}

/** EPIs com flag "S" na detecção. */
export function episPresentes(d: DeteccaoEpi): TipoEPI[] {
  return EPIS.filter((epi) => d[epi] === "S");
}

/** Parâmetros de navegação das telas (React Navigation). */
export type RootStackParamList = {
  Home: undefined;
  Lista: undefined;
  Detalhe: { id: number };
  Cadastro: undefined;
};
