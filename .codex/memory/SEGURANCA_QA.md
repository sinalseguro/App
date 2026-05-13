# Memoria - Schneier, Doneda e Myers

Data: 2026-05-03  
Papel: seguranca, LGPD e QA.

## Decisoes bloqueantes

- Build publico nao pode solicitar `CAMERA` nem `RECORD_AUDIO`.
- Build privado de homologacao local pode gravar video/audio no sandbox do app com consentimento e permissao do sistema.
- Streaming, upload real e compartilhamento externo ficam bloqueados ate homologacao controlada.
- Homologacao exige RIPD/DPIA, termos, consentimento versionado, retencao, auditoria, criptografia e criterio de loja.
- Alertas criticos devem ser modais internos para consistencia visual e testabilidade.
- Compartilhamento externo de evidencia segue bloqueado.
- Logs nao podem conter dados sensiveis, coordenadas completas, tokens, payloads ou midia.

## Gates atuais

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run build:android:private`: aprovado.
- Browser Use validou Home, drawer, Cofre, Player e Funcionamento.
- `private:android:readiness`: aprovado com pendencia ambiental aceita de Node local.
- `release:android:readiness`: bloqueado corretamente enquanto o workspace contem instrumentacao privada de midia.
- Cofre passou a respeitar o mesmo protocolo de encerramento seguro da Home: confirmacao e codigo local opcional.
- Matriz de permissoes documenta que camera/microfone entram apenas no APK privado; overlay, storage legado e backup Android seguem bloqueados.

## Pendencia QA

- Android fisico passou na matriz da Frente 1.2 em 2026-05-11.
- Gate QA bloqueante atual: repetir iPhone fisico antes de declarar a Frente 1.2 concluida.

## QA/Security - 2026-05-13 - decisao Android primeiro

- Roberto redefiniu o gate de continuidade do MVP: iPhone/iOS fica pos-MVP e nao deve mais bloquear as proximas frentes Android.
- A Frente 1.2 nao deve ser declarada como suporte iOS concluido; deve ser documentada como MVP Android.
- Evidencia iOS preservada: cofre unificou o pacote de 1min38 em `1 video`, mas o player nativo unificado falhou com `playback_prepare_error` para 8 segmentos.
- Risco aceito para esta fase: sem suporte iOS homologado no MVP inicial.
- Risco nao aceito: deixar Android avancar sem nova rodada fisica proporcional apos as ultimas alteracoes e limpeza de regeneraveis.
- Gate QA da Frente 1.2 Android para liberar proximas frentes do MVP: fechado apos rebuild privado, instalacao fisica, SOS/cofre/player validados, camera/microfone liberados, inventario saneado sem midia clara persistente e aprovacao manual de Roberto.
- Logs e evidencias continuam proibidos de conter URI, caminho sensivel, token, chave, nonce/tag/hash bruto, email, IP, coordenada, payload ou midia.

## QA/Security - 2026-05-13 - Android aprovado para teste manual

- APK validado: `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256 `50fe4c831174899e5728579709ec906470c6c55d4aad1f205c162da1be0444db`.
- Instalação fisica no Android `23129RA5FL`: `Success`.
- Gates locais aprovados: `typecheck`, `lint`, `test`, `private:android:readiness`, `build:android:private` e `git diff --check`.
- Primeiro ciclo fisico: `Video protegido` 100%, cofre com `Video 1min 48s`, `1 video`, player seguro reproduzindo arquivo unificado.
- Ciclos curtos pos-rebuild: camera/microfone reutilizados, novo `Video protegido` 100%, `Continuar` fechando o modal para Home, cofre com `Video 31s`/`1 video` e player final iniciando reproducao.
- Logcat analisado sem FATAL EXCEPTION, ANR ou crash nativo SinalSeguro no recorte; log bruto ficou fora do Git.
- `dumpsys media.camera` final: sem cliente ativo de camera.
- Inventario saneado pos-rebuild: 418 arquivos, 375 `.sseg`, 22 `.nseg`, 0 midias claras persistentes `.mp4/.mov/.m4v/.3gp/.avi/.webm`.
- UX/IX: fluxo esta legivel para teste manual, com acao longa clara, modal de progresso compreensivel, cofre em `1 video` e player unificado sem fragmentar a experiencia do usuario leigo.
- Gate manual: fechado por Roberto em 2026-05-13; a Frente 1.2 Android pode liberar a proxima frente do MVP.

## QA/Security - 2026-05-13 - pausa com limpeza de reciclaveis Android

- Pausa solicitada por Roberto para demanda paralela de portal web governo/business; esta frente nao deve executar alteracao de portal.
- Limpeza aplicada somente em reciclaveis Android via script versionado; 5 itens removidos, 0 falhas, variacao real de 2.5 GiB.
- Itens removidos: `.expo`, `android/.gradle`, `android/app/.cxx`, `android/app/build`, `android/build`.
- Pos-limpeza: dry-run sem reciclaveis Android; script reportou 6.6 GiB livres e conferencia final posterior indicou 6.3 GiB livres.
- Risco controlado: APK local removido como build regeneravel; checksum, evidencias e estado instalado no Android foram preservados em documentacao.
- Retomada segura: teste manual no Android ja instalado ou rebuild privado se for necessario reinstalar.

## QA/Security - 2026-05-13 - aceite manual Roberto

- Roberto aprovou manualmente a Frente 1.2 no Android.
- Gate QA restante da Frente 1.2 Android foi fechado; nao declarar suporte iOS aprovado.
- Proxima frente deve comecar por papeis, familia, maioridade, consentimento e autorizacao antes de qualquer anjo/P2P real.

## QA/Security - 2026-05-11 - Frente 1.2 Android validado

- Android fisico `23129RA5FL` passou na matriz desta rodada com APK SHA-256 `b4c8eb4aad7fb7c886bf5f726f179be633e03751a5eb9ae9b79c3ee061ada0f3`.
- SOS 60s, 3min e ciclo longo confirmaram saida visual de `CHAMADO ATIVO` em ate 0,5s, camera fechada pelo CameraX e cofre final como `Video protegido`.
- Inventario final do sandbox: 399 arquivos, 0 midias claras persistentes, 17 `.nseg` e 375 `.sseg`.
- Player final: preparo antes do play, timeline coerente nos primeiros segundos, fechamento durante reproducao sem crash do processo SinalSeguro e sem erro `Cannot use shared object`.
- MP4 temporario de playback segue aceito apenas em cache privado/no-backup, durante janela ativa do player, com limpeza no fechamento/troca/background/TTL/entrada do app.
- Logs/evidencias detalhadas ficaram fora do Git; resumo versionado nao preserva URI, caminho sensivel, chave, nonce/tag/hash bruto, token, IP, e-mail, coordenada, payload ou midia.
- Frente 1.2 ainda nao esta aprovada globalmente: iPhone fisico precisa repetir a matriz antes de avancar P2P/anjo/upload/localizacao/conveniados.

## QA/Security - 2026-05-04

- Fechamento por toque fora foi liberado para drawer e modais, sem substituir confirmacao propria de exclusao ou encerramento de chamado.
- Cofre em grade mantem compartilhamento externo bloqueado e apenas prepara rota interna futura autenticada.
- Configuracoes sem banner reduz exposicao de status tecnico na primeira camada da UI.
- Proxima validacao obrigatoria: instalar APK privado atualizado no Android e validar manualmente SOS, gravacao local, permissao de camera/microfone, cofre, player e exclusao.

## QA/Security - 2026-05-05 - pausa segura

- Pausa solicitada antes de nova compilacao para liberar disco.
- Nao executar testes pesados, build privado ou instalacao Android durante esta pausa.
- Antes de publicar um novo APK apos a retomada, bloquear se houver:
  - leitura integral de video grande em memoria para hash;
  - texto tecnico exposto em modais de usuario;
  - player simulando reproducao quando nao existe video;
  - compartilhamento externo sem backend, contrato, RBAC, auditoria e criptografia por envelope;
  - permissao de camera/microfone fora do build privado/homologado.
- Validacoes pendentes na retomada: browser em `localhost:8081`, `npm run typecheck`, `npm run lint`, `npm test`, build privado pelo script e instalacao no Android conectado.

## QA/Security - 2026-05-05 - ajustes finais no browser

- `Policia`, `Bombeiros` e `SAMU` ficam ativos por padrao na Home; os numeros `190`, `193` e `192` ficam preservados na confirmacao antes de abrir `tel:`.
- Atalho de Anjo e permissao para Anjo acionar 190 ficam desativados/preparatorios ate aceite real, backend, contrato, termos, auditoria e RBAC.
- Cofre e Player exibem duracao/tempo de gravacao do arquivo sem expor URI local, hash de midia ou coordenadas completas na grade.
- Modal de mapa avisa que abrir Maps/Google Maps envia a localizacao exata ao app externo escolhido; links mantem suporte Apple Maps, Google Maps e `geo:`.
- Gates aprovados nesta rodada: `typecheck`, `lint`, `test`, `private:android:readiness` e `git diff --check`.
- APK privado final gerado com SHA-256 `daf5a22d163acc468a9470e1bd2178606f1b547c55bdf824a22eefe5d3f022d1` e instalado por USB no Android `23129RA5FL` com `adb install -r`: `Success`.
- Evidencias finais salvas em `docs/evidencias/android/2026-05-05-apk-privado-final/`, incluindo Home instalada e logcat de pos-instalacao.

## QA/Security - 2026-05-05 - midia criptografada por chunks

- Bloqueio corrigido: videos novos nao devem ficar como MP4 claro persistente no sandbox do app.
- `EncryptedVideoStore` cifra chunks individualmente e apaga o temporario da camera apos preservacao.
- `VideoCryptoService` usa AEAD autenticado por chunk e chave simetrica unica por video.
- Manifesto tambem e cifrado/autenticado e contem hashes, nonces, tags, offsets e metadados necessarios para auditoria local.
- `EncryptedVideoDataSource` cobre leitura parcial, seek e replay sem arquivo descriptografado completo.
- Player URI atual fica impedido de abrir ciphertext; liberar reproducao segura so depois de adaptador local de range.
- Testes aprovados: chunk valido, range parcial, seek, replay, chunk corrompido e chave invalida.
- Validacoes aprovadas: `npm run typecheck`, `npm run lint`, `npm test`.

## QA/Security - 2026-05-05 - arquitetura EC2/P2P/conveniados

- EC2 entra como coordenadora de login, dispositivos, diretorio de chaves publicas, envelopes de chave, sinalizacao P2P e auditoria.
- Video, audio e localizacao em tempo real continuam bloqueados ate existir login, aceite do anjo, chave publica valida e canal criptografado.
- P2P deve ser criptografado ponta a ponta; servidor nao deve receber midia/localizacao em claro.
- Compartilhamento ao vivo so pode existir durante emergencia ativa.
- Conveniados ficam fora do fluxo de anjos ate contrato, RBAC, MFA, retencao, auditoria e RIPD/DPIA.
- Validacoes aprovadas: `npm run typecheck`, `npm test`.

## QA/Security - 2026-05-10 - Frente 1.2 checkpoint interrompido

- A frente nao esta aprovada para seguir para proxima etapa enquanto o APK mais recente nao for instalado e validado fisicamente em Android e iPhone.
- Evidencia Android anterior ao ultimo patch: modal de encerramento travou em 24%, topo continuou `CHAMADO ATIVO` e CameraX fechou tarde; isso confirmou a observacao de Roberto.
- Correcao posterior: saida visual imediata do chamado ativo, recorder mantido em paralelo para anexo tardio, bloqueio de novo SOS enquanto midia segue pendente e segmentacao Android curta.
- Logs/diagnosticos de midia devem continuar saneados: sem URI, caminho local sensivel, token, chave, e-mail, IP, coordenada, payload ou midia.
- `captureProfile` pode registrar capacidades tecnicas de camera/hardware e flags preparatorias de P2P; nao deve registrar localizacao nem dados pessoais.
- Teste fisico obrigatorio: screenshots imediato/2s/8s/fim, logcat filtrado do processo, inventario `run-as` para ausencia de `.mp4` claro permanente em caches, cofre/player e timeline nos primeiros segundos.
- Estados aceitaveis no cofre apos encerramento: protegido, processando, sem midia com causa saneada, falha de preservacao ou limpeza pendente.
- Compartilhamento, upload, chamada WebRTC real e anjos seguem bloqueados; esta frente so prepara compatibilidade de envelope/camera/microfone.
- Gates locais ja aprovados apos patch: `npm run typecheck`, `npm run lint`, `npm test -- --runInBand`, `git diff --check`.

## QA/Security - 2026-05-10 - Frente 1.2 checkpoint nativo salvo

- Frente 1.2 continua em homologacao privada; nao declarar concluida ate matriz Android 60s/3min/5min e iPhone fisico passarem.
- Evidencias PNG/XML e logcat detalhado da rodada Android foram removidos por conterem tela/ambiente/risco de identificacao; somente o inventario saneado deve ser versionado.
- Android fisico `23129RA5FL` validou o fluxo curto com APK final: saida visual de `CHAMADO ATIVO` em ate 0,5s, cofre protegido, player com preparo de fonte e timeline funcional.
- Durante playback pode existir 1 MP4 temporario em cache privado/no-backup; a politica aceita isso apenas enquanto o player esta ativo, com limpeza no fechamento/troca/background/TTL e na entrada do app.
- Inventario final Android confirmou 0 `.mp4/.mov/.3gp/.m4a/.wav/.webm` persistentes em cache/files apos fechamento real do player.
- Teste de relaunch com MP4 temporario artificial confirmou limpeza apos estabilizacao do app; registrar que nao e uma promessa sincronica no primeiro frame da inicializacao.
- Logs e diagnosticos seguem proibidos de conter URI, caminho sensivel, token, chave, nonce/tag/hash bruto, email, IP, coordenada, payload ou midia.
- `captureProfile` e permitido apenas como metadado tecnico de camera/hardware; nao incluir localizacao nem dado pessoal.
- Risco aberto: template iOS ainda usa leitura integral e precisa validacao fisica/memoria antes de aprovar midia longa.
- Risco aberto antes de release: revisar ATS/iOS gerado se `NSAllowsArbitraryLoads=true` aparecer no `Info.plist`.
- Gates aprovados nesta rodada: `typecheck`, `lint`, `test`, `test:crypto`, `test:device-keys`, `private:android:readiness`, `build:android:private` e `git diff --check`.

## QA/Security - 2026-05-13 - Frente 1.3 abertura

- Novo gate local: menor protegido nao cria convite e nao aceita atuar como anjo.
- Perfil ausente bloqueia criacao/aceite ate a usuaria configurar o papel local.
- Responsavel sem menor vinculado fica em estado conservador para convite.
- A primeira fatia nao coleta documento, data de nascimento completa, endereco, agenda, telefone de terceiros, relato sensivel, localizacao continua ou midia enviada.
- Compartilhamento real, P2P, upload, localizacao ao vivo e conveniados continuam bloqueados.
- Gates aprovados na abertura: `npm run test:profiles`, `npm run typecheck`, `npm run lint`, `node scripts/smoke-test.mjs`, `npm test`, `npm run private:android:readiness` condicionado e `git diff --check`.
- Para fechar a frente ainda faltam backend server-side de papeis/autorizacoes, validacao visual/manual e aceite de Roberto.

## QA/Security - 2026-05-13 - Frente 1.3 backend

- Perfil ausente/`unknown` bloqueia convite e aceite sensivel no backend.
- Menor protegido nao cria convite e nao aceita atuar como anjo.
- Responsavel por menor exige protegido ativo, vinculo ativo e autorizacao ativa para criar rede do menor.
- `can_receive_media=True` e `can_receive_location=True` sao rejeitados no backend nesta frente.
- `ConsentRecord.evidence` rejeita chaves sensiveis como CPF, documento, nascimento, endereco, localizacao, midia e relato.
- `KeyEnvelopeSerializer` e `P2PSignalSerializer` bloqueiam criacao ate frente propria de autorizacao/midia/P2P.
- Backup logico criado antes do deploy na EC2 e migrations aplicadas com readiness publico `database=ok`.
- Testes Django cobrem perfil ausente, menor criando/aceitando, responsavel sem autorizacao, autorizacao ativa, consentimento sensivel, key envelope e P2P bloqueados.
