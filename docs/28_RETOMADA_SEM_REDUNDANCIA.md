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
