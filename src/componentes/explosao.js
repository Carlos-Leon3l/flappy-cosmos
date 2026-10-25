import React from 'react';
import { View } from 'react-native';
import imagensJogo from '../funcoes/imagensJogo';
import RecursoVisual from './recursoVisual';

function Explosao() {
  return (
    <View style={{ width: 64, height: 64 }} pointerEvents="none">
      <RecursoVisual fonte={imagensJogo.explosao} estilo={{ width: 64, height: 64 }}>
        <View style={{ width: 64, height: 64, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ position: 'absolute', width: 48, height: 48, backgroundColor: '#F99532', transform: [{ rotate: '45deg' }] }} />
          <View style={{ position: 'absolute', width: 48, height: 48, backgroundColor: '#F99532' }} />
          <View style={{ width: 30, height: 30, backgroundColor: '#FFE29A' }} />
        </View>
      </RecursoVisual>
    </View>
  );
}

export default React.memo(Explosao);
