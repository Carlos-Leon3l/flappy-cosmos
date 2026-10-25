import assert from 'node:assert/strict';
import { test as testar } from 'node:test';
import {
  aplicarImpulso, avancarPartida, configuracao, criarObstaculo, criarPartida,
  formatarTempo, pausarPartida, retomarPartida, verificarColisao,
} from '../src/funcoes/motorJogo.js';

const sortearCentro = () => 0.5;

testar('inicia pronto, centralizado e sem colisão, com três obstáculos à frente', () => {
  const partida = criarPartida(sortearCentro);
  assert.equal(partida.situacao, 'pronto');
  assert.equal(partida.pontuacao, 0);
  assert.equal(partida.tempo, 0);
  assert.equal(partida.obstaculos.length, 3);
  assert.equal(verificarColisao(partida), false);
  assert.ok(partida.obstaculos.every((obstaculo) => obstaculo.posicao > configuracao.largura));
});

testar('o primeiro impulso inicia o voo e os seguintes substituem a velocidade', () => {
  const partida = aplicarImpulso(criarPartida(sortearCentro));
  assert.equal(partida.situacao, 'jogando');
  assert.equal(partida.velocidadeVertical, -320);
  assert.equal(aplicarImpulso({ ...partida, velocidadeVertical: 200 }).velocidadeVertical, -320);
  assert.ok(avancarPartida(partida).posicao < partida.posicao);
});

testar('gravidade e obstáculos avançam com passo fixo sem modificar a entrada', () => {
  const partida = { ...criarPartida(sortearCentro), situacao: 'jogando' };
  const copia = structuredClone(partida);
  const proxima = avancarPartida(partida);
  assert.equal(proxima.velocidadeVertical, 15);
  assert.equal(proxima.posicao, partida.posicao + 0.25);
  assert.equal(proxima.obstaculos[0].posicao, 420 - 110 / 60);
  assert.equal(proxima.tempo, 1 / 60);
  assert.deepEqual(partida, copia);
});

testar('sem impulso o satélite cai e a partida encerra', () => {
  let partida = { ...criarPartida(sortearCentro), situacao: 'jogando' };
  for (let passo = 0; passo < 180 && partida.situacao === 'jogando'; passo += 1) partida = avancarPartida(partida);
  assert.equal(partida.situacao, 'encerrado');
});

testar('colide com os limites superior e inferior inclusive no contato exato', () => {
  const partida = criarPartida(sortearCentro);
  assert.equal(verificarColisao({ ...partida, posicao: -4 }), true);
  assert.equal(verificarColisao({ ...partida, posicao: 556 }), true);
  assert.equal(verificarColisao({ ...partida, posicao: 0 }), false);
});

testar('passa pela abertura e colide com rochas acima, abaixo e na lateral', () => {
  const partida = { ...criarPartida(sortearCentro), obstaculos: [criarObstaculo(0, 100, 300, sortearCentro)] };
  assert.equal(verificarColisao(partida), false);
  assert.equal(verificarColisao({ ...partida, posicao: 180 }), true);
  assert.equal(verificarColisao({ ...partida, posicao: 365 }), true);
  assert.equal(verificarColisao({ ...partida, posicao: 180, obstaculos: [{ ...partida.obstaculos[0], posicao: 144 }] }), true);
});

testar('soma um ponto por passagem completa, sem repetir no quadro seguinte', () => {
  const partida = {
    ...criarPartida(sortearCentro), situacao: 'jogando',
    obstaculos: [criarObstaculo(0, 8, 300, sortearCentro), criarObstaculo(1, 248, 300, sortearCentro), criarObstaculo(2, 488, 300, sortearCentro)],
  };
  const proxima = avancarPartida(partida);
  assert.equal(proxima.pontuacao, 1);
  assert.equal(proxima.obstaculos[0].pontuado, true);
  assert.equal(avancarPartida(proxima).pontuacao, 1);
});

testar('colisão não concede ponto mesmo quando outro obstáculo é ultrapassado', () => {
  const partida = { ...criarPartida(sortearCentro), situacao: 'jogando', posicao: 556 };
  partida.obstaculos[0].posicao = 0;
  const proxima = avancarPartida(partida);
  assert.equal(proxima.situacao, 'encerrado');
  assert.equal(proxima.pontuacao, 0);
});

testar('recicla obstáculos fora da tela preservando distância e identificadores únicos', () => {
  const partida = { ...criarPartida(sortearCentro), situacao: 'jogando' };
  partida.obstaculos = partida.obstaculos.map((obstaculo, indice) => ({ ...obstaculo, posicao: -73 + indice * 240 }));
  const proxima = avancarPartida(partida, sortearCentro);
  assert.equal(proxima.obstaculos.length, 3);
  assert.deepEqual(proxima.obstaculos.map((obstaculo) => obstaculo.id), [1, 2, 3]);
  assert.equal(proxima.proximoId, 4);
  assert.ok(Math.abs(proxima.obstaculos[2].posicao - proxima.obstaculos[1].posicao - 240) < 0.00001);
});

testar('aberturas respeitam margens e não saltam mais de 120 unidades entre pares', () => {
  let anterior = 300;
  for (let indice = 0; indice < 100; indice += 1) {
    const obstaculo = criarObstaculo(indice, 420, anterior, () => indice % 2);
    assert.ok(obstaculo.centro >= 170 && obstaculo.centro <= 430);
    assert.ok(Math.abs(obstaculo.centro - anterior) <= 120);
    assert.ok(obstaculo.centro - configuracao.abertura / 2 >= 75);
    assert.ok(obstaculo.centro + configuracao.abertura / 2 <= 525);
    anterior = obstaculo.centro;
  }
});

testar('pausa congela física, tempo, propulsão e pontuação, ignorando impulsos', () => {
  const pausada = pausarPartida(aplicarImpulso(criarPartida(sortearCentro)));
  assert.equal(pausada.situacao, 'pausado');
  assert.strictEqual(avancarPartida(pausada), pausada);
  assert.strictEqual(aplicarImpulso(pausada), pausada);
  const retomada = retomarPartida(pausada);
  assert.equal(retomada.situacao, 'jogando');
  assert.equal(retomada.tempo, pausada.tempo);
  assert.equal(retomada.posicao, pausada.posicao);
});

testar('somente uma pausa pode ser retomada; pronto e encerrado não avançam', () => {
  const pronta = criarPartida(sortearCentro);
  const encerrada = { ...pronta, situacao: 'encerrado' };
  for (const partida of [pronta, encerrada]) {
    assert.strictEqual(avancarPartida(partida), partida);
    assert.strictEqual(pausarPartida(partida), partida);
    assert.strictEqual(retomarPartida(partida), partida);
  }
  assert.strictEqual(aplicarImpulso(encerrada), encerrada);
});

testar('nova partida zera pontuação, tempo e velocidade sem reaproveitar obstáculos', () => {
  const antiga = aplicarImpulso(criarPartida(sortearCentro));
  const nova = criarPartida(sortearCentro);
  assert.equal(nova.situacao, 'pronto');
  assert.equal(nova.pontuacao, 0);
  assert.equal(nova.tempo, 0);
  assert.equal(nova.velocidadeVertical, 0);
  assert.notStrictEqual(nova.obstaculos, antiga.obstaculos);
});

testar('formata tempo sem atrasar um segundo por arredondamento do passo fixo', () => {
  assert.equal(formatarTempo(0), '00:00');
  assert.equal(formatarTempo(59.5), '00:59');
  assert.equal(formatarTempo(59.999999999), '01:00');
  assert.equal(formatarTempo(125), '02:05');
});

testar('um piloto automático atravessa cem pares sem duplicar pontos ou perder obstáculos', () => {
  let partida = aplicarImpulso(criarPartida(sortearCentro));
  for (let passo = 0; passo < 15000 && partida.pontuacao < 100; passo += 1) {
    if (partida.posicao > 276 && partida.velocidadeVertical > 0) partida = aplicarImpulso(partida);
    partida = avancarPartida(partida, sortearCentro);
    assert.equal(partida.situacao, 'jogando');
    assert.equal(partida.obstaculos.length, 3);
  }
  assert.equal(partida.pontuacao, 100);
  assert.ok(partida.tempo > 200);
});
