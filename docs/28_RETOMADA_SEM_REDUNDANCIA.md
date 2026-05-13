# 28 - Retomada sem redundancia e passagem para proxima etapa

Data: 2026-05-05
Sessao de origem informada: `019de8eb-f592-73d1-bc40-fb1fe3dab9e5`
Coordenacao: Ze e Cristine
Especialistas ativos: Tarcila, Norman, Ada, Hedy, Margaret, Katherine, Schneier, Doneda, Myers, Kim e Knuth/ESCRIBA

## Objetivo

Evitar que novas interrupcoes reiniciem o ciclo de releitura, redundancia e validacoes repetidas antes de implementar. Esta pagina passa a ser o ponto unico de retomada operacional para fechar o ciclo atual e entrar na proxima etapa.

## Estado atual que deve ser preservado

- O repositorio ativo e `apps/mobile`.
- O branch ativo esperado e `main`.
- O remoto esperado e `origin/main` no repositorio publico `sinalseguro/App`.
- Ha trabalho local em andamento que nao deve ser descartado sem pedido explicito.
- A etapa ativa e o fechamento do ciclo privado Android com midia local, SOS, Cofre/Player, configuracoes, seguranca local e validacao em aparelho fisico.
- A documentacao principal deste ciclo esta em:
  - `docs/27_REFINO_DRAWER_COFRE_PLAYER_CONFIG.md`
  - `docs/03_TIMELINE.md`
  - `.codex/memory/CRISTINE.md`
  - `.codex/memory/TARCILA.md`
  - `.codex/memory/TECNICA_MOBILE.md`
  - `.codex/memory/SEGURANCA_QA.md`

## Regra de retomada rapida

Na proxima retomada, nao refazer pesquisa geral. Executar somente:

```bash
cd "apps/mobile"
git status --short --branch
sed -n '1,220p' docs/28_RETOMADA_SEM_REDUNDANCIA.md
```

Depois disso, seguir a fila abaixo. So abrir outros documentos se uma pendencia exigir detalhe especifico.

## Fila unica de execucao

1. Preservar todas as alteracoes locais atuais.
2. Revisar apenas os arquivos alterados em `git status --short`.
3. Fechar pendencias de UX/IX ja comentadas:
   - topo com logo/nome aprovado por Tarcila e contraste adequado;
   - clique em logo/nome deve voltar para a Home;
   - SOS ativo com bolha 3D, anel interno, uma unica camada superior em degradê, texto `ATIVO` acima das particulas e sombra verde discreta no texto;
   - Home com `Policia`, `Bombeiros` e `SAMU` ativos por padrao, sem numero no rotulo do botao `Policia`;
   - atalho de Anjo mantido desativado/preparatorio ate gestao de anjos, aceite real e auditoria futura;
   - menu com cores da identidade visual;
   - Cofre sem card tecnico redundante e com duracao/tempo de gravacao na grade;
   - `Atualizar` no Cofre deve representar verificacao de atualizacao/API, nao apenas recarregar lista local;
   - Configuracoes deve ficar em grade iconografica, com conteudos longos em modais;
   - termos de uso, privacidade, autorizacoes, login Google/iCloud e preparo de endpoints devem ficar documentados e representados na UI como etapa preparada, sem credenciais no repo.
4. Rodar gates leves:

```bash
npm run typecheck
npm run lint
npm test
npm run private:android:readiness
git diff --check
```

5. Validar no browser apenas as rotas afetadas:
   - `http://localhost:8081/`
   - `http://localhost:8081/arquivos?painel=cofre`
   - `http://localhost:8081/arquivos?painel=player`
   - `http://localhost:8081/configuracoes`
   - `http://localhost:8081/funcionamento`
6. Se os gates passarem, gerar APK privado:

```bash
npm run build:android:private
shasum -a 256 android/app/build/outputs/apk/debug/app-debug.apk
```

7. Instalar no Android somente quando `adb devices -l` listar o aparelho.
8. Antes de instalar em aparelho fisico, confirmar a acao no momento da instalacao.
9. Validar no Android:
   - abertura fria sem travamento;
   - splash nativa aprovada;
   - Home fixa;
   - SOS inicia pacote local;
   - camera/microfone apenas no build privado e com permissao explicita;
   - encerramento preserva arquivo;
   - Cofre lista pacote;
   - Player abre/reproduz quando houver midia local;
   - excluir remove localmente com confirmacao;
   - configuracoes mantem autorizacoes e termos acessiveis.
10. Atualizar memoria, timeline, documentacao e publicar Git.

## O que nao deve ser refeito

- Nao reabrir a pesquisa completa de stack mobile.
- Nao recriar plano de agentes.
- Nao redesenhar do zero a Home, Cofre, Player ou Configuracoes sem novo comentario visual do Roberto.
- Nao trocar a identidade visual aprovada por Tarcila.
- Nao mudar o escopo publico para gravacao oculta, P2P critico, streaming real ou acionamento oficial sem nova etapa juridica/seguranca.
- Nao configurar Google, iCloud ou contas logadas no navegador sem confirmacao de acao no momento exato.
- Nao instalar APK em aparelho fisico sem confirmacao de instalacao quando o dispositivo aparecer no ADB.

## Bloqueios conhecidos

- Se `adb devices -l` nao listar o Android, a instalacao fica bloqueada. A solucao e ajustar o aparelho/cabo/autorizacao RSA antes de tentar instalar.
- O build privado pode habilitar camera/microfone para homologacao; o build publico deve continuar bloqueando midia real ate RIPD/DPIA, termos, consentimento, retencao, chaves e revisao juridica.
- Login Google/iCloud deve entrar por OIDC/backend em etapa propria, sem credenciais locais e sem usar a conta logada do navegador como segredo do projeto.

## Criterio para passar para a proxima etapa

A etapa atual pode ser encerrada quando houver:

- gates leves aprovados;
- browser validado nas rotas afetadas;
- APK privado gerado;
- Android fisico instalado e validado ou bloqueio ADB documentado;
- memoria e timeline atualizadas;
- commit e push publicados.

Se o Android continuar indisponivel, registrar o bloqueio e seguir para a proxima etapa apenas como `pendente de validacao fisica`, sem declarar aprovacao final do APK.

## Fechamento executado em 2026-05-05

- Gates locais aprovados: `typecheck`, `lint`, `test`, `private:android:readiness` e `git diff --check`.
- Browser local validado em `http://localhost:8081/`, com Home exibindo `Policia`, `Bombeiros` e `SAMU`, sem `190` no rotulo de `Policia`.
- APK privado gerado: `android/app/build/outputs/apk/debug/app-debug.apk`.
- SHA-256: `daf5a22d163acc468a9470e1bd2178606f1b547c55bdf824a22eefe5d3f022d1`.
- Instalacao USB concluida no Android `23129RA5FL`: `adb install -r` retornou `Success`.
- Evidencia principal: `docs/evidencias/android/2026-05-05-apk-privado-final/home-apk-final-after-wake.png`.
- Evidencia de estado final inativo: `docs/evidencias/android/2026-05-05-apk-privado-final/estado-final-aparelho.png`.
- Proxima etapa: `API e Anjos`, detalhada em `docs/29_PROXIMA_ETAPA_API_ANJOS.md`.

## Fechamento de midia segura C2 em 2026-05-06

- Nao reabrir o modulo de midia criptografada sem nova regressao objetiva.
- Implementado `SecureVideoThumbnailStore`: thumbnail segura cifrada como `thumbnail.sseg` e exclusao da thumbnail clara temporaria.
- Implementado `CameraCaptureResidueCleaner`: limpeza restrita de residuos `.mp4` em `cache/Camera` apos preservacao verificada.
- `EncryptedVideoStore` agora verifica chave, manifesto, chunks, hashes agregados e thumbnail antes de apagar o MP4 claro temporario.
- Validacoes aprovadas: `npm run typecheck`, `npm test`, `npm run lint`, `npm run build:android:private`.
- APK privado C2: `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256 `024150800908109199f84e1be2ef5bd9c72ae1f6986ecee0a8269f2c44ca1323`.
- Android fisico `192.168.0.4:5555`: SOS iniciou, encerrou e preservou asset `7c967904-589c-452c-85fc-8203aee83be9` com `manifest.sseg`, 22 chunks e `thumbnail.sseg`.
- Inventario ADB absoluto confirmou `cache/Camera` vazio, `cache/VideoThumbnails` vazio e nenhum `.mp4` claro nesses caches apos preservacao.
- Evidencias: `docs/evidencias/android/2026-05-06-capture-cleanup-thumbnail/`.
- Reinstalacao final apos recompilacao nao foi repetida porque o ADB Wi-Fi saiu do ar; `adb connect 192.168.0.4:5555` retornou timeout. O APK recompilado manteve o mesmo SHA-256 ja validado.

### Proxima retomada recomendada

1. Entrar direto na etapa de envelopes/chaves/sessao remota para anjos autenticados via EC2/API.
2. Usar `docs/30_MIDIA_CRIPTOGRAFADA_CHUNKS.md` apenas como contrato da midia local ja concluida.
3. Usar `docs/31_ARQUITETURA_COMPARTILHAMENTO_TEMPO_REAL.md` e `docs/32_PLANO_LOGIN_VIDEOCHAMADA_ANJOS_LOCALIZACAO.md` para a proxima frente.
4. Nao repetir build Android ou QA do player, salvo se a proxima mudanca tocar em `src/features/emergency/*Video*`, `EvidencePlayerCard` ou captura SOS.

## Checkpoint de interrupcao - Frente 1.2 em 2026-05-10

Status: checkpoint salvo para retomada; nao declarar a Frente 1.2 como concluida ate nova instalacao e validacao fisica.

Pedido que motivou este checkpoint:

- Roberto confirmou que o encerramento ainda demorava no Android e no iPhone;
- Roberto confirmou que havia arquivos extras no Cofre e alguns sem midia;
- Roberto confirmou que o Player abria, mas a timeline nao acompanhava com fluidez nos segundos iniciais;
- Roberto pediu modal de encerramento com barra de progresso informando etapas como encerrando e criptografando;
- Roberto reforcou que a frente precisa considerar diversidade de cameras/hardware Android/iOS e preparar compatibilidade para chamada P2P futura com anjo usando o mesmo app.

Implementado neste checkpoint:

- `PanicButton` ganhou fallback por `onLongPress` nativo com guarda contra disparo duplo, mantendo a UX de pressao longa.
- Home/SOS ganhou `FinishProgressDialog` com barra de progresso, estados `running`, `done`, `warning` e `error`, acao `Abrir cofre` e bloqueio de novo SOS enquanto a midia ainda esta pendente.
- O encerramento deixou de aguardar a camera para manter o pacote ativo: sinaliza o recorder, remove o estado visual de chamado ativo, finaliza o pacote e deixa o recorder montado por `mediaRecorderPackageId` para anexar midia tardia.
- Diagnostico saneado de pacote sem midia passou a ser persistido no fechamento quando a camera nao devolve asset.
- Android tambem passou a gravar em segmentos curtos de 12s e bitrate conservador de 650 kbps, alinhado ao perfil de homologacao e reduzindo a janela maxima de espera do `recordAsync`.
- `EmergencyMediaRecorder` passou a registrar perfil de compatibilidade de captura por asset: plataforma, versao, camera solicitada/runtime/real, qualidade, bitrate, duracao do segmento, quantidade/amostra de tamanhos disponiveis, lentes, codecs iOS e metadados de compatibilidade P2P.
- `LocalMediaAsset`, manifesto e envelope cifrado agora aceitam `captureProfile`.
- `Cofre`/apresentacao agora diferencia pacote ainda `Processando` quando a midia esta pendente sem diagnostico.
- `EvidencePlayerCard` atualiza progresso por estado com intervalo menor, melhorando sincronismo da timeline nos primeiros segundos.
- `SecureJsonStore` ganhou busca direta por ID; `emergencyRecorder` deixou de varrer todos os pacotes para finalizar/anexar/diagnosticar um pacote especifico.
- `expo-video`/build Android privado passou a garantir suporte declarativo a picture-in-picture no `MainActivity` para reduzir erro nativo ruidoso do player.

Evidencia fisica antes da ultima correcao:

- APK anterior foi instalado no Android `5686add7` / `23129RA5FL`.
- O long press por ADB so disparou apos fallback; o modal apareceu, mas travou em `Encerrando gravacao` 24% e o topo ainda mostrava `CHAMADO ATIVO`.
- Logcat mostrou que a camera Android/CameraX so fechou muito depois e havia `Recorder: stop() called on a recording that is no longer active`.
- Esse teste confirmou a regressao relatada por Roberto: feedback visual melhorou, mas o fluxo ainda ficava preso quando o recorder demorava.
- A correcao posterior foi segmentar tambem Android em 12s/650 kbps e tirar imediatamente o chamado do estado visual ativo; essa correcao ainda precisa de instalacao e teste fisico.

Validacoes locais executadas apos a correcao de segmentacao:

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test -- --runInBand`: aprovado, incluindo `test:crypto` e `test:device-keys`.
- `git diff --check`: aprovado.
- Limpeza de regeneraveis executada com `./scripts/higienizar-reciclaveis-mobile.sh all --deep --xcode-derived-data --select all --apply`, recuperando cerca de 2,7 GiB reais.
- APK privado gerado em `distribution/android/out/sinalseguro-android.apk`, SHA-256 `d00beb8f7b551300a1f750ca059ad294f040947d796868176124eb44003df9f4`.

Pendencias obrigatorias da proxima retomada:

1. Rodar `df -h /`; se houver menos de 10 GiB livres, limpar regeneraveis antes de novo build/teste.
2. Instalar o APK SHA-256 `d00beb8f7b551300a1f750ca059ad294f040947d796868176124eb44003df9f4` ou rebuildar se houver nova mudanca.
3. No Android fisico, iniciar SOS, aguardar pelo menos 20s, encerrar por long press e capturar screenshots imediato, 2s, 8s e fim.
4. Aceite visual esperado: o topo sai de `CHAMADO ATIVO` logo apos o long press; modal mostra progresso; Cofre termina como protegido, processando ou sem midia com causa saneada.
5. Verificar com `run-as` que `cache/Camera` e `cache/VideoThumbnails` nao deixam `.mp4` claro permanente.
6. Abrir Player e validar timeline nos primeiros segundos e seek.
7. Repetir iPhone fisico quando houver janela de build/instalacao, porque Roberto confirmou que a demora tambem existia no iPhone.
8. Nao avancar interface final de chamada P2P/anjo nesta frente; manter apenas compatibilidade de captura/envelope e liberacao correta de camera/microfone para a frente de chamada.

## Checkpoint atualizado - Frente 1.2 em 2026-05-10

Status: checkpoint salvo apos implementacao nativa e teste Android curto. Nao declarar a frente concluida.

O que ja foi feito nesta retomada:

- `SinalSeguroMediaEngine` virou rota principal para ativo novo `native_segmented_v1`;
- Android nativo cifra por AES-256-GCM em blocos e calcula hashes incrementalmente;
- JS/Base64/loopback permanece somente como fallback para ativo legado `js_chunked_v1`;
- `FinishProgressDialog` e o cofre trabalham com estados explicitos de processamento;
- Player Seguro prepara fonte MP4 temporaria em cache privado/no-backup antes de tocar, com barra de preparo e limpeza ao fechar, trocar, background, TTL e boot;
- Home e Arquivos executam limpeza de residuos nativos na entrada;
- evidencias PNG/XML/logcat detalhado foram removidas; a evidencia versionavel e apenas o inventario saneado.

Validacoes ja executadas nesta retomada:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run test:crypto`: aprovado;
- `npm run test:device-keys`: aprovado;
- `npm run private:android:readiness`: aprovado com pendencia ambiental conhecida de Node local;
- `npm run build:android:private`: aprovado;
- `git diff --check`: aprovado.

APK Android desta retomada:

- caminho local: `android/app/build/outputs/apk/debug/app-debug.apk`;
- SHA-256: `5e664df9a9982569a0ce05e737af01fcc105057d892438e10ffbe07ac1f28afd`;
- instalado no Android fisico `23129RA5FL` via USB.

Evidencia Android curta:

- ao encerrar SOS curto, a UI saiu de `CHAMADO ATIVO` em ate 0,5s;
- o cofre recebeu midia protegida;
- o player abriu fonte preparada e a timeline funcionou;
- apos fechamento real do player, inventario de midia clara persistente voltou a 0;
- relaunch com MP4 temporario artificial no cache nativo limpou o arquivo apos estabilizacao do app.

Proxima retomada obrigatoria:

1. Rodar `git status --short --branch` e preservar `docs/29_PROXIMA_ETAPA_API_ANJOS 2.md` se ainda estiver untracked.
2. Rodar `df -h /`; com 12 GiB livres ha margem para Android, mas iOS deve esperar 14 GiB+.
3. Repetir Android fisico em 60s, 3min e 5min, com inventario `run-as`, logcat saneado, cofre/player e tempo ate primeiro frame.
4. Repetir iPhone fisico antes de declarar a Frente 1.2 aprovada, com atencao a memoria, tempo de encerramento, residuos claros e liberacao de camera/microfone.
5. Revisar ATS/iOS gerado antes de release se `NSAllowsArbitraryLoads=true` aparecer no `Info.plist`.
6. So depois desses gates avaliar a proxima frente dependente; ainda nao implementar UI final de chamada P2P/anjo, upload, localizacao ou conveniados.

## Checkpoint Android validado - Frente 1.2 em 2026-05-11

Status: Android fisico passou na matriz desta rodada; Frente 1.2 permanece aberta ate iPhone fisico repetir os gates.

Implementado apos o checkpoint nativo:

- Android parou de usar `maxDuration` automatico no `recordAsync`; o stop passou a ser explicito para evitar `ERROR_DURATION_LIMIT_REACHED` sem URI e pacotes sem midia.
- `SinalSeguroMediaEngine` Android prepara a fonte de playback com descriptografia em blocos, sem `CipherInputStream`, mantendo MP4 temporario somente em cache privado/no-backup.
- `EvidencePlayerCard` ganhou normalizacao de offset inicial da timeline e wrappers seguros para chamadas do `expo-video` ao fechar/trocar player.
- `scripts/smoke-test.mjs` bloqueia regressao desses contratos.

Evidencia Android fisica:

- Dispositivo: Android fisico `23129RA5FL` via USB.
- APK final instalado: `android/app/build/outputs/apk/debug/app-debug.apk`.
- SHA-256 final: `b4c8eb4aad7fb7c886bf5f726f179be633e03751a5eb9ae9b79c3ee061ada0f3`.
- SOS 60s, 3min e ciclo longo executados; ao encerrar, a UI saiu de `CHAMADO ATIVO` em ate 0,5s.
- Ciclo longo exibiu progresso de criptografia e terminou como `Video protegido`.
- Player abriu fonte preparada, exibiu primeiro frame e manteve timeline coerente nos primeiros segundos.
- Fechamento do player durante reproducao manteve o app vivo; log final nao mostrou crash do processo SinalSeguro nem erro de shared object liberado.
- Inventario final saneado: 399 arquivos no sandbox, 0 midias claras persistentes, 17 `.nseg` e 375 `.sseg`.
- `gfxinfo` do ciclo longo: 45992 frames, 239 janky frames (0,52%), p50 20ms, p90 29ms, p95 32ms, p99 38ms.

Validacoes finais:

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: aprovado com pendencia ambiental conhecida de Node local 20.16.0 para release publico.
- `git diff --check`: aprovado.

Retomada obrigatoria a partir daqui:

1. Preservar `docs/29_PROXIMA_ETAPA_API_ANJOS 2.md` se ainda estiver untracked.
2. Antes de nova build, limpar regeneraveis: `/` ficou abaixo do gate de 10 GiB apos o build Android.
3. Repetir matriz no iPhone fisico: 30s, 60s, 3min e 5min, com screenshots, log saneado, inventario de residuos claros, tempo de encerramento, player e camera/microfone liberados.
4. Nao declarar a Frente 1.2 concluida nem iniciar Frente 2/3/4/5 ate o iPhone fisico passar.

## Checkpoint CLI apos emergencia operacional - Frente 1.2 em 2026-05-11

Status: acesso pelo CLI normal; problema de leitura da raiz iCloud ficou restrito ao Codex GUI nesta ocorrencia. Este checkpoint e somente de preservacao documental.

Validacao de acesso executada:

- `pwd` resolveu para `/Users/roberto/Desenvolvimento/SinalSeguro`, caminho real/symlink do projeto solicitado.
- `ls ./` enumerou a raiz com `AGENTS.md`, `apps`, `docs`, `repos`, `services`, `infra` e demais diretorios esperados.
- `AGENTS.md`, `apps/mobile/package.json` e este handoff estavam acessiveis.
- `git -C apps/mobile status --short --branch` confirmou `main...origin/main` com alteracoes e untracked ja existentes; nada foi revertido.

Preservacao obrigatoria:

- Backup de resgate fora do iCloud: `/Users/roberto/SinalSeguro-resgate-20260511-132114`.
- Preservar os untracked citados no handoff, inclusive `docs/29_PROXIMA_ETAPA_API_ANJOS 2.md`, evidencias Android/iOS, `metro.config.js` e `scripts/expo-no-workspace-root.cjs`.
- Nao usar `git reset`, `git checkout --`, limpeza destrutiva ou remocao de untracked.
- Nao gravar segredos, UDID, token, caminho sensivel de container, chave, nonce, tag, hash bruto, IP, e-mail, coordenada ou payload em memoria.

Estado tecnico preservado:

- `SinalSeguroMediaEngine` continua como rota principal de preservacao nativa; JS/Base64/loopback ficam como fallback legado/homologacao.
- Android build/debug OK, APK preservado em `docs/evidencias/android/2026-05-11-frente-1-2-native/app-debug-85f52968.apk`, SHA-256 `85f52968ac464aca4b4b0fc868abf6bc81a1cfa015a26e62f5f19200262bf599`.
- Android fisico desta rodada ainda nao foi validado porque nao havia device ADB conectado na emergencia operacional.
- iPhone fisico validou dois ciclos curtos com H.264 480p/650 kbps, preservacao `native_segmented_v1`, sucesso de preservacao nativa, origem apagada e asset anexado.
- Inventario iOS de residuos claros ficou limpo e syslog indicou camera/microfone frios apos os ciclos.
- Modal final iOS mostrou `Video protegido` em 100%, mas a captura apos `Abrir cofre` permaneceu no modal final.

Pendencias de retomada:

1. Resolver permissao/estado do Codex GUI ou operar pelo CLI.
2. Repetir teste iPhone de encerramento antecipado enquanto a camera ainda grava.
3. Capturar Cofre visual pos-toque e validar Player.
4. Reconectar Android ADB e rodar validacao fisica.
5. Depois disso, considerar gates longos 60s, 3min e 5min.

Regra de bloqueio:

- A Frente 1.2 nao esta concluida; nao avancar P2P/anjo, upload, localizacao, conveniados nem Frente 2/3/4/5.

## Checkpoint GUI - Frente 1.2 em 2026-05-11 18:44 -03

Status: execucao retomada no Codex GUI; continuar sem declarar fechamento da frente.

O que ja foi validado nesta retomada:

- `npm run typecheck`, `npm run lint`, `npm test`, `npm run private:android:readiness` e `git diff --check` passaram antes do ajuste final de UX.
- Android Kotlin `:app:compileDebugKotlin` e `:app:assembleDebug` passaram; APK foi preservado em `/private/tmp`, mas ficou desatualizado depois dos ajustes seguintes.
- iOS Release passou com `BUILD SUCCEEDED`; o bundle gerado tambem ficou desatualizado porque os textos do player/cofre foram corrigidos apos o inicio do build.
- Android ADB nao listou aparelho conectado nesta retomada; instalacao fisica Android segue bloqueada ate o device aparecer no `adb`.
- iPhone `R1_iPh` segue visivel para instalacao e validacao fisica depois de rebuild iOS.

Ajustes aplicados apos o ultimo build:

- Player/cofre passaram a apresentar pacotes nativos segmentados da mesma camera como `1 video protegido` e `Arquivo protegido unificado`, evitando comunicar ao usuario que o playback ocorre em blocos.
- O fluxo nativo continua preparando uma unica fonte MP4 temporaria para playback unificado; `.nseg` nao e enviado diretamente ao player.

Proximo bloco imediato:

1. Implementar recuperacao de residuo de camera no cold start antes de registrar pacote interrompido como `sem midia`.
2. Nao apagar residuo recuperavel no `RootLayout` antes da Home tentar adotar e cifrar esse arquivo.
3. Rodar validacoes locais novamente.
4. Rebuild Android/iOS porque os artefatos atuais ficaram obsoletos.
5. Instalar e validar primeiro no iPhone conectado; Android fica pendente ate ADB voltar a listar o aparelho.

## Decisao de retomada - 2026-05-13 - MVP Android primeiro

Status: Roberto interrompeu a tentativa de destravar iPhone/iOS nesta etapa. O iOS nao deve mais bloquear a conclusao do MVP.

Novo foco:

- finalizar a Frente 1.2 e o MVP com base no Android;
- mover iPhone/iOS para uma frente pos-MVP propria;
- nao gastar novas janelas de execucao com CoreDevice, `devicectl`, Appium/WDA, build iOS, instalacao iOS ou validacao fisica iPhone ate a entrega Android estar encaminhada.

Evidencia do entrave:

- cofre no iPhone passou a mostrar o arquivo de 1min38 como `1 video`, sem fragmentar para o usuario;
- player unificado abriu o pacote como item unico, mas falhou com `Video indisponivel`;
- log operacional saneado registrou `native_playback_source_uri_rebased` e `playback_prepare_error` com `assetCount: 8`;
- Xcode 26.5 continuou marcando destinos iOS como inelegiveis por plataforma 26.5 mesmo com SDK listado;
- tentativa de baixar plataforma iOS foi interrompida por custo operacional/tempo/espaco.

Proxima retomada obrigatoria:

1. Tratar Android como caminho de aceite do MVP.
2. Regenerar `android/` quando necessario, porque a pasta e ignorada e foi limpa como regeneravel.
3. Rebuildar APK privado Android.
4. Instalar no Android fisico.
5. Rodar smoke fisico Android de SOS, encerramento, cofre, player, camera/microfone liberados e inventario saneado.
6. Se passar, documentar a Frente 1.2 como suficiente para liberar as proximas frentes do MVP Android.
7. Manter iOS apenas como backlog pos-MVP registrado em `docs/34_DECISAO_MVP_ANDROID_IOS_POS_MVP_2026-05-13.md`.

## Checkpoint Android - 2026-05-13 - Frente 1.2 pronta para teste manual de Roberto

Status: Android privado passou na validacao fisica proporcional desta rodada. Nao repetir Antigravity/rebuild desde zero sem evidencia nova de regressao.

Estado tecnico atual:

- caminho principal de midia nova: `SinalSeguroMediaEngine` + `native_segmented_v1`;
- Android cifra e preserva por AES-256-GCM em blocos, com `.nseg` no sandbox privado;
- JS/Base64/loopback continuam apenas como fallback legado/homologacao;
- player seguro prepara fonte unica para o usuario e nao mostra fragmentos como varios videos;
- origem nativa Android agora esta restrita a `filesDir`, `cacheDir` e `noBackupFilesDir`;
- `externalCacheDir` e `getExternalFilesDir` nao devem voltar como origem aceita.

Artefato validado:

- `android/app/build/outputs/apk/debug/app-debug.apk`;
- SHA-256 `50fe4c831174899e5728579709ec906470c6c55d4aad1f205c162da1be0444db`;
- device `23129RA5FL`, Android 15 / SDK 35;
- instalacao por USB retornou `Success`.

Gates aprovados nesta retomada:

- `npm run typecheck`;
- `npm run lint`;
- `npm test`;
- `npm run private:android:readiness`;
- `npm run build:android:private`;
- `git diff --check`;
- SOS fisico Android com cofre/player/inventario saneado.

Evidencia fisica:

- primeiro ciclo: `Video 1min 48s`, `1 video`, player unificado reproduzindo ate pelo menos `0:23 / 1:46`;
- ciclos curtos pos-rebuild: reentrada de camera/microfone, novo `Video protegido` 100%, `Continuar` retornando para Home, cofre com `Video 31s`/`1 video` e player final reproduzindo `0:01 / 0:29`;
- `dumpsys media.camera`: camera conectou/desconectou no pacote SinalSeguro e o dump final ficou sem cliente ativo;
- inventario saneado final pos-rebuild: 418 arquivos, 375 `.sseg`, 22 `.nseg`, 0 midias claras persistentes `.mp4/.mov/.m4v/.3gp/.avi/.webm`.

Proxima acao:

1. Roberto executar teste manual supervisionado no Android instalado.
2. Se Roberto aprovar, fechar a Frente 1.2 como base Android do MVP.
3. Abrir a proxima frente Android do MVP sem reabrir iOS.

## Pausa operacional - 2026-05-13 - limpeza Android antes de demanda paralela de portal

Roberto solicitou pausa antes de continuar o Android para atuar em demanda paralela do portal web no segmento governo/business. Esta demanda de portal esta fora do escopo deste checkpoint e nao foi executada aqui.

Higienizacao aplicada:

- comando: `./scripts/higienizar-reciclaveis-android.sh --select all --apply`;
- removidos: `.expo`, `android/.gradle`, `android/app/.cxx`, `android/app/build`, `android/build`;
- relatorio: 5 itens removidos, 0 falhas, 3.1 GiB estimados, 2.5 GiB reais de variacao livre;
- SSD interno: 4.1 GiB livres antes, 6.6 GiB livres depois no relatorio do script, 6.3 GiB na conferencia final posterior;
- dry-run posterior: nenhum reciclavel Android encontrado.

Estado de retomada:

- Android permanece aprovado tecnicamente para teste manual de Roberto;
- app validado segue instalado no Android fisico;
- APK local foi removido como build regeneravel;
- se a retomada exigir reinstalacao, executar novo build privado Android;
- iPhone/iOS segue pos-MVP.

## Fechamento - 2026-05-13 - Roberto aprovou Frente 1.2 Android

Roberto validou as atualizacoes da Frente 1.2 no app Android e aprovou a frente.

Estado:

- Frente 1.2 fechada no escopo Android do MVP;
- iPhone/iOS segue pos-MVP;
- nao pular direto para P2P/anjos/conveniados sem fechar papeis e autorizacoes.

Proximo passo recomendado:

1. Abrir Frente 1.3 - perfis, familia, maioridade e papeis.
2. Depois abrir Frente 2 - rede de anjos e convites.
3. Depois evoluir emergencia remota, chamada audio/video, localizacao ao vivo e conveniados.
