import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Botao from '../componentes/botao';
import FundoEspacial from '../componentes/fundoEspacial';
import estilos from '../estilos/estilos';

const instrucoes = [
  ['Toque para subir', 'Cada toque na área de voo aciona o propulsor. Sem impulso, o satélite desce. Toques curtos e ritmados ajudam a manter o controle.'],
  ['Encontre a passagem', 'Atravesse o espaço entre os meteoros. Encostar nas rochas ou nos limites superior e inferior encerra a missão.'],
  ['Conquiste pontos', 'Cada par de obstáculos completamente ultrapassado vale 1 ponto. O tempo mostra quanto durou seu voo.'],
  ['Faça uma pausa', 'Use Pausar para descansar. Ao sair da tela ou colocar o aplicativo em segundo plano, o voo também pausa. Toque em Continuar para retomar.'],
];

export default function Tela2({ navigation: navegacao }) {
  return (
    <SafeAreaView style={estilos.pagina}>
      <FundoEspacial />
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={estilos.topo}><Text style={estilos.selo}>MANUAL DE VOO</Text><Botao titulo="Voltar" pequeno secundario aoPressionar={() => navegacao.goBack()} /></View>
        <Text style={estilos.tituloPagina}>Pequenos impulsos.{ '\n' }Grandes distâncias.</Text>
        <Text style={estilos.paragrafo}>Seu objetivo é sobreviver e superar o próprio recorde.</Text>
        {instrucoes.map(([titulo, texto], indice) => (
          <View key={titulo} style={estilos.instrucao}>
            <Text style={estilos.numeroPasso}>{indice + 1}</Text>
            <View style={estilos.corpoItem}><Text style={estilos.tituloItem}>{titulo}</Text><Text style={estilos.textoPequeno}>{texto}</Text></View>
          </View>
        ))}
        <View style={estilos.aviso}><Text style={estilos.textoPequeno}>O recorde é mantido entre partidas enquanto o aplicativo estiver aberto. Uma nova missão sempre começa do zero.</Text></View>
        <Botao titulo="Entendi, vamos voar" aoPressionar={() => navegacao.navigate('Jogo')} />
      </ScrollView>
    </SafeAreaView>
  );
}
