// ============================================================
//  VisionEPI — Navegação Principal (React Navigation)
//  Stack Navigator com todas as telas do app.
// ============================================================

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { HomeScreen }     from "../screens/HomeScreen";
import { ListaScreen }    from "../screens/ListaScreen";
import { DetalheScreen }  from "../screens/DetalheScreen";
import { CadastroScreen } from "../screens/CadastroScreen";
import { AlertasScreen }  from "../screens/AlertasScreen";
import { Colors } from "../components/theme";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false, // Headers customizados em cada tela
          contentStyle: { backgroundColor: Colors.background },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="Home"     component={HomeScreen} />
        <Stack.Screen name="Lista"    component={ListaScreen} />
        <Stack.Screen name="Detalhe"  component={DetalheScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="Alertas"  component={AlertasScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
