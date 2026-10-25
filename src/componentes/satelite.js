import React from 'react';
import { StyleSheet, View } from 'react-native';
import imagensJogo from '../funcoes/imagensJogo';
import RecursoVisual from './recursoVisual';

function Satelite({ largura = 72, propulsao = false }) {
  return (
    <View style={{ width: largura, height: largura * 2 / 3 }} pointerEvents="none">
      {propulsao && (
        <View style={aparencia.chama}>
          <RecursoVisual fonte={imagensJogo.propulsao} estilo={aparencia.imagem}>
            <View style={aparencia.chamaExterna}><View style={aparencia.chamaInterna} /></View>
          </RecursoVisual>
        </View>
      )}
      <RecursoVisual fonte={imagensJogo.satelite} estilo={aparencia.imagem}>
        <View style={aparencia.imagem}>
          <View style={aparencia.eixo} />
          <View style={[aparencia.painel, aparencia.painelSuperior]}><View style={aparencia.divisaoVertical} /><View style={aparencia.divisaoHorizontal} /></View>
          <View style={[aparencia.painel, aparencia.painelInferior]}><View style={aparencia.divisaoVertical} /><View style={aparencia.divisaoHorizontal} /></View>
          <View style={aparencia.motor} />
          <View style={aparencia.corpo}><View style={aparencia.janela} /><View style={aparencia.luz} /></View>
          <View style={aparencia.antena} /><View style={aparencia.ponta} />
        </View>
      </RecursoVisual>
    </View>
  );
}

export default React.memo(Satelite);

const aparencia = StyleSheet.create({
  imagem: { width: '100%', height: '100%' },
  eixo: { position: 'absolute', width: '8%', height: '90%', left: '44%', top: '5%', backgroundColor: '#BDD0DF' },
  painel: { position: 'absolute', width: '65%', height: '25%', left: '14%', borderWidth: 2, borderColor: '#49B9E8', backgroundColor: '#2468B4' },
  painelSuperior: { top: 0 },
  painelInferior: { bottom: 0 },
  divisaoVertical: { position: 'absolute', left: '48%', width: 2, height: '100%', backgroundColor: '#49B9E8' },
  divisaoHorizontal: { position: 'absolute', top: '45%', height: 1, width: '100%', backgroundColor: '#49B9E8' },
  corpo: { position: 'absolute', left: '18%', top: '29%', width: '57%', height: '42%', backgroundColor: '#EDF6FF', borderWidth: 2, borderColor: '#7398B8' },
  janela: { position: 'absolute', left: '16%', top: '22%', width: '33%', height: '56%', backgroundColor: '#2468B4' },
  luz: { position: 'absolute', right: '10%', top: '30%', width: '13%', height: '40%', backgroundColor: '#F99532' },
  motor: { position: 'absolute', left: '10%', top: '38%', width: '12%', height: '24%', backgroundColor: '#7398B8' },
  antena: { position: 'absolute', left: '75%', top: '46%', height: '8%', width: '22%', backgroundColor: '#BDD0DF' },
  ponta: { position: 'absolute', right: 0, top: '38%', width: '6%', height: '24%', backgroundColor: '#49B9E8' },
  chama: { position: 'absolute', right: '90%', top: '37%', width: '33%', height: '26%' },
  chamaExterna: { position: 'absolute', width: '100%', height: '100%', backgroundColor: '#2468B4', borderLeftWidth: 5, borderLeftColor: '#071125' },
  chamaInterna: { position: 'absolute', right: 0, top: '25%', height: '50%', width: '70%', backgroundColor: '#8CE9FF' },
});
