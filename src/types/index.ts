// ============================================================
//  VisionEPI — Tipos TypeScript
//  Modelagem baseada no domínio de segurança industrial
//  Espelha as entidades do backend Oracle (TB_DETECCAO, etc.)
// ============================================================

/**
 * Status de conformidade de EPI de um operador.
 * Mapeado diretamente ao campo ds_nivel_risco do backend.
 */
export type StatusEPI = "normal" | "alerta" | "critico";

/**
 * Tipo de EPI monitorado pelo sistema de visão computacional.
 */
export type TipoEPI = "capacete" | "colete" | "luva";

/**
 * Registro de detecção de EPI — entidade principal do app.
 * Equivale a TB_DETECCAO no banco Oracle.
 *
 * Futura integração: GET /api/deteccoes/:id
 */
export type DeteccaoEPI = {
  id: number;
  /** Nome ou código anônimo do operador (sem dados biométricos — LGPD) */
  nome: string;
  /** Zona ou setor da planta onde a detecção ocorreu */
  descricao: string;
  /** Nível de risco calculado com base nos EPIs ausentes */
  status: StatusEPI;
  /** Timestamp da detecção — ISO 8601 */
  data: string;
  /** Câmera que registrou a detecção */
  camera: string;
  /** Zona de risco associada */
  zona: string;
  /** EPIs que estavam presentes na detecção */
  episPresentes: TipoEPI[];
  /** EPIs que estavam ausentes (causadores do alerta) */
  episAusentes: TipoEPI[];
  /** Percentual de confiança do modelo (0–1) */
  confianca: number;
};

/**
 * Payload para criação de nova detecção (formulário de cadastro).
 * Futura integração: POST /api/deteccoes
 */
export type NovaDeteccaoPayload = Omit<DeteccaoEPI, "id" | "data"> & {
  data?: string; // se omitido, backend usa SYSDATE
};

/**
 * Alerta gerado automaticamente a partir de uma detecção.
 * Equivale a TB_ALERTA no banco Oracle.
 *
 * Futura integração: GET /api/alertas
 */
export type Alerta = {
  id: number;
  idDeteccao: number;
  tipoAlerta: "VIOLACAO_EPI" | "RISCO_POSTURAL" | "ZONA_PROIBIDA";
  mensagem: string;
  dataAlerta: string;
  status: "PENDENTE" | "RESOLVIDO" | "EXPIRADO";
};

/**
 * Zona de risco da planta industrial.
 * Equivale a TB_ZONA_RISCO no banco Oracle.
 */
export type ZonaRisco = {
  id: number;
  nome: string;
  tipoRisco: string;
  nivelRisco: StatusEPI;
  percentualConformidade: number;
};

/**
 * Parâmetros de navegação das telas (React Navigation).
 * Garante type-safety nos parâmetros de cada rota.
 */
export type RootStackParamList = {
  Home: undefined;
  Lista: undefined;
  Detalhe: { id: number };
  Cadastro: undefined;
  Alertas: undefined;
};
