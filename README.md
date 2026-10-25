# Órbita Perdida

Jogo solo de React Native inspirado em Flappy Bird. Toque na área de voo para impulsionar o satélite e atravesse os pares de meteoros. Uma colisão com as rochas ou com os limites superior e inferior encerra a missão.

Autor: **Carlos Leonel** · **FATEC Itaquera** · **Desenvolvimento de Software Multiplataforma**.

## Executar localmente

Requer Node.js 20.19 ou superior e acesso ao registro npm para instalar as dependências.

```bash
npm install
npm run web
```

Para abrir com Expo Go no Android ou iOS compatível com SDK 54, execute `npm start` e use o QR code. O manifesto define orientação vertical e não contém caminhos de ícone, splash ou outros assets locais.

## Importar e salvar no Snack

1. Use esta pasta `atividade10` como raiz do repositório GitHub: `App.js`, `package.json` e `src` devem estar na raiz desse repositório. Não envie `node_modules`.
2. Abra o Snack Expo e importe esse repositório pela opção de importação de repositório Git. Se preferir transferir os arquivos manualmente, preserve a estrutura das subpastas.
3. Selecione **SDK 54** e confira as dependências declaradas no `package.json`. O ponto inicial no Snack é `App.js`; não é necessário copiar código para um único arquivo.
4. Execute o preview web e teste em um aparelho com Expo Go compatível com SDK 54.
5. Salve o Snack na sua conta, abra o link compartilhável para conferir o acesso e envie esse link na tarefa do Teams.

O ZIP `../entregaveis/orbitaPerdidaCodigo.zip` contém os arquivos desta pasta diretamente na raiz, sem dependências instaladas, imagens ou artefatos de compilação. Ele serve para extrair e preparar o repositório; o ZIP não é apresentado como um formato de importação direta do Snack.

### Dependências

| Pacote | Versão declarada |
| --- | --- |
| Expo | `~54.0.37` |
| React / React DOM | `19.1.0` |
| React Native | `0.81.5` |
| React Native Web | `~0.21.0` |
| Metro Runtime | `~6.1.2` |
| React Navigation Native | `^7.5.0` |
| React Navigation Native Stack | `^7.20.0` |
| Safe Area Context | `~5.6.0` |
| React Native Screens | `~4.16.0` |

As versões nativas foram conferidas nos metadados `bundledNativeModules.json` do Expo 54.0.37 instalado nos projetos anteriores. O aplicativo usa o navegador de pilha e não depende de RNEUI, Matter.js ou React Native Game Engine.

## Adicionar os sprites depois

O jogo funciona sem imagens. O satélite, os meteoros, a propulsão, a explosão e as estrelas têm representações feitas com componentes nativos.

O pacote visual já preparado está em `../entregaveis/jogo-satelite/`. Envie os seis PNGs para uma pasta `assets` na raiz do seu Snack. Depois altere somente `src/funcoes/imagensJogo.js` para:

```js
const imagensJogo = {
  satelite: require('../../assets/satelite.png'),
  propulsao: require('../../assets/propulsao.png'),
  obstaculoSuperior: require('../../assets/obstaculo-superior.png'),
  obstaculoInferior: require('../../assets/obstaculo-inferior.png'),
  explosao: require('../../assets/explosao.png'),
  fundoEspacial: require('../../assets/fundo-espacial.png'),
};

export default imagensJogo;
```

Adicione os arquivos antes de escrever os `require`: o Metro precisa resolver referências locais mesmo que a imagem não esteja sendo exibida. Uma entrada `null` mantém a representação nativa daquele elemento. Imagens com falha de carregamento também usam a representação nativa.

O satélite, a chama e a explosão usam `contain`; o fundo e os meteoros usam `cover`, preservando a proporção e recortando o excesso. As áreas de colisão são retangulares, com uma margem de 4 unidades no satélite. Não há colisão por pixel. Confira a percepção de contato após inserir os PNGs: as margens transparentes das imagens estão descritas em `../entregaveis/jogo-satelite/verificacao.json`. A troca de imagens não modifica o motor.

## Organização

- `App.js`: providers, tema e quatro rotas de React Navigation.
- `src/telas`: `tela1.js` (boas-vindas), `tela2.js` (instruções), `tela3.js` (jogo) e `tela4.js` (créditos).
- `src/componentes`: botão, recursos visuais e representações dos elementos do jogo.
- `src/estilos`: paleta e estilos compartilhados.
- `src/funcoes`: motor independente da interface, controlador da partida e mapa de imagens.
- `src/contexto`: recorde da sessão, compartilhado entre telas.
- `testes`: testes do motor com `node:test` e `node:assert`.

Arquivos e funções usam nomes em português e `camelCase`, com as exceções exigidas pelo Expo e pelos componentes React. Não foram adicionados comentários de código.

## Comportamento da partida

O campo lógico mede 360 × 600 e é dimensionado proporcionalmente ao espaço disponível. A física avança em passos fixos de 1/60 segundo; `requestAnimationFrame` agenda os quadros. Um atraso isolado é limitado a 0,1 segundo de simulação para evitar grandes saltos ao travar a interface. As alturas das passagens variam, com uma distância vertical máxima de 120 unidades entre centros consecutivos.

O primeiro toque inicia a partida com impulso. Cada par completamente ultrapassado vale um ponto, uma única vez. O cronômetro conta o tempo simulado de voo, excluindo pausas. A propulsão aparece por um intervalo curto após cada toque; a explosão aparece por 450 ms antes do painel de resultado.

A pausa manual, a perda de foco da tela e a passagem do aplicativo para segundo plano interrompem a simulação. No navegador, ocultar a aba também pausa. A retomada exige tocar em **Continuar**. Os ciclos de animação e listeners são removidos ao sair da tela. **Nova missão** zera a partida e espera um novo toque. **Sair** volta ao início e descarta a missão atual.

O recorde é atualizado durante as partidas e mantido no contexto enquanto o aplicativo permanece aberto. Não há armazenamento persistente, áudio, anúncios, autenticação, placar online ou modo de dois jogadores.

## Verificação realizada

```bash
npm test
```

Foram executados **15 testes do motor**, cobrindo estado inicial, impulso, gravidade, imutabilidade, colisões, pontuação única, reciclagem e limites dos obstáculos, pausa, retomada, reinício, cronômetro e uma simulação que atravessa cem pares.

A exportação web do Expo/Metro foi verificada em uma cópia temporária do mesmo código. A instalação completa das dependências declaradas não foi possível: o ambiente não conseguiu resolver `registry.npmjs.org`, e o cache npm estava incompleto. A compilação temporária utilizou Expo 54.0.37, React 19.1 e React Native 0.81.5 existentes localmente; para os módulos de navegação no **preview web**, utilizou Safe Area Context 4.12.0, Screens 4.4.0 e Metro Runtime 4.0.1 locais, diferentes das versões declaradas para a entrega. Essas substituições não fazem parte dos arquivos entregues.

O navegador Chromium e o servidor local não conseguiram iniciar por restrições do ambiente. Portanto, **a navegação interativa, a jogabilidade visual, a integração dos PNGs, o Android, o iOS e o Snack ainda precisam de validação manual**. A compilação não substitui esses testes.

### Conferência antes de entregar

- Abrir as quatro telas, retornar pelos botões e conferir os créditos.
- Testar toque, gravidade, passagem pelos meteoros, colisões e pontuação.
- Pausar e conferir que o tempo para; continuar sem salto na posição.
- Trocar de aplicativo ou ocultar a aba e conferir a pausa automática.
- Fazer várias partidas para conferir reinício, recorde e velocidade consistente.
- Conferir os painéis e seus botões em telas pequenas, usando a rolagem quando necessário.
- Se adicionar os sprites, conferir alinhamento, recorte e percepção das colisões.
- Salvar o Snack e abrir seu link compartilhável antes de enviar ao Teams.

## Créditos acadêmicos

Este site é um projeto acadêmico da FATEC, criado apenas para fins de estudo. Não utilize as informações aqui para uso real.
