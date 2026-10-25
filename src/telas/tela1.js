import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Botao from '../componentes/botao';
import FundoEspacial from '../componentes/fundoEspacial';
import Satelite from '../componentes/satelite';
import { usarContextoJogo } from '../contexto/contextoJogo';
import estilos from '../estilos/estilos';

export default function Tela1({ navigation: navegacao }) {
  const { recorde } = usarContextoJogo();
  return (
    <SafeAreaView style={estilos.pagina}>
      <FundoEspacial />
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={estilos.topo}>
          <Text style={estilos.selo}>MISSÃO 010</Text>
          <Text style={estilos.etiqueta}>ARCADE ESPACIAL</Text>
        </View>
        <Text style={estilos.titulo}>ÓRBITA{ '\n' }<Text style={estilos.destaque}>PERDIDA.</Text></Text>
        <Text style={estilos.paragrafo}>Um pequeno satélite. Um universo de obstáculos.{ '\n' }Quanto tempo você consegue continuar em órbita?</Text>
        <View style={estilos.vitrine} accessible accessibilityLabel="Satélite com painéis solares azuis e propulsão">
          <View style={estilos.orbita} />
          <Satelite largura={144} propulsao />
        </View>
        <View style={[estilos.painel, estilos.distribuido, { marginTop: 0 }]}>
          <View><Text style={estilos.etiqueta}>RECORDE DA SESSÃO</Text><Text style={estilos.textoPequeno}>Cada passagem conta.</Text></View>
          <Text style={estilos.numeroGrande}>{recorde.toString().padStart(2, '0')}</Text>
        </View>
        <View style={estilos.botoes}>
          <Botao titulo="Iniciar missão" aoPressionar={() => navegacao.navigate('Jogo')} />
          <Botao titulo="Como jogar" secundario aoPressionar={() => navegacao.navigate('Instrucoes')} />
          <Botao titulo="Créditos" secundario aoPressionar={() => navegacao.navigate('Creditos')} />
        </View>
        <Text style={estilos.rodape}>FATEC ITAQUERA  /  PROJETO ACADÊMICO</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
