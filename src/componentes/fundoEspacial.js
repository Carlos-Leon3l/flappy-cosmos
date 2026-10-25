import React from 'react';
import { StyleSheet, View } from 'react-native';
import imagensJogo from '../funcoes/imagensJogo';
import RecursoVisual from './recursoVisual';

const estrelas = Array.from({ length: 52 }, (_, indice) => ({
  esquerda: `${(indice * 37 + 11) % 100}%`,
  topo: `${(indice * 61 + 7) % 100}%`,
  tamanho: indice % 9 === 0 ? 3 : 2,
  cor: indice % 4 === 0 ? '#7EACC8' : '#274565',
}));

function FundoEspacial() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <RecursoVisual fonte={imagensJogo.fundoEspacial} estilo={StyleSheet.absoluteFillObject} ajuste="cover">
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#071125' }]}>
          {estrelas.map((estrela, indice) => <View key={indice} style={{ position: 'absolute', left: estrela.esquerda, top: estrela.topo, width: estrela.tamanho, height: estrela.tamanho, backgroundColor: estrela.cor }} />)}
        </View>
      </RecursoVisual>
    </View>
  );
}

export default React.memo(FundoEspacial);
