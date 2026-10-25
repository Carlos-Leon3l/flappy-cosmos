import React from 'react';
import { StyleSheet, View } from 'react-native';
import imagensJogo from '../funcoes/imagensJogo';
import RecursoVisual from './recursoVisual';

function Meteoro({ altura, superior }) {
  const fonte = superior ? imagensJogo.obstaculoSuperior : imagensJogo.obstaculoInferior;
  return (
    <View style={{ width: 72, height: altura, overflow: 'hidden' }} pointerEvents="none">
      <RecursoVisual fonte={fonte} estilo={{ position: 'absolute', width: 72, height: altura, top: 0 }} ajuste="cover">
        <View style={aparencia.coluna}>
          {Array.from({ length: Math.ceil(altura / 48) }, (_, indice) => (
            <View key={indice} style={[aparencia.rocha, { top: indice * 48 - 8, backgroundColor: indice % 2 ? '#3C536B' : '#4C6278' }]}>
              <View style={aparencia.cratera} /><View style={aparencia.mineral} /><View style={aparencia.brilho} />
            </View>
          ))}
        </View>
      </RecursoVisual>
    </View>
  );
}

export default React.memo(Meteoro);

const aparencia = StyleSheet.create({
  coluna: { width: 72, height: '100%', backgroundColor: '#344B63', borderLeftWidth: 3, borderRightWidth: 3, borderColor: '#263B53', overflow: 'hidden' },
  rocha: { position: 'absolute', left: -2, width: 70, height: 58, borderWidth: 3, borderColor: '#2A3E53', borderRadius: 13 },
  cratera: { position: 'absolute', left: 12, top: 16, width: 23, height: 17, backgroundColor: '#263B53', borderRadius: 5, borderTopWidth: 3, borderTopColor: '#1B2D44' },
  mineral: { position: 'absolute', right: 8, top: 31, width: 7, height: 6, backgroundColor: '#BF7B4B' },
  brilho: { position: 'absolute', left: 10, top: 5, width: 28, height: 4, backgroundColor: '#6A8196' },
});
