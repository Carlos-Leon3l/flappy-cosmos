export const configuracao = Object.freeze({
  largura: 360,
  altura: 600,
  larguraSatelite: 72,
  alturaSatelite: 48,
  posicaoSatelite: 76,
  gravidade: 900,
  impulso: -320,
  larguraObstaculo: 72,
  abertura: 190,
  velocidade: 110,
  distanciaObstaculos: 240,
  passo: 1 / 60,
});

export function criarObstaculo(id, posicao, centroAnterior = 300, sortear = Math.random) {
  const centroSorteado = 170 + Math.max(0, Math.min(1, sortear())) * 260;
  const centro = Math.max(centroAnterior - 120, Math.min(centroAnterior + 120, centroSorteado));
  return { id, posicao, centro, pontuado: false };
}

export function criarPartida(sortear = Math.random) {
  const obstaculos = [];
  let centro = 300;
  for (let indice = 0; indice < 3; indice += 1) {
    const obstaculo = criarObstaculo(indice, 420 + indice * configuracao.distanciaObstaculos, centro, sortear);
    obstaculos.push(obstaculo);
    centro = obstaculo.centro;
  }
  return {
    situacao: 'pronto',
    posicao: 276,
    velocidadeVertical: 0,
    obstaculos,
    proximoId: 3,
    pontuacao: 0,
    tempo: 0,
    propulsao: 0,
  };
}

export function aplicarImpulso(partida) {
  if (!['pronto', 'jogando'].includes(partida.situacao)) return partida;
  return { ...partida, situacao: 'jogando', velocidadeVertical: configuracao.impulso, propulsao: 0.16 };
}

export function pausarPartida(partida) {
  return partida.situacao === 'jogando' ? { ...partida, situacao: 'pausado' } : partida;
}

export function retomarPartida(partida) {
  return partida.situacao === 'pausado' ? { ...partida, situacao: 'jogando' } : partida;
}

export function verificarColisao(partida) {
  const esquerda = configuracao.posicaoSatelite + 4;
  const direita = configuracao.posicaoSatelite + configuracao.larguraSatelite - 4;
  const topo = partida.posicao + 4;
  const base = partida.posicao + configuracao.alturaSatelite - 4;
  if (topo <= 0 || base >= configuracao.altura) return true;
  return partida.obstaculos.some((obstaculo) => {
    const sobrepoe = direita >= obstaculo.posicao && esquerda <= obstaculo.posicao + configuracao.larguraObstaculo;
    return sobrepoe && (topo <= obstaculo.centro - configuracao.abertura / 2 || base >= obstaculo.centro + configuracao.abertura / 2);
  });
}

export function avancarPartida(partida, sortear = Math.random) {
  if (partida.situacao !== 'jogando') return partida;
  const velocidadeVertical = partida.velocidadeVertical + configuracao.gravidade * configuracao.passo;
  let obstaculos = partida.obstaculos.map((obstaculo) => ({
    ...obstaculo,
    posicao: obstaculo.posicao - configuracao.velocidade * configuracao.passo,
  }));
  const proxima = {
    ...partida,
    velocidadeVertical,
    posicao: partida.posicao + velocidadeVertical * configuracao.passo,
    tempo: partida.tempo + configuracao.passo,
    propulsao: Math.max(0, partida.propulsao - configuracao.passo),
    obstaculos,
  };
  if (verificarColisao(proxima)) return { ...proxima, situacao: 'encerrado', propulsao: 0 };
  let pontos = 0;
  obstaculos = obstaculos.map((obstaculo) => {
    if (!obstaculo.pontuado && obstaculo.posicao + configuracao.larguraObstaculo < configuracao.posicaoSatelite + 4) {
      pontos += 1;
      return { ...obstaculo, pontuado: true };
    }
    return obstaculo;
  });
  obstaculos = obstaculos.filter((obstaculo) => obstaculo.posicao + configuracao.larguraObstaculo > 0);
  let proximoId = partida.proximoId;
  while (obstaculos.length < 3) {
    const ultimo = obstaculos[obstaculos.length - 1];
    obstaculos.push(criarObstaculo(proximoId, ultimo.posicao + configuracao.distanciaObstaculos, ultimo.centro, sortear));
    proximoId += 1;
  }
  return { ...proxima, obstaculos, proximoId, pontuacao: partida.pontuacao + pontos };
}

export function formatarTempo(tempo) {
  const segundos = Math.floor(tempo + 0.000001);
  return `${Math.floor(segundos / 60).toString().padStart(2, '0')}:${(segundos % 60).toString().padStart(2, '0')}`;
}
