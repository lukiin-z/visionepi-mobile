// ============================================================
//  VisionEPI — App Entry Point
//  Sistema Inteligente de Segurança Industrial
//  FIAP — Engenharia de Computação — 3ECR — 2026
// ============================================================

import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
