// ============================================================
//  VisionEPI — App Entry Point
//  Sistema Inteligente de Segurança Industrial
//  FIAP — Engenharia de Computação — 3ECR — 2026
// ============================================================

import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DeteccoesProvider } from "./src/navigation/DeteccoesContext";
import { AppNavigator } from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      {/* Provider de estado global de detecções */}
      <DeteccoesProvider>
        <AppNavigator />
        <StatusBar style="light" />
      </DeteccoesProvider>
    </SafeAreaProvider>
  );
}
