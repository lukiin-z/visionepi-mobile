// ============================================================
//  VisionEPI — Design System / Tokens de Estilo
// ============================================================

import { StatusEPI } from "../types";

export const Colors = {
  // Marca VisionEPI
  navy:      "#1F3864",
  blue:      "#2E74B5",
  steel:     "#4472C4",

  // Status
  normal:    "#1A5C1A",
  normalBg:  "#E2EFDA",
  alerta:    "#B8460B",
  alertaBg:  "#FCE4D6",
  critico:   "#8B0000",
  criticoBg: "#FFDDD9",

  // Neutros
  white:     "#FFFFFF",
  background:"#F4F7FB",
  surface:   "#FFFFFF",
  border:    "#D0DAE8",
  textPrimary:   "#1A1A2E",
  textSecondary: "#555555",
  textMuted:     "#888888",
  placeholder:   "#AAAAAA",

  // Danger / success
  danger:  "#C00000",
  success: "#1A7A1A",
} as const;

export const StatusConfig: Record<
  StatusEPI,
  { label: string; color: string; bg: string; emoji: string }
> = {
  normal: {
    label: "Conforme",
    color: Colors.normal,
    bg:    Colors.normalBg,
    emoji: "✅",
  },
  alerta: {
    label: "Atenção",
    color: Colors.alerta,
    bg:    Colors.alertaBg,
    emoji: "⚠️",
  },
  critico: {
    label: "Crítico",
    color: Colors.critico,
    bg:    Colors.criticoBg,
    emoji: "🚨",
  },
};

export const EPILabels: Record<string, string> = {
  capacete: "Capacete",
  colete:   "Colete",
  luva:     "Luvas",
  oculos:   "Óculos",
  botina:   "Botina",
};

export const EPIIcons: Record<string, string> = {
  capacete: "⛑️",
  colete:   "🦺",
  luva:     "🧤",
  oculos:   "🥽",
  botina:   "🥾",
};

export const Typography = {
  h1:    { fontSize: 24, fontWeight: "700" as const, color: Colors.navy },
  h2:    { fontSize: 20, fontWeight: "700" as const, color: Colors.navy },
  h3:    { fontSize: 16, fontWeight: "600" as const, color: Colors.textPrimary },
  body:  { fontSize: 14, fontWeight: "400" as const, color: Colors.textPrimary },
  small: { fontSize: 12, fontWeight: "400" as const, color: Colors.textSecondary },
  micro: { fontSize: 11, fontWeight: "400" as const, color: Colors.textMuted },
};

export const Spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const Radius = {
  sm:  6,
  md:  12,
  lg:  18,
  full: 999,
};

export const Shadow = {
  card: {
    shadowColor: "#1F3864",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
};
