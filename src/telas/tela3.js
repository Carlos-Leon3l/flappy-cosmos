import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Botao from '../componentes/botao';
import Explosao from '../componentes/explosao';
import FundoEspacial from '../componentes/fundoEspacial';
import Meteoro from '../componentes/meteoro';
import Satelite from '../componentes/satelite';
import { usarContextoJogo } from '../contexto/contextoJogo';
import estilos from '../estilos/estilos';
import { configuracao, formatarTempo } from '../funcoes/motorJogo';
import usarPartida from '../funcoes/usarPartida';

export default function Tela3({ navigation: navegacao }) {
  const { recorde, registrarPontuacao } = usarContextoJogo();
  const { partida, impulsionar, pausar, retomar, reiniciar } = usarPartida(registrarPontuacao);
  const [area, definirArea] = useState({ largura: 0, altura: 0 });
  const [mostrarResultado, definirMostrarResultado] = useState(false);
  const escala = Math.min(area.largura / configuracao.largura, area.altura / configuracao.altura, 1.5);
  const largura = configuracao.largura * escala;
  const altura = configuracao.altura * escala;

  useEffect(() => {
    definirMostrarResultado(false);
    if (partida.situacao !== 'encerrado') return undefined;
    const espera = setTimeout(() => definirMostrarResultado(true), 450);
    return () => clearTimeout(espera);
  }, [partida.situacao]);

  function voltarAoInicio() {
    pausar();
    navegacao.popToTop();
  }

  return (
    <SafeAreaView style={estilos.pagina}>
      <View style={estilos.cabecalhoJogo}>
        <Botao titulo="Sair" rotulo="Sair da missão" pequeno secundario aoPressionar={voltarAoInicio} />
        <Text style={estilos.selo}>ÓRBITA PERDIDA</Text>
        {partida.situacao === 'jogando'
          ? <Botao titulo="Pausar" pequeno secundario aoPressionar={pausar} />
          : <Text style={[estilos.etiqueta, { minWidth: 64, textAlign: 'right' }]}>SOLO</Text>}
      </View>
      <View style={estilos.placar}>
        {[
          ['PONTOS', partida.pontuacao.toString().padStart(2, '0')],
          ['TEMPO', formatarTempo(partida.tempo)],
          ['RECORDE', recorde.toString().padStart(2, '0')],
        ].map(([rotulo, valor]) => (
          <View key={rotulo} style={estilos.indicador}>
            <Text style={estilos.etiqueta}>{rotulo}</Text>
            <Text testID={`indicador${rotulo}`} style={[estilos.valorIndicador, rotulo === 'RECORDE' && { color: '#F99532' }]}>{valor}</Text>
          </View>
        ))}
      </View>
      <View style={estilos.areaDisponivel} onLayout={({ nativeEvent: evento }) => definirArea({ largura: evento.layout.width, altura: evento.layout.height })}>
        {escala > 0 && (
          <View style={[estilos.molduraJogo, { width: largura, height: altura }]}>
            <View style={[estilos.campoLogico, { left: (largura - 360) / 2, top: (altura - 600) / 2, transform: [{ scale: escala }] }]}>
              <Pressable testID="campoJogo" accessibilityRole="button" accessibilityLabel="Área de voo. Toque para impulsionar o satélite" onPressIn={impulsionar} style={StyleSheet.absoluteFill}>
                <FundoEspacial />
                {partida.obstaculos.map((obstaculo) => {
                  const topo = obstaculo.centro - configuracao.abertura / 2;
                  const base = obstaculo.centro + configuracao.abertura / 2;
                  return (
                    <React.Fragment key={obstaculo.id}>
                      <View style={{ position: 'absolute', left: obstaculo.posicao, top: 0 }}><Meteoro altura={topo} superior /></View>
                      <View style={{ position: 'absolute', left: obstaculo.posicao, top: base }}><Meteoro altura={600 - base} superior={false} /></View>
                    </React.Fragment>
                  );
                })}
                <View style={{ position: 'absolute', left: configuracao.posicaoSatelite, top: partida.posicao }}>
                  {partida.situacao === 'encerrado' ? <Explosao /> : <Satelite propulsao={partida.propulsao > 0} />}
                </View>
                <View style={[estilos.limiteCampo, { top: 0 }]} /><View style={[estilos.limiteCampo, { bottom: 0 }]} />
                <Text style={estilos.rotuloCampo}>SETOR 010  /  CAMPO DE METEOROS</Text>
                {partida.situacao === 'pronto' && (
                  <View pointerEvents="none" style={estilos.convite}>
                    <Text style={estilos.selo}>SISTEMAS PRONTOS</Text>
                    <Text style={[estilos.tituloConvite, { marginTop: 12 }]}>Toque para decolar</Text>
                    <Text style={[estilos.textoPequeno, estilos.textoCentral]}>Continue tocando para manter o satélite em voo.</Text>
                  </View>
                )}
              </Pressable>
            </View>
            {(partida.situacao === 'pausado' || mostrarResultado) && (
              <ScrollView style={estilos.cobertura} contentContainerStyle={estilos.conteudoCobertura}>
                <View style={estilos.caixaCobertura}>
                  <Text style={estilos.selo}>{partida.situacao === 'pausado' ? 'SINAL EM ESPERA' : 'SINAL PERDIDO'}</Text>
                  <Text accessibilityRole="header" style={estilos.tituloCobertura}>{partida.situacao === 'pausado' ? 'Missão pausada' : 'Fim de missão'}</Text>
                  <Text style={estilos.paragrafo}>{partida.situacao === 'pausado' ? 'Respire. Seu satélite vai esperar por você.' : 'Toda missão ensina um novo caminho. Vamos tentar outra vez?'}</Text>
                  <View style={[estilos.distribuido, { marginTop: 20 }]}>
                    <Text style={estilos.textoPequeno}>{partida.pontuacao} {partida.pontuacao === 1 ? 'ponto' : 'pontos'}</Text>
                    <Text style={[estilos.textoPequeno, estilos.monoespaco]}>{formatarTempo(partida.tempo)}</Text>
                  </View>
                  <View style={estilos.botoes}>
                    {partida.situacao === 'pausado' && <Botao titulo="Continuar" aoPressionar={retomar} />}
                    <Botao titulo="Nova missão" secundario={partida.situacao === 'pausado'} aoPressionar={reiniciar} />
                    <Botao titulo="Voltar ao início" secundario aoPressionar={voltarAoInicio} />
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        )}
      </View>
      <Text style={estilos.ajudaJogo}>TOQUE PARA SUBIR  ·  ATRAVESSE OS METEOROS</Text>
    </SafeAreaView>
  );
}
