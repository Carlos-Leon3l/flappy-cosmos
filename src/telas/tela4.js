import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Botao from '../componentes/botao';
import FundoEspacial from '../componentes/fundoEspacial';
import estilos from '../estilos/estilos';

export default function Tela4({ navigation: navegacao }) {
  return (
    <SafeAreaView style={estilos.pagina}>
      <FundoEspacial />
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={estilos.topo}><Text style={estilos.selo}>EQUIPE DA MISSÃO</Text><Botao titulo="Voltar" pequeno secundario aoPressionar={() => navegacao.goBack()} /></View>
        <Text style={estilos.iniciais}>CL</Text>
        <Text style={estilos.tituloPagina}>Carlos Leonel</Text>
        <Text style={estilos.paragrafo}>Desenvolvimento e identidade do projeto acadêmico.</Text>
        <View style={estilos.painel}>
          <Text style={estilos.selo}>FATEC ITAQUERA</Text>
          <Text style={[estilos.tituloItem, { marginTop: 12 }]}>Desenvolvimento de Software Multiplataforma</Text>
          <Text style={estilos.textoPequeno}>Atividade de React Native · Órbita Perdida</Text>
        </View>
        <View style={estilos.aviso}>
          <Text style={estilos.textoPequeno}>Este site é um projeto acadêmico da FATEC, criado apenas para fins de estudo. Não utilize as informações aqui para uso real.</Text>
        </View>
        <Text style={estilos.textoPequeno}>Inspirado na mecânica de Flappy Bird, com tema de exploração espacial. Desenvolvido com React Native, Expo e React Navigation. Sprites do pacote visual preparados com geração de imagens por IA.</Text>
        <View style={estilos.botoes}><Botao titulo="Voltar ao início" aoPressionar={() => navegacao.popToTop()} /></View>
        <Text style={estilos.rodape}>APRENDER TAMBÉM É EXPLORAR.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
