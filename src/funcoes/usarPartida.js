import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { aplicarImpulso, avancarPartida, configuracao, criarPartida, pausarPartida, retomarPartida } from './motorJogo';

export default function usarPartida(registrarPontuacao) {
  const [partida, definirPartida] = useState(criarPartida);
  const referencia = useRef(partida);
  const focado = useIsFocused();
  const atualizarPartida = useCallback((transformar) => {
    const proxima = transformar(referencia.current);
    referencia.current = proxima;
    definirPartida(proxima);
  }, []);
  const pausar = useCallback(() => atualizarPartida(pausarPartida), [atualizarPartida]);
  const impulsionar = useCallback(() => atualizarPartida(aplicarImpulso), [atualizarPartida]);
  const reiniciar = useCallback(() => atualizarPartida(() => criarPartida()), [atualizarPartida]);
  const retomar = useCallback(() => {
    const visivel = Platform.OS !== 'web' || !document.hidden;
    if (focado && visivel && AppState.currentState !== 'background' && AppState.currentState !== 'inactive') {
      atualizarPartida(retomarPartida);
    }
  }, [atualizarPartida, focado]);

  useEffect(() => {
    registrarPontuacao(partida.pontuacao);
  }, [partida.pontuacao, registrarPontuacao]);

  useEffect(() => {
    if (!focado) pausar();
  }, [focado, pausar]);

  useEffect(() => {
    const assinatura = AppState.addEventListener('change', (estado) => {
      if (estado !== 'active') pausar();
    });
    const aoOcultar = () => { if (document.hidden) pausar(); };
    if (Platform.OS === 'web') document.addEventListener('visibilitychange', aoOcultar);
    return () => {
      assinatura.remove();
      if (Platform.OS === 'web') document.removeEventListener('visibilitychange', aoOcultar);
    };
  }, [pausar]);

  useEffect(() => {
    if (!focado || partida.situacao !== 'jogando') return undefined;
    let quadro;
    let anterior = null;
    let acumulado = 0;
    let ativo = true;
    function animar(instante) {
      if (!ativo || referencia.current.situacao !== 'jogando') return;
      if (anterior !== null) acumulado += Math.min((instante - anterior) / 1000, 0.1);
      anterior = instante;
      let proxima = referencia.current;
      while (acumulado >= configuracao.passo && proxima.situacao === 'jogando') {
        proxima = avancarPartida(proxima);
        acumulado -= configuracao.passo;
      }
      if (proxima !== referencia.current) atualizarPartida(() => proxima);
      if (proxima.situacao === 'jogando') quadro = requestAnimationFrame(animar);
    }
    quadro = requestAnimationFrame(animar);
    return () => {
      ativo = false;
      cancelAnimationFrame(quadro);
    };
  }, [focado, partida.situacao, atualizarPartida]);

  return { partida, impulsionar, pausar, retomar, reiniciar };
}
