import React from 'react';
import { Pressable, Text } from 'react-native';
import estilos from '../estilos/estilos';

export default function Botao({ titulo, aoPressionar, secundario = false, pequeno = false, rotulo }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={rotulo || titulo}
      onPress={aoPressionar}
      style={({ pressed }) => [estilos.botao, secundario && estilos.botaoSecundario, pequeno && estilos.botaoPequeno, pressed && estilos.botaoPressionado]}
    >
      <Text style={[estilos.botaoTexto, secundario && estilos.botaoTextoSecundario]}>{titulo}</Text>
    </Pressable>
  );
}
