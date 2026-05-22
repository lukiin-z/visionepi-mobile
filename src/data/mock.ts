// ============================================================
//  VisionEPI — Dados Mockados
//  Simulam o retorno futuro da API REST do backend Oracle.
//
//  Futura integração:
//    GET /api/deteccoes       → substituir deteccoesMock
//    GET /api/alertas         → substituir alertasMock
//    GET /api/zonas           → substituir zonasMock
// ============================================================

import { DeteccaoEPI, Alerta, ZonaRisco } from "../types";

export const deteccoesMock: DeteccaoEPI[] = [
  {
    id: 1001,
    nome: "OP-117",
    descricao: "Operador detectado sem capacete na entrada da área de soldagem.",
    status: "critico",
    data: "2026-05-21T14:32:00.000Z",
    camera: "CAM-03",
    zona: "Soldagem A",
    episPresentes: ["colete"],
    episAusentes: ["capacete", "luva"],
    confianca: 0.94,
  },
  {
    id: 1002,
    nome: "OP-203",
    descricao: "Operador detectado sem colete de segurança na manutenção.",
    status: "alerta",
    data: "2026-05-21T14:18:00.000Z",
    camera: "CAM-07",
    zona: "Manutenção",
    episPresentes: ["capacete"],
    episAusentes: ["colete"],
    confianca: 0.88,
  },
  {
    id: 1003,
    nome: "OP-089",
    descricao: "Todos os EPIs identificados corretamente.",
    status: "normal",
    data: "2026-05-21T13:55:00.000Z",
    camera: "CAM-02",
    zona: "Montagem",
    episPresentes: ["capacete", "colete", "luva"],
    episAusentes: [],
    confianca: 0.97,
  },
  {
    id: 1004,
    nome: "OP-156",
    descricao: "Operador sem luvas de proteção no setor de caldeiraria.",
    status: "alerta",
    data: "2026-05-21T13:40:00.000Z",
    camera: "CAM-05",
    zona: "Caldeiraria",
    episPresentes: ["capacete", "colete"],
    episAusentes: ["luva"],
    confianca: 0.81,
  },
  {
    id: 1005,
    nome: "OP-044",
    descricao: "Todos os EPIs identificados corretamente.",
    status: "normal",
    data: "2026-05-21T13:22:00.000Z",
    camera: "CAM-01",
    zona: "Entrada Principal",
    episPresentes: ["capacete", "colete", "luva"],
    episAusentes: [],
    confianca: 0.99,
  },
  {
    id: 1006,
    nome: "OP-302",
    descricao: "Operador sem capacete e sem luvas — múltiplas violações.",
    status: "critico",
    data: "2026-05-21T12:58:00.000Z",
    camera: "CAM-04",
    zona: "Soldagem B",
    episPresentes: ["colete"],
    episAusentes: ["capacete", "luva"],
    confianca: 0.91,
  },
  {
    id: 1007,
    nome: "OP-175",
    descricao: "Todos os EPIs identificados corretamente.",
    status: "normal",
    data: "2026-05-21T12:30:00.000Z",
    camera: "CAM-06",
    zona: "Almoxarifado",
    episPresentes: ["capacete", "colete", "luva"],
    episAusentes: [],
    confianca: 0.95,
  },
];

export const alertasMock: Alerta[] = [
  {
    id: 2001,
    idDeteccao: 1001,
    tipoAlerta: "VIOLACAO_EPI",
    mensagem: "OP-117 detectado sem capacete e luva na Soldagem A — CAM-03.",
    dataAlerta: "2026-05-21T14:32:05.000Z",
    status: "PENDENTE",
  },
  {
    id: 2002,
    idDeteccao: 1002,
    tipoAlerta: "VIOLACAO_EPI",
    mensagem: "OP-203 detectado sem colete na Manutenção — CAM-07.",
    dataAlerta: "2026-05-21T14:18:03.000Z",
    status: "PENDENTE",
  },
  {
    id: 2003,
    idDeteccao: 1004,
    tipoAlerta: "VIOLACAO_EPI",
    mensagem: "OP-156 detectado sem luvas na Caldeiraria — CAM-05.",
    dataAlerta: "2026-05-21T13:40:08.000Z",
    status: "RESOLVIDO",
  },
  {
    id: 2004,
    idDeteccao: 1006,
    tipoAlerta: "VIOLACAO_EPI",
    mensagem: "OP-302 detectado sem capacete e luva na Soldagem B — CAM-04.",
    dataAlerta: "2026-05-21T12:58:02.000Z",
    status: "PENDENTE",
  },
];

export const zonasMock: ZonaRisco[] = [
  {
    id: 1,
    nome: "Soldagem A",
    tipoRisco: "Calor e faíscas",
    nivelRisco: "critico",
    percentualConformidade: 72.3,
  },
  {
    id: 2,
    nome: "Caldeiraria",
    tipoRisco: "Pressão e temperatura",
    nivelRisco: "alerta",
    percentualConformidade: 85.1,
  },
  {
    id: 3,
    nome: "Montagem",
    tipoRisco: "Ferramentas e prensas",
    nivelRisco: "normal",
    percentualConformidade: 96.4,
  },
  {
    id: 4,
    nome: "Manutenção",
    tipoRisco: "Maquinário pesado",
    nivelRisco: "alerta",
    percentualConformidade: 81.7,
  },
];
