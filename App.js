import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, NavigationIndependentTree, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProvedorJogo } from './src/contexto/contextoJogo';
import Tela1 from './src/telas/tela1';
import Tela2 from './src/telas/tela2';
import Tela3 from './src/telas/tela3';
import Tela4 from './src/telas/tela4';

const Pilha = createNativeStackNavigator();
const tema = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, primary: '#49B9E8', background: '#071125', card: '#0D1D35' },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <ProvedorJogo>
        <NavigationIndependentTree>
          <NavigationContainer theme={tema}>
            <Pilha.Navigator screenOptions={{ headerShown: false, animation: 'fade', gestureEnabled: false }}>
              <Pilha.Screen name="BoasVindas" component={Tela1} />
              <Pilha.Screen name="Instrucoes" component={Tela2} />
              <Pilha.Screen name="Jogo" component={Tela3} />
              <Pilha.Screen name="Creditos" component={Tela4} />
            </Pilha.Navigator>
          </NavigationContainer>
        </NavigationIndependentTree>
      </ProvedorJogo>
    </SafeAreaProvider>
  );
}
