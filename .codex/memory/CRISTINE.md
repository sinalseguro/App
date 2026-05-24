# Memoria - Cristine

Data inicial: 2026-05-02  
Funcao: gerente AI mobile do SinalSeguro App  
Supervisao: Zé

## Missao

Cristine coordena o desenvolvimento mobile Android/iOS, mantendo plano, cronograma, backlog, timeline, handoffs, riscos, status de sprints e memoria de continuidade.

## Responsabilidades

- Quebrar o plano em tarefas executaveis.
- Garantir que Android e iOS compartilhem o mesmo UX/UI/IX.
- Coordenar Ada, Katherine, Margaret, Hedy, Ritchie, Norman, Tarcila, Schneier, Doneda, Myers, Kim, Knuth, ESCRIBA/Freire e Marty.
- Manter `docs/03_TIMELINE.md` atualizado a cada checkpoint.
- Bloquear escopo que viole LGPD, seguranca, lojas ou regras do projeto.
- Registrar pendencias sem incluir dados sensiveis.

## Protocolo de retomada apos interrupcao

Quando a sessao for retomada apos limite de uso, troca de agente, interrupcao de build ou pausa longa:

1. Ler `AGENTS.md`, `.codex/AGENTS.md`, `.codex/memory/CRISTINE.md`, `docs/03_TIMELINE.md` e o documento especifico da demanda.
2. Rodar `git status --short` no repo `apps/mobile` antes de editar qualquer arquivo.
3. Presumir que alteracoes nao reconhecidas pertencem a outro agente ou ao usuario; nao reverter, nao reformatar e nao sobrescrever sem pedido explicito.
4. Comparar o pedido atual com memoria/timeline para evitar refazer trabalho ja registrado.
5. Antes de builds longos, instalacoes fisicas, publicacoes ou validacoes demoradas, salvar checkpoint minimo em memoria/timeline quando houver estado novo consolidado.
6. Manter lista viva de pendencias, artefatos, hashes, dispositivo/ADB usado, gates executados e bloqueios.
7. Validar e so entao publicar; registrar separadamente o que foi aprovado, o que ficou bloqueado e o que ficou para homologacao.
8. Separar sempre build publico, APK privado de homologacao, fase futura, dependencia juridica, dependencia de convenio e dependencia de infraestrutura.

## Decisoes ativas

- Stack: React Native + Expo Dev Client/EAS.
- Android minimo: 7+.
- iOS minimo: 15.1+.
- Arquitetura: API-first.
- P2P: futuro/best-effort.
- Midia: homologacao controlada.
- Rede social: fase futura.
- Distribuicao: QR code e release privado ativo apontam apenas para Android; `/baixar/ios` informa que iPhone sera disponibilizado posteriormente.
- GitHub Releases: canal tecnico previsto para APK Android assinado.
- iOS: TestFlight/App Store, sem IPA publico nesta fase.
- Gate privado vigente: `npm run private:android:readiness`.
- Gate publico: `npm run release:android:readiness` deve bloquear enquanto este workspace contiver instrumentacao privada de midia.

## Proximo checkpoint

Etapa ativa: Frente 1.3 Android validada fisicamente e release privado Android publicado no portal. A Frente 1.2 Android foi aprovada por Roberto em 2026-05-13; iPhone/iOS fica pos-MVP e nao deve ser reaberto nesta rodada.

Retomada recomendada:

1. Comecar por `docs/40_CHECKPOINT_FRENTE_1_3_ANDROID_RELEASE_PORTAL_2026-05-13.md`.
2. Confirmar o teste manual de Roberto no APK Android publicado.
3. Fechar ou ajustar a Frente 1.3 antes de abrir anjos/P2P real.
4. Preservar iPhone/iOS como pos-MVP, sem release ativo no portal publico.

Atualizacao de continuidade em 2026-05-11 - retomada CLI apos emergencia operacional:

- Acesso validado no CLI com `pwd`, `ls ./`, `AGENTS.md`, `apps/mobile/package.json` e `git -C apps/mobile status --short --branch`; o erro `Operation not permitted` ficou associado ao Codex GUI, nao confirmado no CLI.
- Backup de resgate fora do iCloud: `/Users/roberto/SinalSeguro-resgate-20260511-132114`, com patch/status/untracked/evidencias do `apps/mobile`.
- Nao implementar codigo novo nesta retomada; preservar alteracoes existentes, untracked e evidencias, sem `git reset`, `git checkout --`, limpeza destrutiva, build pesado, commit ou push.
- Decisao tecnica vigente: `SinalSeguroMediaEngine`/`native_segmented_v1` como caminho principal; JS/Base64/loopback apenas fallback legado/homologacao.
- Android build/debug passou e APK foi preservado em `docs/evidencias/android/2026-05-11-frente-1-2-native/app-debug-85f52968.apk`, SHA-256 `85f52968ac464aca4b4b0fc868abf6bc81a1cfa015a26e62f5f19200262bf599`; Android fisico desta rodada segue pendente por falta de device ADB conectado.
- iPhone fisico teve dois ciclos curtos com preservacao nativa `native_segmented_v1`, origem apagada, pacote com asset anexado, residuos claros limpos e camera/microfone frios apos os ciclos.
- Evidencia iOS e parcial: os ciclos curtos terminaram por limite de segmento antes do toque final; encerramento antecipado durante gravacao, Cofre visual pos-toque, Player e midia longa iOS seguem pendentes.
- Frente 1.2 nao esta fechada e nao libera Frente 2/3/4/5, P2P/anjo, upload, localizacao ou conveniados.

Atualizacao de continuidade em 2026-05-11 - Frente 1.2 Android validado:

- Android fisico `23129RA5FL` passou na matriz desta rodada, mas a Frente 1.2 ainda nao pode ser fechada sem iPhone fisico.
- APK final instalado: `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256 `b4c8eb4aad7fb7c886bf5f726f179be633e03751a5eb9ae9b79c3ee061ada0f3`.
- SOS 60s, 3min e ciclo longo confirmaram saida visual de `CHAMADO ATIVO` em ate 0,5s, modal/progresso e cofre terminando como `Video protegido`.
- Player final confirmou preparo antes do play, timeline coerente nos primeiros segundos e fechamento durante reproducao sem crash do processo SinalSeguro.
- Inventario final saneado do sandbox: 399 arquivos, 0 midias claras persistentes, 17 `.nseg` e 375 `.sseg`.
- Gates finais aprovados: `typecheck`, `lint`, `test`, `private:android:readiness` com pendencia ambiental conhecida de Node 20.16.0, e `git diff --check`.
- Proxima retomada: limpar regeneraveis antes de nova build, repetir matriz em iPhone fisico e nao avancar P2P/anjo/upload/localizacao/conveniados.

Atualizacao de continuidade em 2026-05-13 - Frente 1.3 Android e portal:

- APK Android privado novo instalado no device modelo `23129RA5FL` com identificador redigido, SHA-256 `19ad59c4b9c4c47c8316f3a24d354626ee11a3442be910841fcd1e73283cd08b`.
- Validacao visual fisica cobriu `Perfis`, `Anjos de confianca` e `Convite recebido`; perfil nao definido bloqueia convite e a tela de convite sem token orienta configurar perfil adulto.
- Log saneado do recorte nao mostrou `FATAL EXCEPTION`, `AndroidRuntime`, `ReactNativeJS Error`, ANR ou crash do processo SinalSeguro.
- Portal publico atualizado e publicado na EC2 em `/var/www/sinalseguro/releases/20260513T215810Z`.
- Manifesto publico contem apenas Android; iPhone nao tem release ativo e `/baixar/ios` informa disponibilidade posterior em linguagem publica.
- Checkpoint detalhado: `docs/40_CHECKPOINT_FRENTE_1_3_ANDROID_RELEASE_PORTAL_2026-05-13.md`.

Estado ativo em 2026-05-07:

- Frente 1.1 foi implementada localmente: app gera chave Ed25519 por dispositivo, guarda o segredo no SecureStore nativo, envia apenas chave publica, hash, metadados saneados e prova de posse;
- backend exige `key_proof` em `/devices/`, rejeita assinatura invalida, suporta migracao de hash legado por `replaces_public_key_sha256`, rotacao em `/devices/{id}/rotate-key/` e perda em `/devices/{id}/mark-lost/`;
- documentacao da frente: `docs/33_CHAVES_REAIS_DISPOSITIVO.md`;
- validacoes aprovadas: `npm run typecheck`, `npm run lint`, `npm test`, `manage.py check` e `manage.py test sinalseguro_api.tests.test_platform_base`;
- deploy da API com migracao foi concluido: `sinalseguro-api` e `cereusia-crm` ativos, `nginx -t` aprovado, `cereusia.conf` intacto, API publica `health=ok` e readiness `database=ok`;
- Android fisico e iPhone fisico homologaram a Frente 1.1 contra a API publicada;
- Frente 1 Android foi validada com Google Sign-In nativo, JWT interno SinalSeguro, SecureStore, `auth/me`, registro autenticado em `/devices/` e logout com refresh revogado;
- OAuth iOS privado foi criado/configurado sem registrar Client ID real; `.env.local` contem as variaveis iOS esperadas e o valor real nao deve ser impresso;
- EC2 recebeu a audiencia iOS em `/etc/sinalseguro-api.env`; somente `sinalseguro-api` foi reiniciado e `cereusia-crm` permaneceu ativo;
- iOS foi compilado em `Release` para iPhone fisico e instalado via `ios-deploy`;
- build iOS deve gerar antes o xcconfig temporario com `npm run prepare:build:ios:secure-config`; sem esse arquivo, o URL scheme Google pode ficar vazio no `Info.plist` e o app pode fechar ao iniciar Google Sign-In;
- `ios/Podfile` corrige no `post_install` o script phase do `EXConstants` para funcionar em caminho iCloud com espaco;
- `app.config.js` injeta `iosUrlScheme` do Google Sign-In apenas por ambiente local, sem versionar valor real;
- iPhone fisico validou Google Sign-In e registrou `/devices/` iOS com `key_algorithm=ed25519-v1`, chave publica/hash presentes e `key_registered_at` preenchido;
- Android nao apareceu no ADB nesta retomada; teste de convites entre Android/iOS depende de reconectar/desbloquear o Android;
- workflow padrao em maquinas com pouco espaco: antes de alternar Android/iOS, limpar regeneraveis da plataforma anterior e preservar fonte, locks, Pods necessarios e segredos locais;
- scripts globais de apoio ficam em `scripts/` na raiz e sao chamados no app por `npm run prepare:build:ios`, `npm run prepare:build:android` e `npm run patch:ios:path-spaces`; o script app-local `scripts/prepare-ios-secure-build-config.mjs` gera o xcconfig iOS temporario sem imprimir valores sensiveis.

## Memoria viva - 2026-05-07 - Frente 1.1 Android homologada

- Android fisico recebeu o APK privado da Frente 1.1, SHA-256 `9b37ed50604da58cd4bbe11622de7802c0335140e262e895b444da30ea5217f7`.
- App abriu sem crash; a rota `sinalseguro://configuracoes` abriu `Configuracoes`.
- `Configuracoes > Login` confirmou sessao conectada, API configurada e dispositivo autenticado registrado.
- `Testar API` retornou `API SinalSeguro online: ok.`.
- `Validar sessao` retornou `Sessao SinalSeguro validada. Dispositivo registrado e consentimentos sincronizados.`.
- Consulta saneada na API de producao confirmou Android ativo com `key_algorithm=ed25519-v1`, chave publica/hash presentes e `key_registered_at` preenchido.
- Logcat do processo nao mostrou padroes de e-mail, Bearer, ID token, refresh token, chave privada ou `key_proof`.
- iOS tambem homologado no iPhone fisico; proxima frente viavel: Frente 1.2, midia critica.

## Memoria viva - 2026-05-07 - Frente 1.1 iOS homologada

- Primeiro build iOS da Frente 1.1 instalou, mas levava URL scheme Google vazio no `Info.plist`; ao tocar em `Entrar com Google`, o app fechava.
- Correção mobile: adicionado `scripts/prepare-ios-secure-build-config.mjs` e atalho `npm run prepare:build:ios:secure-config`, que leem `.env.local`/ambiente local, validam Web Client ID, iOS Client ID e URL scheme sem imprimir valores, e geram `/private/tmp/sinalseguro-ios-secrets.xcconfig` com permissao `0600`.
- Rebuild `Release` com `-xcconfig /private/tmp/sinalseguro-ios-secrets.xcconfig` passou no iPhone fisico; validacao saneada do bundle confirmou zero URL schemes vazios, scheme Google presente e `sinalseguro` presente.
- Pacote iOS corrigido: SHA-256 `f95031a9f9d339b737702bc0540c4ab9bdab79c7d91e95e4b87fd6cd759b8546`.
- `ios-deploy` reinstalou e abriu o app corrigido; `devicectl` continuou indisponivel por CoreDevice.
- Backend de producao confirmou dispositivo iOS ativo com `key_algorithm=ed25519-v1`, chave publica/hash presentes e `key_registered_at` preenchido.
- Gates mobile apos a correcao iOS: `npm run typecheck`, `npm run lint`, `npm test` e `git diff --check` aprovados.

Estado ativo em 2026-05-06:

- especialistas coordenados por Ze nesta rodada: Ada/Schneier revisaram gravacao/criptografia, Myers revisou reproducao e evidencias Android, Ritchie/Knuth revisaram continuidade tecnica;
- causa principal do travamento no Android: configuracao `both` montava duas cameras e o aparelho permitia apenas uma camera ativa;
- preferencia padrao de video local passou para camera frontal e, no Android, `both` e convertido em runtime para `frontal (modo leve)`;
- player deixou de preparar video criptografado automaticamente ao abrir a tela; a preparacao agora ocorre somente no toque em `Reproduzir`;
- `EncryptedVideoPlaybackCache` foi criado como ponte transitoria para `expo-video`, gerando cache privado sob demanda, com progresso e yield/backpressure;
- `EncryptedVideoDataSource` ganhou opcao de pular hash plaintext no caminho de playback, mantendo AEAD e hash do ciphertext para reduzir CPU;
- chunks novos passaram para 512 KB, preservacao faz yield a cada chunk e o player reduz updates de progresso para evitar re-render excessivo;
- validacoes locais aprovadas: `npm run typecheck`, `npm test`, `npm run lint`, `npm run build:android:private`;
- APK final instalado no Android fisico via ADB, SHA-256 `f2a1144a70be15aeb993436cc27b658b6c20958537ba427cf1444ef9d8746edd`;
- Android validado: SOS iniciou sem travar, encerrou corretamente, cofre/player abriu, video de 1min01s nao ficou limitado a 2s, e video final de 33s foi preservado com 13 chunks protegidos e reproduzido no player interno;
- evidencias salvas em `docs/evidencias/android/2026-05-06-player-duration/`;
- complemento validado no mesmo dia: Player Seguro agora faz preload automatico apenas do asset selecionado, aborta preparo antigo em troca de video, mostra timeline `0:00 / 0:31`, permite play/pause, seek para `0:24 / 0:31`, fullscreen nativo e retorno ao modal;
- APK privado final desta etapa: SHA-256 `f19623b9b9aa10d7cbd1262c3b1ad2a864d32db91acefd7a0974091366660df2`, instalado no Android fisico via ADB Wi-Fi `[ip-redigido]:5555`;
- evidencias do Player Seguro salvas em `docs/evidencias/android/2026-05-06-player-preload-controls/`;
- complemento final validado no mesmo dia: Player Seguro passou a usar `EncryptedVideoLoopbackServer` em `[ip-redigido]` com URL de capacidade efemera e suporte a `Range`, descriptografando somente chunks/faixas solicitados pelo `expo-video`;
- `EncryptedVideoPlaybackCache` ficou como limpeza/compatibilidade de cache legado, nao como caminho principal de reproducao criptografada;
- APK privado da etapa `Range`: SHA-256 `82e1ab82251a9ed812204bb06021e41f0ebd627d5c8bc6a6d26ff45e1c1c46e1`, instalado no Android fisico via ADB Wi-Fi `[ip-redigido]:5555`;
- validacao Android do `Range`: primeiro frame, timeline `0:00 / 0:32`, seek para `0:24 / 0:31`, fullscreen nativo, retorno ao modal, reproducao completa ate `0:31 / 0:31` e replay com `Pausar` em `0:01 / 0:31`;
- evidencias do Player Seguro por `Range` salvas em `docs/evidencias/android/2026-05-06-player-range-streaming/`;
- complemento C2 fechado nesta retomada: `SecureVideoThumbnailStore` gera thumbnail segura, cifra como `thumbnail.sseg` e apaga a thumbnail clara temporaria;
- `CameraCaptureResidueCleaner` limpa residuos `.mp4` de `cache/Camera` somente apos `EncryptedVideoStore` reabrir e verificar chave, manifesto, chunks, hashes agregados e thumbnail cifrada;
- falha de preservacao nao apaga MP4 claro original; falha de limpeza fica registrada como `plaintextCleanup.status = cleanup_pending`;
- validacoes locais aprovadas no fechamento C2: `npm run typecheck`, `npm test`, `npm run lint`, `npm run build:android:private`;
- APK privado C2 instalado no Android fisico `[ip-redigido]:5555`, SHA-256 `024150800908109199f84e1be2ef5bd9c72ae1f6986ecee0a8269f2c44ca1323`;
- Android C2 validado: SOS iniciou, encerramento preservou asset `7c967904-589c-452c-85fc-8203aee83be9` com `manifest.sseg`, 22 chunks protegidos e `thumbnail.sseg`;
- inventario ADB absoluto confirmou `cache/Camera` vazio, `cache/VideoThumbnails` vazio e nenhum `.mp4` claro nesses caches apos preservacao;
- evidencias C2 salvas em `docs/evidencias/android/2026-05-06-capture-cleanup-thumbnail/`;
- tentativa de reinstalacao final apos recompilar o mesmo APK nao foi repetida porque o ADB Wi-Fi `[ip-redigido]:5555` caiu e `adb connect` retornou timeout; o hash do APK final permaneceu o mesmo ja validado;
- limite consciente restante: em producao final, avaliar substituicao do loopback local por data source nativo; a interface de midia local esta apta para a proxima etapa de envelopes/chaves/sessao remota sem novas mudancas visuais.

Estado ativo em 2026-05-05:

- Ada foi nomeada gerente operacional desta tarefa de midia, sob coordenacao de Ze;
- Schneier e Myers revisaram o risco atual: MP4 claro em sandbox, hash em Base64 para arquivos grandes e player abrindo URI direta;
- `EncryptedVideoStore` passou a preservar videos novos em chunks cifrados com chave unica por video;
- algoritmo implementado: XChaCha20-Poly1305 com chave de 32 bytes, nonce unico por chunk e AEAD autenticado;
- manifesto cifrado/autenticado registra chunks, offsets, tamanhos, hashes, nonces, tags, codec, duracao pendente, thumbnail segura pendente e envelopes futuros;
- `EncryptedVideoDataSource` fornece leitura por range para seek, replay e reproducao parcial sem descriptografar o video inteiro;
- o player interno nao abre ciphertext como URI de video; reproducao segura de assets cifrados depende do proximo bloco: adaptador nativo ou servidor HTTP local loopback com suporte a `Range`;
- testes unitarios cobrem chunk, seek, replay, corrupcao e chave invalida;
- documento de continuidade: `docs/30_MIDIA_CRIPTOGRAFADA_CHUNKS.md`.
- Ritchie assumiu a frente tecnica do plano remoto EC2/P2P/conveniados, sob coordenacao de Ze;
- `RemoteSharingPlan` foi criado para modelar a EC2 como coordenadora de login, dispositivos, chaves publicas, envelopes de chave, sinalizacao P2P e auditoria;
- `EmergencyDeliveryPlan.remoteSharing` registra video, audio e localizacao em tempo real como canais futuros criptografados ponta a ponta, liberados somente durante emergencia ativa;
- conveniados permanecem fase futura separada, exigindo contrato, RBAC, MFA, retencao, auditoria e RIPD/DPIA;
- documento de continuidade: `docs/31_ARQUITETURA_COMPARTILHAMENTO_TEMPO_REAL.md`.
- em 2026-05-05, Roberto bifurcou backend/mobile/CRM para a sessao `019df9a8-1894-7002-b7f8-199eaaf3f118`; este chat deve continuar focado apenas na interface de midia;
- interface de midia refinada com rotulos centralizados em `mediaInterfacePresentation`, badges de protecao no Cofre e estados claros no Player;
- browser local validado em `http://localhost:8081/arquivos?painel=cofre` e `http://localhost:8081/arquivos?painel=player`;
- correção web pequena: `Linking.openSettings()` passa a ter fallback em navegador para nao bloquear validacao visual.

Estado ativo em 2026-05-04:

- UX/IX do SOS em refinamento com efeito de bolha, anel de pressao mais visivel dentro da circunferencia e feedback magenta/rosa;
- Home sem microcopy redundante e drawer enxuto por acoes iconograficas;
- drawer da Home e do Cofre separa `Cofre`, `Anjos`, `Player` e `Configuracoes`;
- Cofre local em grade vertical, com acoes por icones, exclusao confirmada, tombstone/auditoria local e bloqueio de exclusao de chamado ativo;
- Player privado/homologacao compacto, com video local preservado, progresso real quando houver midia e metadados essenciais;
- codigo de seguranca para encerramento segue local, opcional, salvo como hash e sem codigo universal padrao;
- midia privada permanece restrita a homologacao controlada; build publico continua sem camera/microfone, streaming, upload, P2P, compartilhamento externo ou integracao oficial;
- script/gate privado de APK Android permanece separado do gate publico;
- Android fisico de referencia recente: `23129RA5FL`, ADB Wi-Fi `[ip-redigido]:5555`;
- proxima validacao manual no aparelho deve confirmar: SOS inicia camera, encerramento preserva video, Cofre lista pacote e Player reproduz midia local;
- pendencias tecnicas: hash incremental/binario para videos longos, cota/retencao local, homologacao juridica/seguranca para transmissao, backend, anjos reais, chaves, retencao e exportacao.

Estado ativo em 2026-05-03:

- APK privado com midia local instalado no Android `[ip-redigido]:5555`;
- hash vigente `b6993cf4056d9926e582e9579621f4e32f468fc83e1cc66185678652b51df22f`;
- abertura fria revalidada sem crash fatal;
- topo revisado por Tarcila para usar o simbolo `sinalseguro-symbol.png` como logomarca sem texto, mantendo `SinalSeguro` como texto responsivo de interface;
- feedback ativo do SOS sem animacao verde, usando apenas a paleta magenta/rosa da identidade;
- proxima validacao depende de toque manual no aparelho: SOS inicia camera, encerramento preserva video, Cofre lista pacote e Player reproduz midia local.

Estado em 2026-05-02:

- especialistas acionados: Kim, Ada, Margaret, Myers, Schneier, Doneda, Tarcila, Knuth e ESCRIBA/Freire;
- plano operacional versionado em `docs/13_ETAPA_1_ANDROID_INSTALAVEL.md`;
- `eas.json` define `preview` como APK interno e `production` como AAB futuro;
- `expo-build-properties` define Android 7+, target SDK 36 e iOS 15.1+ no schema correto do Expo;
- `expo-doctor` esta limpo em 17/17 checks;
- `npm run release:android:readiness` e o gate obrigatorio antes de build;
- camera/microfone, overlay e armazenamento legado ficam fora do primeiro instalavel;
- Android SDK local foi preparado com `android-36`;
- keystore de upload foi criada fora do repositorio, com senhas no Keychain;
- APK assinado local foi gerado e validado como artefato de homologacao tecnica;
- Android interno 2 incorporou validacao Tarcila de nome, logo, icone, splash e contraste;
- SHA-256 atual do APK: `dbad294407038cac954fd3154bac6c4ea9dbb30b4e79164f58807e83f0d358cb`;
- GitHub Release Android interno 1 foi publicada em `https://github.com/sinalseguro/App/releases/tag/android-v0.1.0-internal.1`;
- GitHub Release Android interno 2 foi publicada em `https://github.com/sinalseguro/App/releases/tag/android-v0.1.0-internal.2`;
- APK interno 2 foi instalado e aberto em Android fisico via ADB Wi-Fi, com `versionCode=2`;
- portal e manifestos apontam ao APK/checksum interno 2 para homologacao controlada;
- deploy dos portais concluido em `cereus_web:/var/www/sinalseguro/releases/20260502T191004Z`;
- funcoes de convite local foram implementadas com codigo opaco, expiracao, share sheet e deep link futuro;
- pacote local de emergencia foi implementado com horario, consentimento, localizacao pontual autorizada, manifesto de midia bloqueada, hash SHA-256 e plano de entrega API/P2P pendente;
- area `Arquivos locais` foi criada para listar pacotes gravados, hash, status de georreferencia, midia bloqueada e plano de envio futuro;
- convites e pacotes pequenos usam cofre local do sistema via `expo-secure-store`, com indice sem dado sensivel em `AsyncStorage`;
- alerta permanece simulado ate outbox criptografada, API e revisoes de seguranca/QA.
- validacao Android fisica dos recursos locais foi concluida em `23129RA5FL`, Android 15, via ADB Wi-Fi `[ip-redigido]:5555`;
- APK debug validado: `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256 `a3b04d9e29349319ead70200c75c030d980b6b1b67feb8a5d34ec78c6b6b71b5`;
- convites, deep link, alerta local, georreferencia consentida, negacao de localizacao, arquivos locais e persistencia foram validados;
- Myers/Schneier identificaram `SYSTEM_ALERT_WINDOW` no manifest debug gerado pelo Expo; foi corrigido no APK e criado plugin local de hardening para proximos prebuilds;
- evidencias saneadas ficaram em `docs/evidencias/android/2026-05-02-recursos-locais/`;
- relatorio tecnico ficou em `docs/15_VALIDACAO_ANDROID_RECURSOS_LOCAIS.md`.
- duracao padrao configuravel foi adicionada com opcoes `30s`, `1min`, `3min`, `5min`;
- chamado local ativo agora usa `recording_local` e pode ser finalizado manualmente;
- finalizacao recalcula SHA-256 sem carregar o bloco `integrity` anterior;
- Home e Alerta recarregam preferencias ao ganhar foco, para aplicar imediatamente mudancas de configuracao;
- configuracoes permite pre-autorizar localizacao foreground para evitar novo prompt quando a permissao ja esta concedida;
- configuracoes trata ausencia de `ACCESS_BACKGROUND_LOCATION` como bloqueio esperado no build publico, sem quebrar a tela;
- segundo plano e atalho fisico por volume com tela travada foram documentados como homologacao/pesquisa futura, sem promessa no MVP publico;
- `app/_layout.tsx` chama `SplashScreen.hideAsync()` no mount para evitar retencao extra da tela inicial;
- Tarcila aprovou splash, icone, adaptive icon atual e lockup para homologacao interna;
- validacao Android fisica confirmou duracao `30s`, chamado ativo, finalizacao manual e pacote finalizado em `Arquivos locais`;
- documento `docs/16_SEGUNDO_PLANO_ATALHO_FISICO_E_DURACAO.md` registra limites tecnicos e fontes oficiais.
- splash custom foi redesenhada com simbolo maior, nome `SinalSeguro` abaixo e barra de loading, sem efeitos ornamentais;
- Home agora prioriza botao circular central `SOS`;
- atalhos principais ficam em grade: `Ligar 190`, `Anjos`, `Cofre`, `Config.`;
- `Arquivos locais` passa a ser apresentado como `Cofre local`;
- player visual e politica de evidencias foram adicionados para arquivos gravados/recebidos, com midia real bloqueada no build publico;
- preferencias locais permitem solicitar escopos futuros de audio, video e localizacao em tempo real, mas sempre `homologation_blocked`;
- atalho 190 fica ativo por padrao com confirmacao manual e pode ser desativado em configuracoes;
- chamada para anjo autorizado foi registrada como preferencia futura, sem chamada automatica no build publico;
- envelope local nao marca mais backend/P2P como prontos sem adaptadores reais;
- documento `docs/17_STREAMING_COFRE_PLAYER_E_190.md` registra contrato bilateral, chaves, player, cofre e 190.
- validacao Android fisica confirmou Home com `SOS`, atalho 190 com confirmacao, `Cofre local` com player bloqueado e `Configuracoes` com escopos futuros;
- gates locais aprovados: `typecheck`, `lint`, `test`, `release:android:readiness` pronto condicionado.
- em 2026-05-03, a splash nativa antiga com logo horizontal foi removida; decisao posterior de Tarcila substituiu a transicao vazia por simbolo discreto aprovado;
- pacote finalizado foi alinhado para `recorded_local`, sem promessa de fila/entrega;
- consentimento de compartilhamento foi alinhado para `blocked_until_contract_backend_audit`;
- pre-convites locais nao prometem aceite/revogacao sem backend;
- contatos mock nao entram como anjos autorizados no pacote local;
- delete local registra tombstone/auditoria antes de remover o pacote deste dispositivo;
- Cofre local foi validado com player dedicado, trilha retratil, acoes em raio e compartilhamento bloqueado;
- registro historico: a microcopy do SOS chegou a usar `Solte`; no checkpoint posterior, esse texto auxiliar foi removido da Home para reduzir ruido no acionamento;
- API real ficou bloqueada por flag de ambiente, sem endpoint hardcoded ativo por padrao;
- share sheet do sistema ficou documentado como excecao exclusiva para pre-convite sem evidencia;
- Navegador abriu `http://[ip-redigido]:8081` com titulo `SinalSeguro`, mas preview web ficou preto no dev-client; validacao visual oficial segue no Android fisico;
- readiness Android passou com Node 24 e acesso remoto GitHub, restando apenas pendencias esperadas de assinatura e nativo gerado;
- evidencias ficaram em `docs/evidencias/android/2026-05-03-ux-cofre/`;
- relatorio complementar ficou em `docs/18_VALIDACAO_UX_SPLASH_COFRE_ANDROID.md`;
- gates aprovados: `typecheck`, `lint`, `test`, `assembleDebug`, install Android via ADB Wi-Fi.
- apos nova revisao de Roberto em 2026-05-03, Tarcila/Norman orientaram trocar a splash nativa vazia por simbolo discreto aprovado;
- `app/_layout.tsx` passou a proteger `expo-splash-screen` apenas em Android/iOS, destravando o simulador web;
- `react-native-web` foi instalado para permitir preview em navegador;
- Home no navegador foi validada com SOS central e atalhos principais em `http://localhost:8081`;
- `Cofre local` no navegador foi validado com player dedicado e area de revisao local;
- SOS ativo agora muda para `ATIVO`, exibe particulas discretas e usa o mesmo gesto para acionar ou encerrar;
- encerramento seguro ganhou confirmacao e codigo opcional, desativado por padrao, armazenado como hash local;
- `Configuracoes` ganhou area `Seguranca para encerrar`;
- player local ganhou controles de revisar, pausar, reiniciar e linha de progresso;
- exclusao local pelo raio passou a remover o pacote diretamente do cofre local com tombstone, sem depender de `Alert` nativo;
- evidencias browser ficaram em `docs/evidencias/browser/2026-05-03-simulador/`;
- relatorio complementar ficou em `docs/19_REFINO_SPLASH_SOS_PLAYER_BROWSER.md`;
- APK debug foi reconstruido e instalado no Android via ADB Wi-Fi;
- readiness Android passou como pronto condicionado, com pendencias esperadas de assinatura release e diretorio nativo gerado;
- `logcat` confirmou `ReactNativeJS: Running "main"` no Android debug, sem crash fatal;
- captura visual Android ficou bloqueada por overlay MIUI `NotificationShade`/AOD e `ScreenOnProximitySensorGuide`, exigindo desbloqueio/limpeza do overlay para validacao visual fisica;
- gates aprovados nesta revisao: `typecheck`, `lint`, `test`, `web`, `assembleDebug`, `install Android`, `release:android:readiness`.
- apos correcao de rota apontada por Roberto, validacao da Home passou a ser feita explicitamente em `http://localhost:8081/`, nao em `/arquivos`;
- Tarcila/Norman reprovaram a Home anterior por rolagem, texto duplicado, SOS pequeno, menu ausente e atalhos incompletos;
- Home foi refatorada para superficie fixa de emergencia, sem `SafeScreen`/`ScrollView`, com header nativo oculto apenas na rota inicial;
- tela principal agora mostra apenas topo discreto, SOS central responsivo e atalhos oficiais `Policia 190`, `Bombeiros 193` e `SAMU 192`;
- registro historico: o drawer da engrenagem chegou a concentrar `Modo atual`, status e atalhos; no checkpoint posterior, ele foi simplificado para acoes iconograficas essenciais;
- criterios de arquitetura atualizados: componentes de layout/regra ficam em arquivos proprios sob `src/features/emergency-home/`;
- `EmergencyCallTarget` passou a modelar os canais oficiais e URI `tel:`;
- fallback web de `secureStorage` deixou de chamar `expo-secure-store` e usa armazenamento de simulador por sessao/memoria;
- SOS web nao captura localizacao real e erro de persistencia vira falha controlada;
- codigo universal de encerramento deixou de ser padrao valido; ativacao exige novo codigo salvo como hash local;
- Browser Use validou Home fixa e drawer em `http://localhost:8081/`;
- Android fisico recebeu APK debug atualizado via ADB Wi-Fi e validou Home, drawer e SOS ativo com gesto longo;
- evidencias foram salvas em `docs/evidencias/browser/2026-05-03-home-sos-refatorada/` e `docs/evidencias/android/2026-05-03-home-sos-refatorada/`;
- relatorio complementar criado em `docs/20_HOME_SOS_FIXA_MODULAR_ANDROID_BROWSER.md`;
- gates aprovados nesta revisao: `typecheck`, `lint`, `test`, `release:android:readiness`, `git diff --check`, `assembleDebug`, `adb install`, Browser Use e logcat filtrado.
- revisao complementar dos especialistas em 2026-05-03 identificou bloqueios de UX/seguranca antes de novo checkpoint;
- Tarcila/Norman exigiram confirmacao antes de excluir evidencia local e remocao de jargao `backend/P2P` do drawer;
- Ada/Hedy exigiram singleton/idempotencia no servico de SOS e respeito ao atalho 190 configuravel;
- Schneier/Doneda/Myers reforcaram web como simulador volatil, reconciliacao da splash e readiness com Node correto;
- `startEmergencyPackage()` agora impede multiplos chamados `recording_local` por dispositivo;
- `recordEmergencyPackage()` nao finaliza chamado ativo por engano;
- cofre local agora confirma exclusao, bloqueia exclusao de chamado ativo e preserva tombstone local;
- `Policia 190` respeita `call190ShortcutEnabled`; `Bombeiros 193` e `SAMU 192` seguem visiveis;
- fallback web do cofre deixou de usar `sessionStorage` e fica apenas em memoria volatil;
- `docs/18_VALIDACAO_UX_SPLASH_COFRE_ANDROID.md` foi reconciliado com o estado real: splash nativa com simbolo discreto aprovado, sem plugin blank;
- relatorio complementar criado em `docs/21_REVISAO_ESPECIALISTAS_HOME_COFRE_SEGURANCA.md`.
- gates finais aprovados: `typecheck`, `lint`, `test`, `release:android:readiness`, `git diff --check` e `assembleDebug`;
- servidor web respondeu em `http://localhost:8081`;
- ADB nao tinha aparelho conectado no fechamento desta rodada, portanto nao houve reinstalacao fisica adicional.
- em 2026-05-03, a rodada de comentarios do navegador foi aplicada sob supervisao Tarcila/Norman;
- splash nativa foi substituida por `assets/brand/sinalseguro-splash-approved.png`, com simbolo grande, nome e fundo institucional;
- `AppTopBar`, `BrandedDialog` e `ResourceTile` foram criados como componentes compartilhados;
- Home manteve superficie fixa, agora com topo de logo real e drawer com ajuda/opcoes de modo;
- `Alert.alert` foi removido dos fluxos criticos de Home e Cofre;
- SOS ganhou profundidade 3D discreta, estado pressionado e particulas ativas mais altas/lentas;
- Cofre local foi refatorado para tela fixa por icones, com Player e Cofre em modais;
- dados tecnicos do cofre passaram para menu sanduiche;
- pagina `Como funciona` foi criada e ligada ao Cofre;
- configuracoes ganharam preparo de preferencia para video local futuro com camera frontal, traseira ou ambas, sem solicitar permissao real no build publico;
- screenshot set salvo em `docs/assets/mobile/2026-05-03-*.png`;
- relatorio criado em `docs/22_REFINO_IDENTIDADE_MODAL_COFRE_SPLASH.md`;
- especificacao viva criada em `docs/23_ESPECIFICACAO_DESENVOLVIMENTO_APP.md`;
- Browser Use validou Home, menu, modais, Cofre e Funcionamento em `http://localhost:8081`;
- APK debug reconstruido com SHA-256 `481d9aca5dd1cabb36520440f7959c71b542af5619803aadbe5170164b300e70`;
- `release:android:readiness` ficou bloqueado apenas pelo Node local `20.16.0`; exige `>=22.13.0`;
- ADB continuou sem dispositivo visivel apos restart do servidor; instalacao fisica ficou pendente;
- handoff para portais registrado para sessao `019ddfad-a214-72a3-9b50-ba204e1c9351`.
- complemento de continuidade em 2026-05-03 corrigiu o bloqueio P1 apontado por Schneier/Doneda/Myers: o Cofre agora usa confirmacao e codigo local opcional antes de finalizar chamado ativo;
- `BrandedDialog` ganhou rolagem interna para reduzir overflow em aparelhos menores ou fonte ampliada;
- `docs/23_ESPECIFICACAO_DESENVOLVIMENTO_APP.md` documenta permissoes transitivas do APK debug, mantendo camera/microfone/overlay/storage bloqueados;
- prints de `Cofre fixo` e `Como funciona` foram recapturados em `docs/assets/mobile/`;
- registro historico: o drawer da Home chegou a separar modo e ajuda em botoes irmaos; no checkpoint posterior, modo/status foram retirados da Home e mantidos como configuracoes por modal;
- relatorio complementar ficou em `docs/24_CONTINUIDADE_COFRE_ENCERRAMENTO_QA.md`;
- gates aprovados no complemento: `typecheck`, `lint`, `test`, `git diff --check`, `release:android:readiness` com Node 24 e `assembleDebug`;
- ADB continuou sem dispositivo; `adb connect [ip-redigido]:5555` retornou `Connection refused`.

Proximas acoes:

1. Reinstalar APK debug no Android quando `adb devices -l` mostrar o aparelho.
2. Validar splash nativa no Android reinstalado.
3. Validar Home, SOS ativo/encerramento, drawer, Cofre, Player e Funcionamento no Android fisico.
4. Tarcila/Myers aprovarem ou pedirem ajustes finais.
5. Gerar release interna 3 somente apos validacao fisica.
6. Atualizar portal/manifestos para release interna 3 apos APK assinado.
7. Acionar agentes dos portais na sessao `019ddfad-a214-72a3-9b50-ba204e1c9351`.
8. Preparar TestFlight/App Store para iOS.
9. Consolidar `alerts` e `emergency` em uma outbox unica criptografada e idempotente.
10. Conectar mock de API ao contrato OpenAPI.
11. Implementar adaptador de envio real apenas depois de auth, consentimento, retencao e revisao Schneier/Doneda.
12. Manter `origin` usando `github-sinalseguro-admin` para pushes do repo App.

## Memoria viva - 2026-05-03 - Android abriu sem Metro

- Roberto reportou travamento ao abrir no Android.
- Myers/Margaret identificaram que o APK debug anterior dependia do Metro em `localhost:8081`; sem Metro acessivel, o React nao carregava e a splash nativa ficava presa.
- A correcao vigente e usar `npm run build:android:debug:bundled`, que chama `./gradlew assembleDebug -PsinalBundleDebugJs=true`.
- `android/app/build.gradle` deve manter a propriedade `sinalBundleDebugJs` somente para validacao fisica; builds normais de desenvolvimento podem continuar usando Metro.
- `MainApplication.kt` usa `BuildConfig.DEBUG && !BuildConfig.SINAL_BUNDLED_DEBUG` para desativar o suporte nativo de desenvolvedor apenas no APK bundled de validacao.
- `app/_layout.tsx` tem fallback de `SplashScreen.hideAsync()` em 350 ms para evitar retencao da splash se o `onLayout` atrasar.
- APK instalado e validado no aparelho `[ip-redigido]:5555`, modelo `23129RA5FL`, com SHA-256 `2bd9055863a51f46d4c41f24b768e22b25f43984990e0313f5fc4baa5d599c83`.
- O USB foi informado como conectado, mas `adb devices -l` mostrou apenas ADB Wi-Fi; manter esse detalhe em proximas validacoes para nao confundir transporte fisico com transporte ADB.
- Validacao independente final: Metro parado, `adb reverse --remove-all`, cold start `TotalTime: 5700`, PID `7357` ativo, sem `Unable to load script`, `Failed to connect`, `FATAL EXCEPTION`, `AndroidRuntime` ou `setValueWithKeyAsync` no log isolado do SinalSeguro.
- SOS de teste entrou em `CHAMADO ATIVO`, capturou localizacao pontual e nao reproduziu o erro antigo de `ExpoSecureStore`.
- Evidencias finais para README/docs:
  - `docs/assets/mobile/2026-05-03-android-home-bundled.png`;
  - `docs/assets/mobile/2026-05-03-android-configuracoes-bundled.png`;
  - `docs/assets/mobile/2026-05-03-android-cofre-bundled.png`;
  - `docs/assets/mobile/2026-05-03-android-sos-bundled-pos-localizacao.png`;
  - `docs/assets/mobile/2026-05-03-android-cofre-pos-sos-bundled.png`.
- Nao usar capturas intermediarias de splash, tela preta, AOD/MIUI ou Metro para material publico.
- Tarcila aprova a direcao visual atual para validacao de Roberto, mas qualquer nova arte/logo/background/icone continua dependendo da revisao dela.
- Schneier/Doneda mantem bloqueio de transmissao, streaming, P2P, backend real e compartilhamento externo fora de homologacao controlada.

## Memoria viva - 2026-05-03 - Build privado com midia local

- Roberto decidiu habilitar midia nesta etapa por ser recurso central do SOS.
- A habilitacao vale apenas para APK privado de homologacao local, nao para release publico.
- `app.json` foi mantido como padrao publico sem `CAMERA`/`RECORD_AUDIO`; o build privado ativa essas permissoes pelo Manifest nativo preparado.
- `SYSTEM_ALERT_WINDOW`, armazenamento externo legado e backup Android de evidencias seguem bloqueados.
- `scripts/android-private-media-readiness.mjs` foi criado para separar o gate privado de midia do gate publico de release.
- `scripts/prepare-android-bundled-debug.mjs` agora corrige o Manifest nativo para camera/microfone e `android:allowBackup="false"`.
- `EmergencyMediaRecorder` grava video/audio local com `expo-camera` ao acionar o SOS e preserva o arquivo mesmo quando o chamado e encerrado manualmente.
- `mediaCapture` copia o video para `sinalseguro-media/`, remove o temporario da camera e calcula hash SHA-256 do conteudo preservado.
- `EvidencePlayerCard` usa `expo-video` para reproduzir video local quando o pacote tem `media.status = recorded_local`.
- O tempo configuravel passou a ser tempo de gravacao local: `Ilimitado`, `1min`, `5min`, `15min`, `30min`, `60min`.
- O chamado de emergencia nao encerra automaticamente por tempo; encerra apenas por gesto manual da usuaria, com confirmacao e codigo local opcional.
- Tarcila/Norman apontaram risco de corte em Configuracoes; `ResourceTile` e o espacamento da tela foram compactados.
- Myers/Schneier apontaram risco de perda de video no encerramento, inconsistencia de permissoes e backup Android; os tres pontos foram corrigidos antes do build privado.
- Documentacao viva do recurso: `docs/26_BUILD_PRIVADO_MIDIA_LOCAL.md`.

Proximas acoes atualizadas:

1. Roberto validar no Android fisico o APK bundled instalado.
2. Se aprovado, gerar release interna 3 e atualizar GitHub Release/portal.
3. Implementar backend/OIDC/convites/alertas conforme `docs/api/openapi.yaml`.
4. Validar no Android fisico: SOS inicia gravacao, encerramento preserva video e Cofre/Player reproduz o arquivo local.
5. Preparar homologacao juridica completa para transmissao, anjos, backend, envelope de chaves, retencao e exportacao.

## Memoria viva - 2026-05-03 - APK privado instalado

- APK privado com midia local gerado por `npm run build:android:private`.
- Artefato: `android/app/build/outputs/apk/debug/app-debug.apk`, tamanho aproximado 103 MB.
- SHA-256: `056e41d7e1e91aef10c6763bb094bfe27973693c8c163b222c6f4be2952be67b`.
- Instalado com sucesso no Android `[ip-redigido]:5555`, modelo `23129RA5FL`.
- Permissoes concedidas via ADB: camera, microfone, localizacao fina/aproximada e notificacoes.
- Cold start validado: `TotalTime: 4103`, PID `31065`, sem `FATAL`, `AndroidRuntime`, erro de bundle Metro ou `setValueWithKeyAsync` no log isolado.
- Captura aprovada para evidencia local: `docs/assets/mobile/2026-05-03-android-private-media-home.png`.
- A injecao de toque por ADB nao acionou os controles; a validacao funcional do gesto SOS com camera deve ser feita manualmente no aparelho fisico.

## Memoria viva - 2026-05-03 - Refinos midia/cofre/topo

- Roberto pediu ajuste rapido para remover as animacoes verdes do SOS ativo.
- Tarcila/Norman aprovaram substituir o feedback verde por luz/halo magenta dentro da identidade SinalSeguro.
- O topo do app agora usa `sinalseguro-symbol.png` como logomarca sem texto; o nome `SinalSeguro` e renderizado como texto responsivo da interface.
- Ada/Hedy corrigiram o fluxo de permissao: camera e microfone sao solicitados antes de depender do `CameraView.onCameraReady`, reduzindo risco de o primeiro SOS nao iniciar captura.
- O anel de progresso do SOS foi preso a circunferencia do botao, com SVG recortado pela propria area circular: horario para acionar e anti-horario para encerrar.
- `Video local` em Configuracoes preserva frontal/traseira/duas cameras; captura dupla e tentada no build privado e cai automaticamente para frontal/traseira quando a plataforma nao sustentar as duas ao mesmo tempo.
- O asset local registra `cameraMode` efetivo e `requestedCameraMode` original.
- Schneier/Myers reforcaram a gestao do Cofre: exclusao de chamado ativo agora e bloqueada no servico, e falha ao remover arquivo local mantem o pacote para retry.
- Player local sincroniza progresso com `expo-video` quando existe midia real.
- Gates executados nesta rodada: `typecheck`, `lint`, `test`.

## Memoria viva - 2026-05-03 - Anel SOS e cameras

- Roberto priorizou o anel na circunferencia do botao SOS e a configuracao frontal/traseira/duas cameras.
- Tarcila/Norman: anel agora fica em camada SVG recortada pela propria area circular do botao, discreto e responsivo.
- Ada/Hedy: `Duas cameras` tenta captura frontal+traseira; se a plataforma nao deixar as duas prontas, o recorder tenta fallback frontal e depois traseiro.
- Configuracoes mostra a camera selecionada diretamente no card `Midia`.
- APK privado reinstalado no Android `[ip-redigido]:5555`; SHA-256 `2fbef1caee679d901b1e3f6dac2cf3966aa2621d4da8ef1f24d8631b71b99d46`.
- Cold start do app instalado: `TotalTime: 3442`; log filtrado sem fatal/RedBox/Exception.
- Browser simulator ativo em `http://localhost:8081/` para validacao comentada.

## Memoria viva - 2026-05-03 - Ajustes de validacao comentada

- Roberto anotou remocao do texto `Solte`, remocao das metricas do drawer inicial, player mais enxuto, menu do Cofre igual ao da Home, numeros 190/193/192 em destaque e `Duas cameras` como padrao.
- Tarcila/Norman: Home fica mais limpa; menus retrateis devem conter somente acoes iconograficas, sem status tecnico exposto.
- Ada/Hedy: `schemaVersion` das preferencias subiu para `6`; novas instalacoes e preferencias antigas migradas usam `localVideoCapture.cameraMode = both`.
- Background da Home removeu riscos/linhas e usa particulas/circulos discretos com marca d'agua.
- Modais de chamada usam `CallNumberHero` para destacar o numero oficial como informacao principal.
- Cofre reutiliza `EmergencySettingsDrawer`; dados de pacote ficam em modais/player/trilha.
- Player foi compactado: menos texto, video/seletor/controles/metadados essenciais.
- Myers/Schneier: antes de gravacoes longas reais, corrigir hash de video para rotina incremental/binaria e definir cota/retencao local.

## Memoria viva - 2026-05-03 - Anel de progresso mais visivel

- Roberto apontou que o anel de load do SOS estava quase invisivel.
- Tarcila/Norman mantiveram a decisao de nao criar um segundo aro externo: o anel continua preso a circunferencia do botao para preservar a forma e a responsividade.
- O contraste do trilho e do progresso foi aumentado com opacidade e espessura maiores, tanto no acionamento quanto no encerramento.
- Ada/Hedy ajustaram a migracao de preferencias: qualquer configuracao anterior ao `schemaVersion 6` volta para `Duas cameras`, evitando aparelhos antigos ficarem presos em frontal/traseira.
- Myers reinstalou o APK privado no Android `[ip-redigido]:5555`, SHA-256 `f5a407ca1937f589f8d1c1f4dc1d2f251e8cf1f7031e59ef76f3ac3373724f15`, cold start `TotalTime: 4487` e logcat filtrado por PID sem falhas criticas.
- Evidencias visuais salvas em `docs/assets/mobile/2026-05-03-android-ring-visivel-home.png` e `docs/assets/mobile/2026-05-03-android-ring-visivel-hold.png`; log filtrado em `docs/evidencias/android/2026-05-03-ring-player-private/logcat-launch-app.txt`.

## Memoria viva - 2026-05-04 - Drawer Cofre/Player e Configuracoes limpa

- Roberto pediu continuidade nos comentarios do browser: SOS com efeito de bolha, Configuracoes sem fundo/status tecnico, drawer com `Cofre` e `Player`, Cofre em grade e fechamento ao tocar fora.
- Tarcila/Norman mantiveram a Home limpa e aprovaram a direcao do SOS como bolha 3D discreta, com anel mais visivel dentro da circunferencia.
- Ada/Hedy separaram a navegacao do drawer por painel: `Cofre` abre a trilha de arquivos e `Player` abre a revisao segura.
- `BrandedDialog` fecha ao tocar fora, preservando acoes destrutivas protegidas por confirmacao propria.
- `LocalEvidenceRail` agora apresenta os pacotes como grade vertical com acoes iconograficas em linhas/colunas.
- Configuracoes removeu o banner `Preferencias carregadas`; a tela principal fica somente com recursos em icones.
- Microajuste final do anel SOS: trilho e progresso ficaram um pouco mais espessos/opacos, ainda recortados dentro da circunferencia do botao.
- Evidencias browser salvas: `2026-05-04-home-sos-bolha.png`, `2026-05-04-home-menu-cofre-player.png`, `2026-05-04-configuracoes-sem-banner.png`, `2026-05-04-cofre-modal-grid.png`.
- Documento de continuidade: `docs/27_REFINO_DRAWER_COFRE_PLAYER_CONFIG.md`.

## Memoria viva - 2026-05-05 - Pausa solicitada para liberar disco

- Roberto pediu para salvar e pausar tudo antes de continuar, para liberar espaco no disco.
- Zé registrou regra operacional: antes de pausas, interrupções, builds longos ou risco de limite de uso, criar checkpoint mínimo em memória, documentação e Git.
- Não executar build Android, instalação no aparelho, limpeza de artefatos ou validação pesada durante esta pausa.
- Estado de trabalho deve ser preservado como checkpoint de continuidade, mesmo com ajustes ainda pendentes.
- Na retomada, começar por `git status --short`, ler `.codex/AGENTS.md`, esta memória, `TECNICA_MOBILE.md`, `SEGURANCA_QA.md`, `TARCILA.md` e `docs/03_TIMELINE.md`.
- Pendências conhecidas para a retomada: refinamento de modais com linguagem de produto, player/cofre com menos texto, código de segurança simplificado, hash de vídeo grande sem leitura integral em Base64, validação visual no browser e APK privado via script.

## Memoria viva - 2026-05-05 - Retomada final do APK privado

- Retomada iniciada por Zé/Cristine com `git status --short`, preservando os ajustes ja implementados e evitando retrabalho.
- Tarcila/Norman: SOS mantem identidade visual SinalSeguro, sem animação verde, com botão em bolha 3D, partículas discretas e anel circular interno na circunferencia do botão.
- Ada/Hedy: gravação local privada permanece habilitada para build privado; `Duas cameras` continua como padrão de homologação, com fallback de plataforma quando captura simultânea não for sustentada.
- Cofre/Player: lista de arquivos segue em grade vertical, com título/data do pacote, player local, ação de mapa e ação de compartilhar pelo app quando autorizada no produto.
- Configurações: recursos ficam em grade iconográfica; modais usam linguagem de produto e ajuda contextual `(?)`, sem justificar detalhes técnicos na camada principal.
- Código de segurança: permanece local, opcional e sem código padrão; quando habilitado, protege encerramento do SOS e áreas privadas como Cofre, Anjos, Player e Configurações.
- Linguagem pendente removida da UI principal: ações de compartilhamento passaram de `Envio futuro` para `Compartilhar pelo app`.
- Protocolo permanente para interrupções: antes de limite de uso, pausa, travamento, build longo ou limpeza de disco, registrar memória, documentação e Git para permitir retomada sem redundância.
- Próximo passo operacional desta retomada: rodar gates, validar browser, gerar APK privado com script, instalar no Android USB e publicar checkpoint.

## Solucao anti-redundancia - 2026-05-05

- Criado `docs/28_RETOMADA_SEM_REDUNDANCIA.md` como documento unico de retomada do ciclo atual.
- Na proxima interrupcao, Cristine deve iniciar por esse documento e por `git status --short --branch`, evitando reabrir toda a memoria historica.
- A fila de execucao ficou travada: fechar pendencias UX/IX comentadas, rodar gates leves, validar browser, gerar APK privado, instalar somente com ADB visivel e confirmacao no momento, atualizar memoria/docs e publicar Git.
- O criterio de passagem para a proxima etapa ficou objetivo: gates aprovados, browser validado, APK privado gerado, Android fisico validado ou bloqueio ADB documentado, commit e push.
- Acesso a Google/iCloud/contas logadas ficou marcado como etapa propria OIDC/backend, sem tocar credenciais ou configuracoes de conta sem confirmacao de acao.

## Memoria viva - 2026-05-05 - Ajustes finais no browser

- Roberto marcou no browser que a Home deve trazer `Policia`, `Bombeiros` e `SAMU` ativos por padrao, sem `190` no rotulo visual do botao `Policia`; `Anjo` fica como atalho futuro, desativado ate gestao propria.
- Tarcila/Norman revisaram a bolha SOS: foi removida a dupla transparencia superior; agora ha uma unica camada SVG com degradê que some em direcao ao centro.
- O texto `ATIVO` foi elevado acima das particulas e deve usar somente sombra verde no proprio texto, sem faixa/charuto atras, mantendo a massa principal magenta/rosa da identidade SinalSeguro.
- Myers/Schneier bloquearam o atalho de Anjo e `Anjo acionar 190` enquanto nao houver anjo aceito, conta propria, termos, contrato e auditoria.
- Cofre/Player agora mostram duracao/tempo de gravacao na grade e nos detalhes do player.
- Mapa agora oferece `Maps` da plataforma e `Google Maps`, valida disponibilidade no nativo e avisa que o app externo recebera a localizacao exata do registro.
- Gates locais desta rodada: `typecheck`, `lint`, `test`, `private:android:readiness` e `git diff --check` aprovados.
- Browser local aberto em `http://localhost:8081/` e Home validada com `Policia`, `Bombeiros` e `SAMU`, sem `Policia 190`.
- APK privado regerado por `npm run build:android:private`: `android/app/build/outputs/apk/debug/app-debug.apk`, `119M`, SHA-256 `daf5a22d163acc468a9470e1bd2178606f1b547c55bdf824a22eefe5d3f022d1`.
- APK instalado por USB no Android `23129RA5FL` com `adb install -r`: `Success`.
- Evidencias Android finais: `docs/evidencias/android/2026-05-05-apk-privado-final/home-apk-final-after-wake.png` e `docs/evidencias/android/2026-05-05-apk-privado-final/estado-final-aparelho.png`.
- Proxima fase do plano global: `API e Anjos`, documentada em `docs/29_PROXIMA_ETAPA_API_ANJOS.md`.

## Memoria viva - 2026-05-05 - Plano OIDC, videochamada e localizacao ao vivo

- Roberto pediu continuidade com EC2 como servidor de login, CRM/Gestao e compartilhamento de chaves para anjos.
- Cristine deve tratar a etapa como fases retomaveis, sem reabrir toda a memoria historica.
- Documento de continuidade criado: `docs/32_PLANO_LOGIN_VIDEOCHAMADA_ANJOS_LOCALIZACAO.md`.
- A primeira execucao e configurar Google Auth Platform do projeto `sinalseguro`, criar OAuth client Android para `br.com.sinalseguro.app` e configurar o client ID real somente em ambiente seguro local/build e em `/etc/sinalseguro-api.env`.
- Nao imprimir nem versionar client IDs reais, client secrets, tokens, senhas ou chaves privadas.
- Video/audio ao vivo para anjo autorizado deve usar WebRTC P2P; API fica como coordenador de identidade, convites, envelopes de chave, sinalizacao e auditoria.
- Localizacao em tempo real so pode trafegar durante emergencia ativa, para anjo aceito, em canal criptografado, sem coordenada em log.
- CRM/Gestao deve nascer com usuarios, dispositivos, anjos, convites, consentimentos, auditoria, politicas/termos e hub de login.
- Menores e conveniados continuam bloqueados para uso real ate politica ECA Digital/LGPD, contrato, RBAC, MFA, retencao e RIPD/DPIA.
- Lacunas dos especialistas incorporadas ao plano: OpenAPI unico, modelo de chaves, envelopes, WebRTC/STUN/TURN, outbox remota, RBAC, retencao, testes fim a fim e threat model.
- Prioridade pratica da proxima fase: fechar `OIDC + devices + chaves publicas + anjos + envelopes + emergency_sessions` antes de midia real, localizacao continua ou P2P critico.

## Memoria viva - 2026-05-05 - F0 OIDC Android configurada

- Google Auth Platform foi criada no projeto `sinalseguro`.
- Publico OAuth ficou `Externo` em modo `Testando`.
- Client OAuth Android `SinalSeguro Android privado` foi criado para package `br.com.sinalseguro.app` e SHA-1 do APK privado atual.
- Conta SinalSeguro foi adicionada como usuaria de teste.
- Client ID real nao deve ser escrito em docs, memoria, codigo ou Git; ele ficou no Keychain local, em `.env.local` ignorado e em `/etc/sinalseguro-api.env`.
- O JSON baixado automaticamente pelo Console foi removido de `Downloads`.
- A EC2 foi reiniciada e validada: API ativa, CRM ativo, readiness `database=ok`, `nginx -t` aprovado e `cereusia.conf` inalterado.
- `POST /api/auth/google` com token invalido retornou erro controlado, confirmando endpoint ativo sem expor configuracao.

## Memoria viva - 2026-05-05 - Diretriz gratuita, responsaveis e menores

- Roberto definiu que o projeto deve seguir sempre pelos niveis gratuitos enquanto for tecnicamente viavel.
- Nao ativar billing pago, TURN pago, servico gerenciado pago ou upgrade de Google Cloud/AWS/Cloudflare sem aprovacao explicita, estimativa, limite e registro.
- Android real esta conectado para a proxima validacao do login do app.
- Convites de anjos ficam restritos a contas adultas verificadas ou responsaveis autorizados.
- Pais/responsaveis podem adicionar filhos/dependentes e configurar a propria conta como anjo/responsavel do menor.
- Filhos/dependentes menores nao podem convidar anjos, conveniados ou terceiros.
- O bloqueio de convite por menor deve existir no app e na API.
- Fluxos com criancas/adolescentes devem seguir LGPD e Lei 15.211/2025/ECA Digital: minimizacao, consentimento adequado, finalidade clara, retencao, auditoria saneada e revisao Doneda/Schneier.
- Threat model deve cobrir risco de agressor ser responsavel legal ou ter acesso ao aparelho.

## Memoria viva - 2026-05-06 - Complemento F1/F2/F3 sem sobrescrever 019df9

- Retomada executada em modo append-only, tratando a sessao `019df9a8-1894-7002-b7f8-199eaaf3f118` como referencia consolidada.
- Fase 0 reconfirmada: `.env.local` possui as chaves esperadas sem imprimir valores; API publica respondeu `health=ok` e `ready database=ok`; EC2 manteve `sinalseguro-api` e `cereusia-crm` ativos.
- Hash de `/etc/nginx/sites-available/cereusia.conf` permaneceu `8cdcd9e3e7495371e84bd49fc81bee308f56a18698cff9144a4c1d12e4f6474c`; `nginx -t` exige `sudo` por permissao de leitura dos certificados e foi aprovado com `sudo`.
- Mobile agora tem `DeviceBindingService` POO: gera semente privada local no SecureStore, publica apenas material publico/hash de dispositivo, registra `/devices/` apos login e limpa apenas o vinculo remoto no logout.
- Login por e-mail e Google agora executa bootstrap autenticado: `/auth/me`, registro de dispositivo e consentimentos versionados; falha parcial de consentimento nao derruba a sessao quando a API remota ainda nao tiver migracao aplicada.
- Consentimentos ganharam escopo `login` na API e no contrato OpenAPI local; backend recebeu migracao `consents.0002_add_login_scope`.
- Convites de anjos agora usam API quando ha sessao autenticada: cria trusted contact, cria convite opaco/expiravel/uso unico e preserva fallback local pre-convite quando nao ha login.
- Aceite de convite no app exige conta propria e registra dispositivo antes de chamar a API; backend passou a negar aceite sem dispositivo ativo com chave publica/hash e protege aceite com lock transacional.
- Diferenca encontrada ainda pendente: bloqueio de convites por menores depende do modelo de responsaveis/dependentes/age assurance, que ainda nao existe no backend atual; nao foi criado campo improvisado.
- Validacoes mobile: `npm run typecheck`, `npm run lint`, `npm test` aprovados; `npm run private:android:readiness` aprovado com pendencia local conhecida de Node `20.16.0` abaixo do Node publico exigido.
- Validacoes API: `manage.py check`, `makemigrations --check --dry-run`, `manage.py test` e `manage.py spectacular --validate` aprovados.
- Servidor Expo web subiu em `http://localhost:8081`; Chrome estava em uso ativo pelo Roberto em pagina externa, entao Zé nao tomou a janela para nao interromper o usuario.
- Proximo bloco incompleto: aplicar/deployar migracao API na EC2, validar login Google real no Android fisico, aceitar convite fim a fim com duas contas/dispositivos e entao iniciar envelopes de emergencia.

## Memoria viva - 2026-05-06 - Deploy API F1/F2/F3 aplicado

- `infra/aws/deploy-api.sh` executado apos validacao local, sem alterar `cereusia.conf`.
- Migração `consents.0002_add_login_scope` aplicada na EC2.
- `sinalseguro-api` reiniciado e validado; `cereusia-crm` permaneceu ativo.
- Health publico: `https://api.sinalseguro.com.br/api/health` respondeu `ok`; readiness publico respondeu `database=ok`.
- `showmigrations consents` na EC2 confirmou `[X] 0002_add_login_scope`.
- `sudo nginx -t` aprovado e hash de `/etc/nginx/sites-available/cereusia.conf` permaneceu `8cdcd9e3e7495371e84bd49fc81bee308f56a18698cff9144a4c1d12e4f6474c`.
- `POST /api/auth/google` com token invalido retornou erro controlado, sem expor configuracao.
- Proximo bloco incompleto agora e validacao Android real do Google OIDC, convite fim a fim com duas contas/dispositivos e envelopes de emergencia.

## Memoria viva - 2026-05-06 - UX/IX Anjos integrada

- Tarcila/Norman orientaram a tela de Anjos para linguagem calma, protetiva e alinhada a identidade SinalSeguro, sem parecer fluxo emergencial.
- Ritchie/Ada orientaram a integracao para nao tratar mocks ou pre-convites locais como anjos reais.
- Tela `app/contatos.tsx` passou a usar `Anjos de confianca`, banner de estado, cards de prontidao, modal `BrandedDialog` e secoes separadas para anjos autorizados, convites validados pela API e pre-convites locais.
- `trustedContactsMock` deixou de ser usado na tela integrada; vinculo real vem de `/trusted-contacts/` e convite real vem de `/invitations/`.
- API client mobile ganhou listagem e revogacao de trusted contacts e invitations, preservando autenticacao e sem expor tokens ou payload sensivel.
- Modal de convite informa que apenas o convite sera enviado; evidencias, localizacao e dados sensiveis nao sao enviados nesta etapa.
- Validacoes locais aprovadas: `npm run typecheck`, `npm run lint`, `npm test`.
- Browser Use validou `http://localhost:8081/contatos`, incluindo tela principal e modal de convite; o browser ficou aberto para comentarios do Roberto.
- Proximo bloco incompleto: validar login Google real no Android fisico, convite fim a fim com duas contas/dispositivos e iniciar envelopes de emergencia.

## Memoria viva - 2026-05-06 - Frente 1 Android em chat limpo

- Retomada iniciou pelos status obrigatorios: `apps/mobile` e `repos/empresa` tinham mudancas locais pendentes; `repos/portais` estava limpo. Nada foi revertido.
- Arquivos locais de memoria foram lidos; `.env.local` existe e contem variaveis de API/Google OIDC, sem valores impressos.
- API publica validada: `health=ok` e readiness `database=ok`.
- Ajuste mobile aplicado: sessao social agora busca `auth/me` quando necessario antes de concluir login; painel Login mostra estado de Google OIDC configurado/pendente sem expor Client ID.
- Bootstrap autenticado existente continua registrando `/devices/`, persistindo JWT no SecureStore e limpando vinculo remoto local no logout.
- A base de chave do dispositivo ainda e compromisso publico/hash derivado de segredo local; par de chaves criptografico real, assinatura, rotacao e revogacao ficam para Frente 1.1.
- Validacoes aprovadas: `npm run typecheck`, `npm run lint`, `npm test`, `npm run private:android:readiness`, `git diff --check` e health/readiness publicos.
- Validacao Android fisica bloqueada: ADB nao listou aparelho e `adb connect [ip-redigido]:5555` retornou conexao recusada.
- Proxima frente recomendada: rede de anjos, convite, aceite, revogacao e chave publica real por dispositivo.

## Memoria viva - 2026-05-07 - Frente 1 Android validada ate o Google OAuth

- Android fisico foi disponibilizado por USB; ADB USB ficou instavel, mas a instalacao e lancamento foram concluidos por transporte ADB local sem registrar IP, serial ou e-mail.
- `npm run build:android:private` passou apos ajuste no script de preparo Android para o prebuild atual e criacao local de `android/local.properties` a partir do SDK configurado.
- APK instalado: `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256 `c527276c91ed274295062fb0d194b1c6f1f5e8ee0e9a00574e433f618247de31`.
- App abriu em Android 15 no pacote `br.com.sinalseguro.app`; `Configuracoes > Login` mostrou API configurada, dispositivo a registrar apos login e Google OIDC configurado para Android, sem expor Client ID.
- `Testar API` no app fisico retornou `API SinalSeguro online: ok.`; health publico segue `ok` e readiness segue `database=ok`.
- `Entrar com Google` abriu OAuth no Google, mas o provedor bloqueou antes do consentimento com `Erro 400: invalid_request` e mensagem saneada `Custom URI scheme is not enabled for your Android client.`
- Como o bloqueio ocorreu antes de receber ID token, ainda nao foi possivel validar no caminho real `POST /auth/google`, JWT interno, `auth/me`, registro autenticado em `/devices/` e logout com revogacao do refresh token.
- Logs foram revisados sem crash do app e sem registrar token, refresh token, ID token, Client ID real, e-mail pessoal, IP em claro, user-agent em claro ou payload sigiloso.
- Proximo passo antes da Frente 2: ajustar o OAuth Android privado no Google Cloud para habilitar custom URI scheme e repetir login fisico; Frente 1.1 deve trocar o vinculo/hash atual por par de chaves real do dispositivo.

## Memoria viva - 2026-05-07 - Redirect OAuth Android corrigido localmente

- ADB confirmou a tela do Google: `Acesso bloqueado: a solicitacao do app SinalSeguro e invalida`, `Erro 400: invalid_request` e `Custom URI scheme is not enabled for your Android client.`
- Diagnostico local: o APK aceitava `sinalseguro://`, mas nao aceitava `br.com.sinalseguro.app:/oauthredirect`, que e o redirect nativo padrao usado pelo provider Google do Expo no Android.
- Correcao aplicada: `app.json` agora registra os schemes `sinalseguro` e `br.com.sinalseguro.app`.
- Prebuild Android atualizou o Manifest; APK privado recompilado e reinstalado no aparelho fisico.
- ADB confirmou que `br.com.sinalseguro.app:/oauthredirect`, `sinalseguro:/oauthredirect` e `sinalseguro://configuracoes` resolvem para o app.
- Gates aprovados: `typecheck`, `lint`, `test`, `build:android:private` e `git diff --check`.
- APK atualizado: SHA-256 `e975046c54c756af14feba64fe40b83877252bb96bca0d97f2d334624218801b`.
- Sobre usuarios de teste: com escopos atuais `openid`, `profile` e `email`, a documentacao oficial do Google indica excecao para Sign in with Google no modo Testing; nao deve ser necessario pre-cadastrar cada usuaria enquanto o app nao pedir escopos sensiveis/restritos.
- Bloqueio restante: habilitar `Custom URI scheme` no OAuth Android privado do Google Cloud e aguardar propagacao antes de repetir o login real.

## Memoria viva - 2026-05-07 - Documentacao app/backend reconciliada

- Roberto pediu atualizar a documentacao do projeto conforme a situacao real do app/backend.
- Snapshot canonico criado no projeto raiz: `docs/tecnico/ESTADO_ATUAL_APP_BACKEND_2026-05-07.md`.
- Documentacao raiz/tecnica atualizada para registrar que a API Django/DRF nao e mais placeholder: auth, Google/Apple OIDC, devices, trusted contacts, invitations, consents, emergency sessions, key envelopes, P2P signals, audit, Admin e CRM inicial existem.
- Documentacao mobile atualizada: README, `docs/00_PLANO_MOBILE.md`, `docs/02_BACKLOG.md`, `docs/07_ARQUITETURA.md`, `docs/09_TESTES_QA.md`, `docs/10_DISTRIBUICAO_INSTALAVEIS.md`, `docs/23_ESPECIFICACAO_DESENVOLVIMENTO_APP.md`, `docs/29_PROXIMA_ETAPA_API_ANJOS.md`, `docs/32_PLANO_LOGIN_VIDEOCHAMADA_ANJOS_LOCALIZACAO.md` e `docs/03_TIMELINE.md`.
- API publica validada novamente: `health=ok` e readiness `database=ok`.
- Gates mobile desta atualizacao documental: `npm run typecheck`, `npm run lint` e `npm test` aprovados.
- Testes locais do backend nao foram repetidos porque `services/api/.venv` esta ausente apos higienizacao de dependencias regeneraveis.
- Proximo passo tecnico permanece: habilitar `Custom URI scheme` no OAuth Android privado do Google Cloud e repetir login fisico fim a fim.

## Memoria viva - 2026-05-07 - Callback Google Android corrigido

- Google Cloud: `Custom URI scheme` foi habilitado no OAuth Android privado do projeto `sinalseguro`, sem registrar Client ID real e sem ativar billing/free trial.
- Apos o ajuste externo, o OAuth deixou de bloquear em `Custom URI scheme is not enabled` e chegou ao seletor de conta/retorno com codigo.
- Novo bloqueio local identificado: o retorno `sinalseguro://oauthredirect?...` caia em `Unmatched Route` do Expo Router.
- Mobile corrigido: criado `app/oauthredirect.tsx`, `WebBrowser.maybeCompleteAuthSession()` movido para o layout raiz e fluxo Google passou a usar PKCE com estado efemero no SecureStore.
- A conclusao do login agora troca codigo por ID token, chama `POST /auth/google`, persiste JWT no SecureStore, valida usuario quando necessario e executa bootstrap autenticado de dispositivo/consentimentos.
- `node_modules` precisou ser recriado por `npm ci` porque pacotes Expo locais estavam incompletos apos reinstalacoes parciais.
- Gates aprovados: `npm run typecheck`, `npm run lint`, `npm test` e `npm run build:android:private`.
- API publica reconfirmada: `health=ok` e readiness `database=ok`.
- APK privado instalado no Android fisico, SHA-256 `669ccbc6a701b6f1ecec18d9bda93761074be3c754e918042e73e197b672d8b0`.
- Validacao fisica final esta bloqueada pelo keyguard/NotificationShade do aparelho; `wm dismiss-keyguard` nao desbloqueou. Ao desbloquear, repetir login Google e confirmar JWT, `auth/me`, `/devices/` e logout.

## Memoria viva - 2026-05-07 - OAuth Google publicado

- Google Auth Platform estava em `Testing`, restringindo acesso a usuarios de teste.
- Antes de publicar, a tela `Acesso a dados` foi conferida e nao listava escopos confidenciais nem restritos.
- O app OAuth foi publicado em producao para publico externo, sem billing/free trial e sem registrar Client ID real.
- ADB perdeu o dispositivo apos a publicacao; proxima validacao exige reconectar/desbloquear o Android fisico e repetir o login.

## Memoria viva - 2026-05-07 - Frente 1 Android concluida com Google Sign-In nativo

- Diagnostico final: no Android, o caminho por navegador/Custom URI continuou bloqueado pela politica de resposta segura do Google mesmo apos publicacao OAuth; Android passou para Google Sign-In nativo via Play Services.
- `@react-native-google-signin/google-signin` foi integrado ao app privado; `Configuracoes > Login` usa o fluxo nativo no Android e mantem AuthSession/PKCE como base futura/nao Android.
- Web Client ID foi criado para audiencia de ID token e guardado apenas em ambiente seguro local/EC2; valores reais, client secret, tokens, e-mails e payloads nao foram versionados nem documentados.
- EC2: somente `/etc/sinalseguro-api.env` do SinalSeguro recebeu a nova audiencia; apenas `sinalseguro-api` foi reiniciado. `cereusia-crm` permaneceu ativo e `cereusia.conf` nao foi alterado.
- Android fisico validado: seletor nativo de contas abriu, login Google emitiu sessao SinalSeguro, JWT interno foi persistido no SecureStore, `auth/me` validou a conta, `/devices/` registrou o dispositivo e logout revogou a sessao/refresh token interno.
- Logcat filtrado pelo processo do app nao registrou token, refresh token, access token, Client ID real ou e-mail.
- Gates aprovados: `npm run typecheck`, `npm run lint`, `npm test`, `git diff --check` e build Android privado.
- APK privado validado: SHA-256 `1ca183fe0c68bd4ad45f9330da1ef93ca14bbd1789d5ed0015eada2a19d4087f`.
- Pendencia Frente 1.1: par de chaves real do dispositivo, assinatura, rotacao, revogacao e perda de aparelho. Nao enviar push token nem chave privada.

## Memoria viva - 2026-05-07 - iOS logado e Android bloqueado corretamente

- iPhone fisico concluiu login Google no app privado; backend confirmou dispositivo iOS ativo, chave publica/hash presentes e push token ausente.
- Android foi recompilado com `npm run build:android:debug:bundled`, instalado via ADB Wi-Fi e abriu sem crash.
- `Configuracoes > Login` no Android mostrou Google Sign-In nativo configurado para Android.
- Com a mesma conta ativa no iPhone, o Android recebeu modal `Login bloqueado neste aparelho`, orientando logout no dispositivo ativo ou uso/criacao de outra conta.
- Backend confirmou evento recente `login_blocked_active_device` com ativo `ios` e tentativa `android`; estado permaneceu Android revogado e iOS ativo.
- Validacoes aprovadas: `npm run typecheck`, `npm run lint`, `npm test`, `manage.py test sinalseguro_api.tests.test_platform_base` e `git diff --check` em `apps/mobile`/`repos/empresa`.
- Regra operacional consolidada: ao alternar Android/iOS nesta maquina, limpar regeneraveis da plataforma anterior; scripts globais ficam em `scripts/` na raiz e devem ser comentados.
- Proxima frente recomendada: rede de anjos, convite, aceite, revogacao e chave publica real por dispositivo.

## Memoria viva - 2026-05-07 - Frentes globais reorganizadas

- Roberto redefiniu regras de pais, filhos, anjos, ocorrencia e midia antes da proxima implementacao.
- Documento canonico criado: `docs/tecnico/FRENTES_GLOBAIS_APP_BACKEND_MIDIA_ANJOS.md`.
- Proxima frente viavel passa a ser Frente 1.1: chaves reais por dispositivo, assinatura, rotacao, revogacao e perda de aparelho.
- Frente 1.2 fica dedicada a perfis, familia, maioridade e papeis: pais/responsaveis podem adicionar filhos menores como protegidos; filhos menores nao convidam anjos, nao sao anjos e so acionam pais/responsaveis ou conveniados autorizados.
- Frente 2 passa a ser rede de anjos e convites, depois de chaves reais e modelo familiar.
- Anjo adulto pode estar vinculado a varios usuarios, mas so atende uma ocorrencia ativa por vez; alternancia deve ser explicita e auditada.
- Background nao significa camera/microfone/GPS permanentes. Significa prontidao para acionar/receber ocorrencia; midia e localizacao so abrem durante ocorrencia ativa com permissao.
- Audio/video com anjos/responsaveis fica separado de localizacao. Localizacao vira Frente 6.
- Modulo atual de midia JS/Base64/loopback e prova tecnica; para chamada longa/conveniados/nuvem, refatorar para WebRTC nativo, gravacao segmentada, criptografia nativa por segmento e player nativo.

## Memoria viva - 2026-05-08 - Frente 1.2 iOS player sem midia

- Android fisico segue funcional para gravacao, cofre e Player Seguro cifrado.
- No iPhone Release, Roberto confirmou que a gravacao iniciava, mas o player/cofre mostravam `Sem midia`, `Nenhum video neste arquivo` e `Sem camera`.
- Container iOS confirmou `/Documents` sem `manifest.sseg`, chunks ou thumbnails apos o teste; player estava recebendo pacote sem asset.
- Diagnostico: falha antes do player, no encerramento/preservacao da captura iOS dependente de `recordAsync` longo/`stopRecording`.
- Correcao aplicada: `EmergencyMediaRecorder` grava segmentos curtos H.264 (`avc1`) no iOS e preserva cada segmento cifrado assim que fecha.
- `EvidencePlayerCard` diferencia segmentos repetidos da mesma camera por indice.
- Novo teste mostrou que o SOS anterior persistia apos reinstalacao e o encerramento ainda demorava; causa adicional no fluxo: `HomeScreen` aguardava a camera parar antes de chamar `finishEmergencyPackage`.
- Registro historico: o botao seguro chegou a finalizar o pacote imediatamente, sinalizar a camera em paralelo e permitir anexo tardio quando o iOS devolvesse arquivo.
- Validacoes locais aprovadas: `npm run typecheck`, `npm run lint`, `npm test` e `git diff --check`.
- Build `Release` iOS aprovado e instalado no iPhone fisico; `devicectl` sem provider CoreDevice; launch/debug via `ios-deploy` bloqueado pelo lockscreen.
- Proxima retomada: iPhone desbloqueado, abrir app, executar SOS >= 12s, encerrar pelo botao sem espera longa, conferir `manifest.sseg`/chunks em `/Documents` e validar player no primeiro segmento.

## Memoria viva - 2026-05-08 - Frente 1.2 iOS qualidade 4:3 e diagnostico de captura

- Novo teste manual de Roberto no iPhone: SOS durou mais de 30s, botao encerrou corretamente, mas o cofre/player ainda mostraram `Sem midia`.
- Coleta local de preferencias mostrou camera frontal; causa nao e modo `both`.
- Tipagem local do `expo-camera` indicou que `480p` e qualidade Android; Cristine ajustou `EmergencyMediaRecorder` para `videoQuality="4:3"` no iOS e `480p` no Android.
- Adicionado diagnostico persistido no pacote sem asset: `camera_mount_error`, `camera_no_file_returned`, `camera_recording_error` ou `media_permissions_denied`.
- `LocalEvidenceRail` e `EvidencePlayerCard` exibem a causa tecnica saneada quando nao ha video, sem URI/caminho/chave/token/coordenada/e-mail/IP/payload.
- `MediaDiagnostics` ganhou etapa `capture_mount`; snapshots continuam locais, saneados e sem rede.
- Validacoes apos patch: `npm run typecheck`, `npm run lint` e `npm test` aprovados.
- Build `Release` iOS recompilado e instalado; launch automatico falhou porque o iPhone estava travado.
- Pesquisa controle iPhone: iPhone Mirroring exige iOS 18+ e nao serve para este iPhone 8 Plus/iOS 16.7.15; QuickTime/AirPlay so espelham; Appium 2 + XCUITest e a rota correta, mas WDA ainda falha ao iniciar runner no aparelho fisico apesar de compilar.
- Proxima acao de Cristine: com iPhone desbloqueado, validar SOS 20s+; se vier `Protegido`, testar Player Seguro; se vier causa tecnica, coletar container e seguir para preview iOS maior/visivel ou codec default antes de modulo nativo.

## Memoria viva - 2026-05-08 - Frente 1.2 iOS Debug operacional

- Novo teste fisico no iPhone as 07:56 continuou `Sem midia`.
- Container apos o teste: sem `manifest.sseg`, chunks, thumbnail ou arquivo em `Library/Caches/Camera`; falha segue antes do player e antes da criptografia de playback.
- Appium foi atualizado para Appium 3 + XCUITest driver recente, mas WebDriverAgent segue bloqueado pelo Xcode com erro de runner no iPhone fisico.
- Criado `MediaOperationalLog`: JSONL persistente iOS em `Documents/sinalseguro-debug/media-operational-log.jsonl`, limitado e saneado.
- Instrumentados SOS, readiness/permissao de camera, `recordAsync`, stop, preservacao, cifragem de chunks, verificacao e pacote sem asset.
- Build iOS `Debug` com bundle embutido foi compilado e instalado via USB no iPhone fisico.
- Gates apos patch: `npm run typecheck`, `npm run lint`, `npm test` e `git diff --check` aprovados.
- Proxima acao: Roberto executar novo SOS no iPhone com build Debug; Cristine puxar o JSONL e corrigir conforme causa tecnica, priorizando preview iOS visivel/tamanho real ou codec default antes de modulo nativo.

## Memoria viva - 2026-05-08 - Frente 1.2 iOS causa isolada por JSONL

- JSONL operacional baixado do iPhone confirmou permissao/camera prontas e `recordAsync` iniciado.
- No encerramento, houve `capture_stop_requested` com zero assets e desmontagem do componente com `recordingActive=true`.
- Nao houve `capture_record_async_result`, `capture_preserve_start`, `capture_preserve_success` ou `capture_effect_finalized` antes do pacote ficar `Sem midia`.
- Causa classificada: `HomeScreen` finalizava o pacote/desmontava o gravador antes de a captura iOS devolver o arquivo nativo.
- Correcao: `HomeScreen` sinaliza stop, aguarda `waitForMediaRecorderStop` ate 9s e so entao chama `finishEmergencyPackage`.
- `EmergencyMediaRecorder` liquida o stop com `attached`, `empty`, `error` ou `idle`; timeout gera `emergency_media_stop_timeout` saneado.
- Smoke test passou a garantir que `waitForMediaRecorderStop` venha antes de `finishEmergencyPackage`.
- Validacoes aprovadas: `npm run typecheck`, `npm run lint`, `npm test`, build iOS `Release`, instalacao fisica no iPhone e `git diff --check`.
- Instalacao Release foi concluida; auto-launch foi bloqueado porque o iPhone estava travado.
- Proxima acao: desbloquear iPhone, abrir SinalSeguro, SOS 20s+, encerrar pelo botao, conferir cofre/player e baixar JSONL se ainda aparecer `Sem midia`.

## Memoria viva - 2026-05-08 - Frente 1.2 iOS `recordAsync` falha rapido

- Roberto testou as 10:35 e o app mostrou `Gravacao de video interrompida pela camera`.
- JSONL confirmou que a camera ficou pronta, mas `recordAsync` falhou imediatamente no segmento 0, antes de preservacao/chunks.
- No encerramento, o gravador ja estava `idle`, portanto este teste nao era mais o bug de desmontagem no stop.
- O log tambem mostrou duas tentativas de inicio antes de o primeiro pacote concluir criacao.
- Correcao aplicada: `startInProgress` bloqueia duplo acionamento; iOS espera warm-up antes de `recordAsync`; falha rapida do `recordAsync` ganha retry controlado.
- Novo motivo saneado: `camera_output_not_ready`, exibido como camera ainda inicializando quando aplicavel.
- Gates locais apos patch: `npm run typecheck`, `npm run lint`, `npm test`, `git diff --check`.

## Memoria viva - 2026-05-08 - Frente 1.2 iOS gargalo de preservacao

- Novo teste 11:16 confirmou que o iPhone gravou arquivo temporario e criou chunks cifrados; o bug deixou de ser camera/player.
- Evidencia JSONL: fonte temporaria ~4,8 MB, 10 chunks, criptografia ~29s, verificacao completa ~27s, anexo no cofre apenas depois do timeout de encerramento.
- Container confirmou `manifest.sseg`, chunks e thumbnail cifrada no app, entao o pacote apareceu `Sem midia` porque o indice foi atualizado tarde.
- Hotfix aplicado: iOS H.264 `avc1`, `480p`, bitrate alvo 650 kbps, chunks iOS de 2 MB e verificacao `bounded`.
- `HomeScreen` agora bloqueia multiplos encerramentos por ref sincrona, aguarda ate 30s e exibe mensagem correta quando a midia ainda esta sendo protegida.
- Decisao: correcao incremental para homologacao; producao ainda exige captura/criptografia/player nativos por segmento.
- Gates locais apos patch: `npm run typecheck`, `npm run lint`, `npm test`, `git diff --check`.

## Memoria viva - 2026-05-08 - Frente 1.2 iOS ciclo continuo saturava encerramento

- Novo teste fisico apos o hotfix mostrou que o iPhone ja criava manifests, chunks e thumbnails cifrados no container.
- O JSONL mais recente nao registrou `emergency_finish_button_pressed` antes da coleta, mas mostrou varios ciclos sucessivos de `recordAsync`, preservacao, cifragem e verificacao.
- Diagnostico: o app nao estava mais falhando por ausencia de camera/player; estava saturando o JS com captura/criptografia/verificacao continua em iOS, atrasando ou impedindo o handler de encerramento.
- Correcao aplicada: iOS fisico de homologacao preserva um unico segmento curto H.264/480p por chamado e registra `capture_ios_segment_limit_reached`, mantendo o chamado ativo sem ciclo pesado de camera.
- Cofre/player atualizam pacotes ao abrir modais e a home limpa residuos de camera quando nao ha chamado ativo.
- Myers/Schneier: contencao incremental para homologacao; gravacao real de varios minutos continua exigindo modulo nativo de captura, criptografia por segmento e player/data source nativo.
- Frente 1.1 permanece fechada/intocada.

## Memoria viva - 2026-05-09 - Frente 1.2 ponte nativa persistente

- Regeneraveis foram limpos antes da implementacao: script global removeu `ios/Pods`, derived data iOS temporario e xcconfig temporario; limpeza adicional removeu caches Gradle/npm para chegar ao gate Android.
- Implementado `SinalSeguroMediaEngine` como ponte JS e config plugin persistente, porque `android/` e `ios/` sao ignorados/regeneraveis no repo.
- Android nativo compila com AES-256-GCM por segmento, storage privado obrigatorio, handles de playback saneados e limpeza de residuos nativos.
- iOS nativo ficou em templates Swift/ObjC sincronizados pelo plugin; build iOS nao foi executado porque `ios/Pods` foi removido e o espaco livre apos Android ficou abaixo de 14 GiB.
- Player Seguro agora tenta `native_encrypted_source` apenas para ativos `native_segmented_v1`; ativos atuais `js_chunked_v1` continuam no loopback de homologacao.
- Envelopes de midia ganharam `storageEngine`, `keyId`, `emergencySessionId`, `envelopeScope` e `nativePlayback` para P2P futuro sem mudar Frente 1.1.
- Gates locais aprovados: `npm run typecheck`, `npm run lint`, `npm test`, `npm run test:crypto`, `npm run test:device-keys` e `git diff --check`.
- Build Android privado aprovado: `distribution/android/out/sinalseguro-android.apk`, SHA-256 `9d60f820a4dc8d9556482df957b409637b111ab5988a0e8122da6cc03879f9bc`.
- Visual web local verificado em Home SOS, Player Seguro e Cofre local; sem quebra visual aparente.
- Proxima retomada: liberar 14 GiB+, reinstalar Pods, rodar build iOS, depois testes fisicos 30s/60s/3min/5min Android e iPhone validando residuos claros, tempo ate primeiro frame e logs saneados.

## Memoria viva - 2026-05-10 - Frente 1.2 interrupcao preservada

- Roberto confirmou que o bug de encerramento lento persistia no Android e tambem no iPhone; nao tratar a frente como concluida sem novo teste fisico.
- O teste Android anterior ao ultimo patch instalou APK no `23129RA5FL`; o modal de encerramento apareceu, mas ficou em 24% e o topo ainda mostrava `CHAMADO ATIVO`.
- Logcat do teste anterior indicou fechamento tardio de CameraX e `Recorder: stop() called on a recording that is no longer active`, sem crash fatal React no recorte observado.
- Apos esse teste, a Home passou a tirar o pacote do estado visual ativo imediatamente, manter o recorder montado por `mediaRecorderPackageId` e anexar midia tardia em paralelo.
- `FinishProgressDialog` informa encerramento/protecao da midia, com progresso e estados saneados, e impede novo SOS enquanto ha midia pendente.
- Android foi alinhado ao iOS no perfil conservador de homologacao: segmentos curtos de 12s, 480p e bitrate alvo 650 kbps.
- `PanicButton` ganhou fallback `onLongPress` nativo e guarda contra duplo disparo, melhorando teste por ADB e acessibilidade sem alterar a intencao da UX.
- `captureProfile` passou a registrar compatibilidade de camera/hardware e metadados preparatorios de envelope/P2P sem implementar chamada real.
- Player Seguro teve ajuste de timeline por estado e polling mais frequente nos primeiros segundos.
- Validacoes locais apos a ultima correcao: `npm run typecheck`, `npm run lint`, `npm test -- --runInBand` e `git diff --check` aprovados.
- APK mais recente: `distribution/android/out/sinalseguro-android.apk`, SHA-256 `d00beb8f7b551300a1f750ca059ad294f040947d796868176124eb44003df9f4`.
- Proxima retomada: checar espaco com `df -h /`, instalar/testar esse APK ou rebuildar se houver nova mudanca, coletar screenshots imediato/2s/8s/fim, revisar logcat, residuos `.mp4` claros e timeline do player.
- Nao avancar para UI final de chamada P2P/anjo; apenas preservar compatibilidade de captura/envelope e liberacao correta de camera/microfone para a proxima frente.

## Memoria viva - 2026-05-10 - Frente 1.2 midia nativa salva

- A retomada nao aplicou o pacote externo literalmente: `SinalSeguroMediaEngine` ficou como rota principal propria do app, com JS/Base64/loopback somente como fallback legado/homologacao.
- `preserveLocalVideoAsset` agora roteia ativo novo para `native_segmented_v1` quando o modulo nativo esta disponivel; o envelope registra `aes-256-gcm`, `storageEngine`, `playbackAdapter`, `nativePlayback`, `processingState`, `captureProfile`, `keyId`, `packageId` e `emergencySessionId` opcional.
- Android nativo passou a cifrar em blocos com AES-256-GCM, calcular hashes incrementalmente e restringir entrada/saida ao sandbox privado.
- iOS tem template nativo AES-GCM e cache protegido/no-backup para playback, mas ainda nao deve ser aprovado para midia longa enquanto a implementacao de template usar leitura integral do arquivo.
- `FinishProgressDialog` mostra estados explicitos de encerramento/protecao; apos camera liberada, o app pode seguir com progresso discreto e bloqueia novo SOS ate estado final ou limpeza pendente.
- Player Seguro prepara MP4 temporario reproduzivel em cache privado, com barra de preparo, TTL de 10 minutos, limpeza ao fechar/trocar/background e limpeza de boot em Home/Arquivos.
- Android fisico `23129RA5FL` recebeu o APK final e passou no teste curto: saida visual de `CHAMADO ATIVO` em ate 0,5s, cofre com midia protegida, player com fonte preparada e timeline funcional.
- Inventario Android saneado confirmou 0 midias claras persistentes apos fechamento do player e limpeza de MP4 temporario artificial apos relaunch estabilizado.
- Validacoes aprovadas: `npm run typecheck`, `npm run lint`, `npm test`, `npm run test:crypto`, `npm run test:device-keys`, `npm run private:android:readiness`, `npm run build:android:private` e `git diff --check`.
- APK Android final desta rodada: `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256 `5e664df9a9982569a0ce05e737af01fcc105057d892438e10ffbe07ac1f28afd`.
- Evidencia versionavel ficou apenas em `docs/evidencias/android/2026-05-10-frente-1-2-native/inventario-saneado.txt`; capturas PNG/XML e logcat detalhado foram removidos por conterem contexto pessoal ou risco de exposicao.
- Proxima retomada: nao reimplementar o que ja passou; repetir Android 60s/3min/5min, iPhone fisico, logs saneados, residuos claros, tempo ate primeiro frame e liberacao de camera/microfone antes de fechar a Frente 1.2.

## Memoria viva - 2026-05-13 - Android MVP validado para aceite manual

- A decisao vigente e Android primeiro; iPhone/iOS fica pos-MVP e nao deve bloquear o aceite Android.
- Especialistas acionados nesta retomada: Katia/mobile, Eliane+Lina/QA-UX e Cristine/security; conclusao conjunta foi validar Android fisico antes de liberar teste manual de Roberto.
- Ajuste de seguranca aplicado: `SinalSeguroMediaEngineModule.kt` Android aceita origem apenas em `filesDir`, `cacheDir` e `noBackupFilesDir`; `externalCacheDir` e `getExternalFilesDir` foram bloqueados tambem pelo smoke test.
- APK Android privado instalado e validado no `23129RA5FL`: SHA-256 `50fe4c831174899e5728579709ec906470c6c55d4aad1f205c162da1be0444db`.
- Validacoes: `typecheck`, `lint`, `test`, `private:android:readiness`, `build:android:private`, `git diff --check`.
- Ciclo fisico principal: SOS -> chamado ativo -> encerramento -> `Video protegido` -> cofre como `1 video` -> player unificado reproduzindo ate pelo menos `0:23 / 1:46`.
- Ciclos fisicos curtos pos-rebuild confirmaram reentrada da camera/microfone, nova finalizacao protegida, `Continuar` retornando para Home, cofre com `Video 31s`/`1 video` e player final iniciando reproducao.
- Inventario saneado pos-rebuild: 418 arquivos, 375 `.sseg`, 22 `.nseg`, 0 midias claras persistentes `.mp4/.mov/.m4v/.3gp/.avi/.webm`.
- Evidencias locais: `docs/evidencias/android/2026-05-13-frente-1-2-validacao-fisica/`.
- Proxima acao: Roberto testar manualmente no Android instalado; se aprovado, fechar Frente 1.2 como base Android do MVP e seguir para a proxima frente Android.

## Memoria viva - 2026-05-13 - pausa operacional e reciclaveis Android

- Roberto pausou esta frente para demanda paralela de portal web governo/business; nao executar nada de portal neste contexto.
- Higienizacao Android executada por script versionado com escopo reciclavel: `.expo`, `android/.gradle`, `android/app/.cxx`, `android/app/build`, `android/build`.
- Resultado: 5 itens removidos, 0 falhas, 2.5 GiB de variacao real; script reportou 6.6 GiB livres e conferencia final posterior indicou 6.3 GiB livres.
- Checkpoint versionavel em `docs/35_CHECKPOINT_PAUSA_FRENTE_1_2_HIGIENIZACAO_ANDROID_2026-05-13.md`.
- APK local removido como regeneravel; app instalado no Android fisico permanece. Rebuild privado sera necessario apenas se houver reinstalacao.

## Memoria viva - 2026-05-13 - aceite manual da Frente 1.2 Android

- Roberto validou e aprovou manualmente a Frente 1.2 no Android.
- Frente 1.2 fica encerrada no escopo Android do MVP; iOS permanece pos-MVP.
- A proxima frente segura e Frente 1.3, porque P2P/anjos/conveniados dependem de papeis, responsaveis, maioridade, consentimentos e autorizacoes.

## Memoria viva - 2026-05-13 - abertura da Frente 1.3

- Frente 1.3 iniciada com especialistas de produto/rastreabilidade, mobile/API, LGPD/seguranca e UX/QA.
- Decisao consolidada: comecar por politica de dominio e bloqueios de papel, nao por P2P, chamada, upload, localizacao ao vivo ou conveniados.
- Primeira fatia mobile implementada: `profilePolicy`, `profileStore`, tela `Perfis`, gate em `Anjos` antes de criar convite e gate em `Convite recebido` antes de aceitar como anjo.
- Menor protegido fica bloqueado para criar convite e para atuar como anjo; perfil ausente tambem bloqueia.
- Dados minimizados: sem documento, data de nascimento completa, endereco, agenda, telefone de terceiros, relato sensivel, localizacao continua ou midia enviada.
- Gates aprovados: `test:profiles`, `typecheck`, `lint`, `smoke-test`, `npm test`, `private:android:readiness` condicionado e `git diff --check`.
- Checkpoint: `docs/38_CHECKPOINT_ABERTURA_FRENTE_1_3_PERFIS_PAPEIS_2026-05-13.md`.
- Proximo passo: backend server-side para perfis, responsavel-protegido, autorizacoes por escopo e bloqueios de menoridade.

## Memoria viva - 2026-05-13 - backend da Frente 1.3 publicado

- Backend server-side de perfis/autorizacoes implementado e publicado na EC2 do SinalSeguro.
- `profiles` adiciona perfil da conta, protegido, vinculo responsavel-protegido e autorizacao por escopo.
- Convite backend exige perfil permitido; menor protegido e perfil ausente bloqueiam; responsavel por menor exige protegido/vinculo/autorizacao ativos.
- `can_receive_media`, `can_receive_location`, key envelopes e P2P seguem bloqueados nesta frente.
- App Android sincroniza perfil local com `/api/profiles/me` antes de criar convite backend.
- Checkpoint: `docs/39_CHECKPOINT_FRENTE_1_3_BACKEND_PERFIS_AUTORIZACOES_2026-05-13.md`.
- Proximo passo: build/install Android privado e validacao visual/manual contra EC2 real.

## Memoria viva - 2026-05-21 - refatoracao Anjos/Convites sem build

- Build Android ficou pausado por orientacao de Roberto; nao compilar nem instalar ate nova retomada explicita.
- Etapas 1.97 e 1.98 extraem regras puras de apresentacao da tela `Anjos de confianca` para `trustedAngelsPresentationPolicy`.
- `app/contatos.tsx` segue como orquestrador visual e operacional; API/cache/share/revogacao permanecem nele.
- Novo gate `npm run test:trusted-angels-presentation` cobre convites e vinculos exibidos ao usuario e esta integrado ao `npm test`.
- Validacoes aprovadas: teste focado, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.

## Memoria viva - 2026-05-21 - merge/listagem Anjos/Convites sem build

- Etapas 1.99 e 1.100 extraem merge/listagem da tela `Anjos de confianca` para `trustedAngelsListPolicy`.
- `mergeTrustedAngelInvitations()` preserva deduplicacao local/remota e oculta convites de contatos aceitos/revogados.
- `buildTrustedAngelRelationshipLists()` preserva listas de meus anjos e sou anjo; `splitTrustedAngelInvitationSections()` preserva secoes e contador.
- Novo gate `npm run test:trusted-angels-list` cobre as regras e esta integrado ao `npm test`.
- ADB listou o Android `23129RA5FL` via Wi-Fi/mDNS duplicado, mas nao houve build/instalacao porque a fatia e pura.

## Memoria viva - 2026-05-21 - acoes Anjos/Convites sem build

- Etapas 1.101 e 1.102 extraem decisoes puras dos handlers de convite/revogacao para `trustedAngelsActionPolicy`.
- `app/contatos.tsx` ainda executa API real, Share, storage local, cache, refresh e estado React.
- Novo gate `npm run test:trusted-angels-action` cobre bloqueio por perfil, label saneado, sessao expirada e planos de revogacao.
- Validacoes aprovadas: teste focado, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.
- Sem build/instalacao Android porque a fatia e pura e nao altera runtime fisico.

## Memoria viva - 2026-05-21 - refresh Anjos/Convites sem build

- Etapas 1.103 e 1.104 extraem decisoes puras de refresh para `trustedAngelsRefreshPolicy`.
- `app/contatos.tsx` ainda executa API real, cache real, storage local, timers, AppState e estado React.
- Novo gate `npm run test:trusted-angels-refresh` cobre refresh visivel/silencioso, cache offline, sessao ausente, falha local e painel por parametro.
- Validacoes aprovadas: teste focado, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.
- Sem build/instalacao Android porque a fatia e pura e nao altera runtime fisico.

## Memoria viva - 2026-05-21 - dashboard Anjos/Convites sem build

- Etapas 1.105 e 1.106 extraem decisoes puras de resumo dos cards e prontidao para `trustedAngelsDashboardPolicy`.
- `app/contatos.tsx` ainda renderiza os mesmos componentes, icones, modais, navegacao e handlers reais.
- Novo gate `npm run test:trusted-angels-dashboard` cobre convite bloqueado/API/local, busy/sync, contadores e prontidao conta/dispositivo/API.
- Validacoes aprovadas: teste focado, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.
- Sem build/instalacao Android porque a fatia e pura e nao altera runtime fisico.

## Memoria viva - 2026-05-21 - dialogs Anjos/Convites sem build

- Etapas 1.107 e 1.108 extraem decisoes puras de visibilidade de dialogs/paineis e acao de convite para `trustedAngelsDialogPolicy`.
- `app/contatos.tsx` ainda executa os mesmos cliques, handlers, revogacoes, navegacao e estado React.
- Novo gate `npm run test:trusted-angels-dialog` cobre visibilidade dos dialogs/paineis e acao de revogar apenas para convites `pendente` ou `compartilhado`.
- Validacoes aprovadas: teste focado, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.
- Sem build/instalacao Android porque a fatia e pura e nao altera runtime fisico.

## Memoria viva - 2026-05-21 - paineis Anjos/Convites sem build

- Etapas 1.109 e 1.110 extraem modelos puros dos paineis de vinculos e convites para `trustedAngelsPanelPolicy`.
- `app/contatos.tsx` ainda renderiza os mesmos componentes, icones, cards, cliques, handlers, navegacao e estado React.
- Novo gate `npm run test:trusted-angels-panel` cobre estados vazios de vinculos, secoes de convites e estado vazio de convites.
- Validacoes aprovadas: teste focado, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.
- Sem build/instalacao Android porque a fatia e pura e nao altera runtime fisico.

## Memoria viva - 2026-05-21 - contadores e refresh Anjos/Convites sem build

- Etapas 1.111 e 1.112 extraem contadores aceitos e decisao de refresh por AppState para policies puras.
- `app/contatos.tsx` ainda controla timers, AppState, refresh real, estado React, renderizacao e handlers.
- Gates focados: `npm run test:trusted-angels-dashboard` e `npm run test:trusted-angels-refresh`.
- Validacoes aprovadas: teste focado, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.
- Sem build/instalacao Android porque a fatia e pura e nao altera runtime fisico.

## Memoria viva - 2026-05-21 - navegacao e dialog labels Anjos/Convites sem build

- Etapas 1.113 e 1.114 extraem decisao de navegacao do menu e labels de acoes dos dialogs para policies puras.
- `trustedAngelsNavigationPolicy` nao executa navegacao real; apenas retorna o alvo que `app/contatos.tsx` aplica com `router.push`.
- `trustedAngelsDialogPolicy` preserva os mesmos textos publicos dos botoes de criar convite, revogar convite e revogar vinculo.
- Gates focados: `npm run test:trusted-angels-navigation` e `npm run test:trusted-angels-dialog`.
- Validacoes aprovadas: teste focado, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.
- Sem build/instalacao Android porque a fatia e pura e nao altera runtime fisico.

## Memoria viva - 2026-05-21 - cards dashboard Anjos/Convites sem build

- Etapas 1.115 e 1.116 extraem modelo e acoes dos 8 cards principais para `trustedAngelsDashboardPolicy`.
- A policy nao executa navegacao, dialog, painel ou refresh; apenas retorna alvos para `app/contatos.tsx` aplicar.
- Os textos publicos e icones visuais foram preservados; `app/contatos.tsx` ainda renderiza os icones reais.
- Gate focado: `npm run test:trusted-angels-dashboard`.
- Validacoes aprovadas: teste focado, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.
- Sem build/instalacao Android porque a fatia e pura e nao altera runtime fisico.

## Memoria viva - 2026-05-21 - presentation policy Configuracoes sem build

- Etapas 1.117 e 1.118 iniciam a refatoracao de `Configuracoes` extraindo status/labels, paineis, termos e ajuda para `settingsPresentationPolicy`.
- A policy nao executa login, API, permissoes, storage, camera, microfone, localizacao ou navegacao; apenas preserva textos e decisoes de apresentacao.
- Smoke atualizado para validar `settingsLegalConsentItems` como fonte do resumo visivel de termos antes do aceite local.
- Gate focado: `npm run test:settings-presentation`.
- Validacoes aprovadas: teste focado, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.
- Sem build/instalacao Android porque a fatia e pura e nao altera runtime fisico.

## Memoria viva - 2026-05-21 - cards dashboard Configuracoes sem build

- Etapas 1.119 e 1.120 extraem modelo e acoes dos 8 cards principais para `settingsPresentationPolicy`.
- A policy nao executa `setActivePanel`, navegacao, login, API, permissoes, storage, camera, microfone, localizacao ou atualizacao real; apenas retorna alvos puros de painel.
- Os textos publicos e icones visuais foram preservados; `app/configuracoes.tsx` ainda renderiza os icones reais.
- Gate focado: `npm run test:settings-presentation`.
- Validacoes aprovadas: teste focado, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.
- Sem build/instalacao Android porque a fatia e pura e nao altera runtime fisico.

## Memoria viva - 2026-05-21 - localizacao e codigo Configuracoes sem build

- Etapas 1.121 e 1.122 extraem textos/status de localizacao e codigo de seguranca para `settingsPresentationPolicy`.
- A policy nao solicita permissao, nao abre ajustes do sistema, nao valida codigo, nao gera hash, nao limpa acesso protegido e nao persiste preferencias; apenas retorna apresentacao pura.
- Os textos publicos e fluxos de botoes foram preservados; `app/configuracoes.tsx` ainda executa todos os efeitos reais.
- Gate focado: `npm run test:settings-presentation`.
- Validacoes aprovadas: teste focado, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.
- Sem build/instalacao Android porque a fatia e pura e nao altera runtime fisico.

## Memoria viva - 2026-05-22 - compartilhamento e video Configuracoes sem build

- Etapas 1.123 e 1.124 extraem modelos de apresentacao dos paineis `Compartilhamento` e `Video local` para `settingsPresentationPolicy`.
- A policy nao liga 190, nao alterna stream para anjos, nao salva midia, nao solicita camera/microfone, nao troca camera e nao persiste preferencias; apenas retorna labels, bloqueios e chaves de acao.
- Os bloqueios publicos de atalho de anjo e 190 pelo anjo foram preservados e agora validados no smoke pela policy.
- Gate focado: `npm run test:settings-presentation`.
- Validacoes aprovadas: teste focado, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.
- Sem build/instalacao Android porque a fatia e pura e nao altera runtime fisico.

## Memoria viva - 2026-05-22 - atualizacao e login Configuracoes sem build

- Etapas 1.125 e 1.126 extraem modelos de apresentacao dos paineis `Atualizacao` e `Login` para `settingsPresentationPolicy`.
- A policy nao valida sessao, nao autentica, nao faz logout, nao chama API, nao abre portal, nao acessa storage e nao altera dispositivo; apenas retorna labels, estados visuais e bloqueios de botoes.
- O contrato de bootstrap/logout permanece na tela e o texto de dispositivo autenticado agora e validado no smoke pela policy.
- Gate focado: `npm run test:settings-presentation`.
- Validacoes aprovadas: teste focado, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.
- Sem build/instalacao Android porque a fatia e pura e nao altera runtime fisico.

## Memoria viva - 2026-05-22 - acoes update/login Configuracoes sem build

- Etapas 1.127 e 1.128 extraem acoes tipadas dos paineis `Atualizacao` e `Login` para `settingsPresentationPolicy`.
- A policy nao executa rede, autenticacao, logout, bootstrap, storage, portal ou provedores externos; apenas retorna chaves, labels, icones simbolicos, estilos e bloqueios.
- `app/configuracoes.tsx` manteve os handlers reais e passou a rotear as intencoes por `handleUpdatePanelAction()` e `handleLoginPanelAction()`.
- O smoke passou a exigir as chaves `verify-update`, `download-update` e `validate-session` para evitar regressao de contrato.
- Gate focado: `npm run test:settings-presentation`.
- Validacoes aprovadas: teste focado, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.
- Sem build/instalacao Android porque a fatia e pura e nao altera runtime fisico.

## Memoria viva - 2026-05-22 - preferencias compartilhamento/video Configuracoes sem build

- Etapas 1.129 e 1.130 extraem decisoes puras de preferencias de `Compartilhamento` e `Video local` para `settingsPresentationPolicy`.
- A policy nao persiste, nao solicita permissao, nao ativa camera/microfone e nao chama API; apenas monta `nextPreferences` e `message`.
- `app/configuracoes.tsx` manteve `updatePreferences()` e permissoes reais como efeitos do componente.
- O smoke passou a exigir `homologation_blocked` para stream de anjos e `enabled_local` para video local.
- Gate focado: `npm run test:settings-presentation`.
- Validacoes aprovadas: teste focado, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.
- Sem build/instalacao Android porque a fatia e pura e nao altera runtime fisico.

## Memoria viva - 2026-05-22 - termos/duracao Configuracoes sem build

- Etapas 1.131 e 1.132 extraem estado/acao visual de `Termos e privacidade` e acoes tipadas de `Tempo de gravacao` para `settingsPresentationPolicy`.
- A policy nao aceita termos, nao registra data, nao persiste duracao e nao acessa storage; apenas retorna itens, labels, chaves e estilo selecionado.
- `app/configuracoes.tsx` manteve `acceptLegalConsent()`, `acceptedAt`, `updateDuration()` e `updatePreferences()` como efeitos reais.
- O smoke passou a exigir `buildSettingsLegalPanelState`, `handleLegalPanelAction`, `buildSettingsDurationPanelState` e `handleDurationPanelAction`.
- Gate focado: `npm run test:settings-presentation`.
- Validacoes aprovadas: teste focado, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.
- Sem build/instalacao Android porque a fatia e pura e nao altera runtime fisico.
- Tela `Configuracoes` encerrada nesta fase principal da refatoracao.

## Memoria viva - 2026-05-22 - apresentacao de Alertas recebidos sem build

- Etapas 1.133 e 1.134 iniciam `app/alerta.tsx` extraindo apresentacao pura para `receivedAlertPresentationPolicy`.
- A policy nao consulta API, nao aceita/recusa pedido, nao inicia WebRTC, nao dispara notificacao, nao grava, nao compartilha e nao persiste registro; apenas calcula textos, labels, ordenacao e gates visuais derivados.
- `app/alerta.tsx` manteve os efeitos reais e o bloqueio de uma chamada ativa por vez.
- O smoke passou a aceitar os textos contratuais de anjo/chamada na policy e continua exigindo API, autoaceite autorizado, notificacao, arquivo local e tempo real na tela.
- Gate focado: `npm run test:received-alert-presentation`.
- Validacoes aprovadas: teste focado, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.
- `typecheck` nao emitiu erro, mas ficou sem saida e ocioso por mais de 1 minuto; foi encerrado para nao deixar processo pendurado.
- Sem build/instalacao Android porque a fatia e pura e nao altera runtime fisico.

## Memoria viva - 2026-05-22 - runtime de Alertas recebidos sem build

- Etapas 1.135 e 1.136 extraem guardas puros e decisoes de arquivo local para `receivedAlertRuntimePolicy`.
- A policy nao autoaceita, nao notifica, nao chama API, nao inicia WebRTC, nao grava, nao compartilha, nao persiste e nao reseta chamada; apenas calcula decisoes para a tela executar.
- `app/alerta.tsx` manteve autoaceite/notificacao explicitamente na tela, seguindo o limite recomendado por Cristine/Eliane.
- O smoke passou a exigir a nova policy e os checks de arquivo local/tempo real continuam ancorados na tela.
- Gate focado: `npm run test:received-alert-runtime`.
- Validacoes aprovadas: teste focado, `test:received-alert-presentation`, `test:live-call-history`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.
- `typecheck` nao emitiu erro, mas ficou sem saida e ocioso por mais de 1 minuto; foi encerrado para nao deixar processo pendurado.
- Sem build/instalacao Android porque a fatia e pura e nao altera runtime fisico.

## Memoria viva - 2026-05-22 - feedback de Alertas recebidos sem build

- Etapas 1.137 e 1.138 extraem somente feedback puro para `receivedAlertPresentationPolicy`: status, labels de resposta, dialogs de erro e fallback de mensagem.
- Efeitos de risco permanecem na tela: API, autoaceite, notificacao, WebRTC, arquivo local, refs mutaveis, reset de chamada, Share e estado React.
- Nao houve novo segredo, token, credencial, SDP, ICE, payload P2P, path local, coordenada ou conteudo de midia.
- Inspecao sensivel nos arquivos tocados retornou apenas falsos positivos esperados.
- Validacoes aprovadas: `test:received-alert-presentation`, `test:received-alert-runtime`, `smoke-test`, `lint`, `private:android:readiness`, `npm test` e `git diff --check`.
- `typecheck` nao emitiu erro, mas ficou sem saida e ocioso por mais de 1 minuto; foi encerrado para nao deixar processo pendurado.

## Memoria viva - 2026-05-22 - acoes e historico de Alertas recebidos sem build

- Etapas 1.139 e 1.140 extraem somente estado/apresentacao puros para `receivedAlertPresentationPolicy`: acoes do alerta, bloqueios de chamada e card de historico local.
- Efeitos de risco permanecem na tela: API, autoaceite, notificacao, WebRTC, arquivo local, refs mutaveis, reset de chamada, Share, selecao de registro e estado React.
- Contratos de seguranca preservados: outra chamada ativa bloqueia entrada, `Set` local nao e mutado pela policy, historico nao duplica texto de compartilhamento e restricao legal aparece literalmente no card.
- Nao houve novo segredo, token, credencial, SDP, ICE, payload P2P, path local, coordenada ou conteudo de midia.
- Inspecao sensivel nos arquivos tocados retornou apenas falsos positivos esperados.
- Validacoes aprovadas: `test:received-alert-presentation`, `test:received-alert-runtime`, `smoke-test`, `lint`, `private:android:readiness`, `npm test` e `git diff --check`.
- `typecheck` nao emitiu erro, mas ficou sem saida e ocioso por mais de 1 minuto; foi encerrado para nao deixar processo pendurado.

## Memoria viva - 2026-05-22 - componentes locais de Alertas recebidos sem build

- Etapas 1.141 e 1.142 extraem somente componentes locais de apresentacao: `ReceivedAlertCardView` e `ReceivedCallArchiveCardView`.
- Efeitos de risco permanecem na tela: API, autoaceite, notificacao, WebRTC, arquivo local, refs mutaveis, reset de chamada, Share, selecao de registro e estado React.
- Os componentes recebem callbacks injetados, nao calculam runtime, nao persistem dados, nao geram texto de compartilhamento e nao acessam midia.
- Nao houve novo segredo, token, credencial, SDP, ICE, payload P2P, path local, coordenada ou conteudo de midia.
- Inspecao sensivel nos arquivos tocados retornou apenas falsos positivos esperados.
- Validacoes aprovadas: `test:received-alert-presentation`, `test:received-alert-runtime`, `smoke-test`, `lint`, `private:android:readiness`, `npm test` e `git diff --check`.
- `typecheck` nao emitiu erro, mas ficou sem saida e ocioso por mais de 1 minuto; foi encerrado para nao deixar processo pendurado.

## Memoria viva - 2026-05-22 - status e secao de historico de Alertas recebidos sem build

- Etapas 1.143 e 1.144 extraem somente componentes locais de apresentacao: `ReceivedAlertsStatusBar` e `ReceivedCallArchiveSection`.
- Efeitos de risco permanecem na tela: refresh, API, autoaceite, notificacao, WebRTC, arquivo local, refs mutaveis, reset de chamada, Share, selecao de registro e estado React.
- Os componentes recebem callbacks injetados, nao calculam runtime, nao persistem dados, nao geram texto de compartilhamento e nao acessam midia.
- Nao houve novo segredo, token, credencial, SDP, ICE, payload P2P, path local, coordenada ou conteudo de midia.
- Inspecao sensivel nos arquivos tocados retornou apenas falsos positivos esperados.
- Validacoes aprovadas: `test:received-alert-presentation`, `test:received-alert-runtime`, `smoke-test`, `lint`, `private:android:readiness`, `npm test` e `git diff --check`.
- `typecheck` nao emitiu erro, mas ficou sem saida e ocioso por mais de 1 minuto; foi encerrado para nao deixar processo pendurado.

## Memoria viva - 2026-05-22 - lista e ponto seguro de Alertas recebidos sem build

- Etapas 1.145 e 1.146 extraem somente componentes locais de apresentacao: `ReceivedAlertsList` e `ReceivedAlertsEmptyState`.
- Efeitos de risco permanecem na tela: calculo de policy, refresh, API, autoaceite, notificacao, WebRTC, arquivo local, refs mutaveis, reset de chamada, Share, selecao de registro e estado React.
- O smoke agora bloqueia regressao arquitetural em `ReceivedAlertsList`: sem API, Share, `useEffect`, `useLiveAudioCall`, notificacao, arquivo local, WebRTC ou builders de policy.
- `app/alerta.tsx` esta em ponto de parada seguro; Cristine/Eliane recomendam nao espalhar a orquestracao sensivel restante sem ganho claro.
- Nao houve novo segredo, token, credencial, SDP, ICE, payload P2P, path local, coordenada ou conteudo de midia.
- Inspecao sensivel nos arquivos tocados retornou apenas falsos positivos esperados.
- Validacoes aprovadas: `test:received-alert-presentation`, `test:received-alert-runtime`, `smoke-test`, `lint`, `private:android:readiness`, `npm test` e `git diff --check`.
- `typecheck` nao emitiu erro, mas ficou sem saida e ocioso por mais de 1 minuto; foi encerrado para nao deixar processo pendurado.

## Memoria viva - 2026-05-22 - dashboard e prontidao de Anjos sem build

- Etapas 1.147 e 1.148 extraem somente componentes locais de apresentacao: `TrustedAngelsDashboardGrid` e `TrustedAngelsReadinessPanelContent`.
- Efeitos de risco permanecem na tela: gate de perfil, refresh, API, cache local, device binding, AppState, Share, revogacoes, dialogs, navegacao e estado React.
- O smoke agora bloqueia regressao arquitetural em `TrustedAngelsDashboardGrid`: sem API, Share, AppState, storage, convite, revogacao ou device binding.
- Contratos LGPD preservados: convite nao envia evidencia/midia/localizacao, menor permanece bloqueado por policy, e pre-convite local nao vira vinculo aceito.
- Nao houve novo segredo, token, credencial, SDP, ICE, payload P2P, path local, coordenada, telefone, nome real novo ou conteudo de midia.
- Inspecao sensivel nos arquivos tocados retornou apenas falsos positivos esperados.
- Validacoes aprovadas: `test:trusted-angels-dashboard`, `test:trusted-angels-panel`, `smoke-test`, `lint`, `private:android:readiness`, `npm test` e `git diff --check`.
- `typecheck` nao emitiu erro, mas ficou sem saida e ocioso por cerca de 1 minuto; foi encerrado para nao deixar processo pendurado.

## Memoria viva - 2026-05-22 - paineis de Anjos e Convites sem build

- Etapas 1.149 e 1.150 extraem somente componentes locais de apresentacao: `TrustedAngelsRelationshipPanelContent`, `TrustedAngelsInvitationPanelContent` e `TrustedAngelsEmptyStateView`.
- Efeitos de risco permanecem na tela: gate de perfil, refresh, API, cache local, device binding, AppState, Share, revogacoes reais, dialogs, `setDialog`, navegacao e estado React.
- O smoke agora bloqueia regressao arquitetural nos novos paineis: sem API, Share, AppState, storage, device binding, refresh, router, `setDialog`, criacao de convite ou revogacao real.
- Contratos LGPD preservados: convite nao envia evidencia/midia/localizacao, menor permanece bloqueado por policy, e pre-convite local nao vira vinculo aceito.
- Nao houve novo segredo, token, credencial, SDP, ICE, payload P2P, path local, coordenada, telefone, nome real novo ou conteudo de midia.
- Inspecao sensivel nos arquivos tocados retornou apenas falsos positivos esperados.
- Validacoes aprovadas: `test:trusted-angels-panel`, `test:trusted-angels-dialog`, `test:trusted-angels-action`, `test:trusted-angels-refresh`, `smoke-test`, `lint`, `typecheck`, `private:android:readiness`, `npm test` e `git diff --check`.
- A primeira execucao dos testes focados no sandbox falhou por `EPERM` no pipe temporario do `tsx`; os mesmos testes passaram fora do sandbox.

## Memoria viva - 2026-05-22 - dialogs visuais de Anjos sem build

- Etapas 1.151 e 1.152 extraem somente dialogs locais de apresentacao: `TrustedAngelsInviteDialog`, `TrustedAngelsProfileBlockDialog`, `TrustedAngelsRevokeInvitationDialog` e `TrustedAngelsRevokeContactDialog`.
- Efeitos de risco permanecem na tela: gate de perfil, refresh, API, cache local, device binding, AppState, Share, criacao de convite, revogacoes reais, `setDialog`, navegacao e estado React.
- O smoke agora bloqueia regressao arquitetural nos novos dialogs: sem API, Share, AppState, storage, device binding, refresh, router direto, `setDialog`, criacao de convite ou revogacao real.
- Contratos LGPD preservados: convite nao envia evidencia/midia/localizacao, texto de minimizacao foi preservado e menor/perfil ausente seguem bloqueados por policy.
- Nao houve novo segredo, token, credencial, SDP, ICE, payload P2P, path local, coordenada, telefone, nome real novo ou conteudo de midia.
- Inspecao sensivel nos arquivos tocados retornou apenas falsos positivos esperados.
- Validacoes aprovadas: `test:trusted-angels-dialog`, `test:trusted-angels-action`, `test:trusted-angels-panel`, `smoke-test`, `lint`, `typecheck`, `private:android:readiness`, `npm test` e `git diff --check`.
- `private:android:readiness` manteve a pendencia local conhecida de Node 20.16.0 para release publico, aceitavel para build privado debug.

## Memoria viva - 2026-05-22 - dialogs de Estado e Prontidao de Anjos sem build

- Etapas 1.153 e 1.154 extraem somente wrappers locais de apresentacao: `TrustedAngelsStateDialog` e `TrustedAngelsReadinessDialog`.
- Efeitos de risco permanecem na tela: gate de perfil, refresh, API, cache local, device binding, AppState, Share, criacao de convite, revogacoes reais, `setDialog`, `setPanel`, navegacao e estado React.
- O smoke agora bloqueia regressao arquitetural nos novos dialogs: sem API, Share, AppState, storage, device binding, refresh, router, criacao de convite, revogacao real, `setDialog` ou `setPanel`.
- Contratos LGPD preservados: nao houve novo payload, status tecnico sensivel, coordenada, telefone, nome real novo ou conteudo de midia nos dialogs.
- Nao houve novo segredo, token, credencial, SDP, ICE, payload P2P, path local, coordenada, telefone, nome real novo ou conteudo de midia.
- Inspecao sensivel nos arquivos tocados retornou apenas falsos positivos esperados.
- Validacoes aprovadas: `test:trusted-angels-dialog`, `test:trusted-angels-panel`, `test:trusted-angels-dashboard`, `smoke-test`, `lint`, `typecheck`, `private:android:readiness`, `npm test` e `git diff --check`.
- `private:android:readiness` manteve a pendencia local conhecida de Node 20.16.0 para release publico, aceitavel para build privado debug.

## Memoria viva - 2026-05-22 - dialogs de Vinculos de Anjos sem build

- Etapas 1.155 e 1.156 extraem somente wrappers locais de apresentacao: `TrustedAngelsOwnerLinksDialog` e `TrustedAngelsAngelLinksDialog`.
- Efeitos de risco permanecem na tela: gate de perfil, refresh, API, cache local, device binding, AppState, Share, criacao de convite, revogacoes reais, `setDialog`, `setPanel`, navegacao e estado React.
- O smoke agora bloqueia regressao arquitetural nos novos dialogs: sem API, Share, AppState, device binding, refresh, router, criacao de convite, revogacao real, `setDialog` ou `setPanel`.
- Contratos LGPD preservados: nao houve novo payload, status tecnico sensivel, coordenada, telefone, nome real novo ou conteudo de midia nos dialogs.
- Nao houve novo segredo, token, credencial, SDP, ICE, payload P2P, path local, coordenada, telefone, nome real novo ou conteudo de midia.
- Revisao Cristine/Eliane confirmou que os wrappers estao seguros enquanto permanecerem puramente apresentacionais.
- Validacoes aprovadas: `test:trusted-angels-panel`, `test:trusted-angels-dialog`, `test:trusted-angels-action`, `smoke-test`, `lint`, `typecheck`, `private:android:readiness`, `npm test` e `git diff --check`.
- `private:android:readiness` manteve a pendencia local conhecida de Node 20.16.0 para release publico, aceitavel para build privado debug.

## Memoria viva - 2026-05-22 - cabecalho e dialog de Convites de Anjos sem build

- Etapas 1.157 e 1.158 extraem somente wrappers locais de apresentacao: `TrustedAngelsHeaderMenu` e `TrustedAngelsInvitationsDialog`.
- Efeitos de risco permanecem na tela: gate de perfil, refresh, API, cache local, device binding, AppState, Share, criacao de convite, revogacoes reais, `router.push`, `openMenuRoute`, `setDialog`, `setPanel`, `setMenuOpen`, navegacao e estado React.
- O smoke agora bloqueia regressao arquitetural nos novos wrappers: sem API, Share, AppState, storage, device binding, refresh, navegacao real, criacao/revogacao real ou setters de estado.
- Contratos LGPD preservados: nao houve novo payload, status tecnico sensivel, coordenada, telefone, nome real novo ou conteudo de midia nos wrappers.
- Nao houve novo segredo, token, credencial, SDP, ICE, payload P2P, path local, coordenada, telefone, nome real novo ou conteudo de midia.
- Revisao Cristine/Eliane confirmou a extracao e recomendou parar `app/contatos.tsx` por enquanto.
- Validacoes aprovadas: `test:trusted-angels-panel`, `test:trusted-angels-dialog`, `test:trusted-angels-action`, `smoke-test`, `lint`, `typecheck`, `private:android:readiness`, `npm test` e `git diff --check`.
- `private:android:readiness` manteve a pendencia local conhecida de Node 20.16.0 para release publico, aceitavel para build privado debug.

## Memoria viva - 2026-05-22 - componentes visuais de Perfis sem build

- Etapas 1.159 e 1.160 extraem somente componentes locais de apresentacao: `ProfileOptionCard` e `ProfilesContinueButton`.
- Efeitos de risco permanecem na tela: carregar perfil local, salvar perfil local, atualizar status, `setProfile`, `setStatus`, `router.push("/contatos")` e estado React.
- O smoke agora bloqueia regressao arquitetural nos novos componentes: sem storage real, navegacao real, API, Share, `useEffect` ou setters reais de estado.
- Contratos LGPD preservados: nao houve novo dado coletado; a tela segue sem documento, data de nascimento completa, endereco, agenda ou relato sensivel.
- Nao houve novo segredo, token, credencial, SDP, ICE, payload P2P, path local, coordenada, telefone, nome real novo ou conteudo de midia.
- Validacoes aprovadas: `test:profiles`, `smoke-test`, `typecheck`, `lint`, `private:android:readiness`, `npm test` e `git diff --check`.
- `private:android:readiness` manteve a pendencia local conhecida de Node 20.16.0 para release publico, aceitavel para build privado debug.
- Proxima retomada recomendada: avaliar primeiro `app/funcionamento.tsx`, depois `app/convite.tsx`; nao continuar extraindo `app/perfis.tsx` por estetica.

## Memoria viva - 2026-05-22 - policy visual de Como funciona sem build

- Etapas 1.161 e 1.162 movem o catalogo de `Como funciona` para policy pura e adicionam teste/smoke focado.
- `app/funcionamento.tsx` permanece responsavel por tela, grid, card, estilos e renderizacao dos icones.
- `howItWorksPresentationPolicy` permanece apenas como dados publicos: `id`, `iconKey`, `title` e `text`.
- O smoke bloqueia JSX, tema, API, Share, storage, permissoes e navegacao dentro da policy.
- Contratos LGPD preservados: nao houve novo dado coletado, promessa oficial, envio automatico, gravacao oculta, coordenada, telefone, nome real novo ou conteudo de midia.
- Nao houve novo segredo, token, credencial, SDP, ICE, payload P2P, path local, coordenada, telefone, nome real novo ou conteudo de midia.
- Validacoes aprovadas: `test:how-it-works-presentation`, `smoke-test`, `typecheck`, `lint`, `private:android:readiness`, `npm test` e `git diff --check`.
- `private:android:readiness` manteve a pendencia local conhecida de Node 20.16.0 para release publico, aceitavel para build privado debug.
- Proxima retomada recomendada: avaliar `app/convite.tsx`; nao continuar extraindo `app/funcionamento.tsx` por estetica.

## Memoria viva - 2026-05-22 - policy visual de Aceite de Convite sem build

- Etapas 1.163 e 1.164 extraem somente policy pura de apresentacao: `invitationAcceptancePresentationPolicy`.
- Efeitos de risco permanecem na tela: deeplink, token pendente, validacao no servidor, aceite no servidor, cache local de vinculo, limpeza de token, `router.push`, `useFocusEffect` e estado React.
- A policy recebe estado ja calculado e decide apenas copy, banners, labels, `canAcceptInvitation` visual, disabled do botao e visibilidade de acoes.
- `canAcceptInvitation` nao e guard de seguranca; os guards reais continuam em `handleAcceptInvitation`, incluindo ausencia de token, convite nao pronto, perfil bloqueado e revalidacao remota antes de aceitar.
- O smoke agora bloqueia regressao arquitetural na policy: sem API, aceite real, cache, token store, roteamento, Expo linking ou efeito React.
- Contratos LGPD preservados: o aceite continua condicionado a conta propria, dispositivo ativo, autorizacao de quem convidou e servidor; nao houve novo dado coletado.
- Nao houve novo segredo, token, credencial, SDP, ICE, payload P2P, path local, coordenada, telefone, nome real novo ou conteudo de midia.
- Revisao Cristine/Eliane/Lina recomendou parar `app/convite.tsx` neste ponto; mover efeitos reais para policy aumentaria risco.
- Validacoes aprovadas: `test:invitation-acceptance-presentation`, `smoke-test`, `typecheck`, `lint`, `private:android:readiness`, `npm test` e `git diff --check`.
- `private:android:readiness` manteve a pendencia local conhecida de Node 20.16.0 para release publico, aceitavel para build privado debug.

## Memoria viva - 2026-05-22 - apresentacao da tela Arquivos sem build

- Etapas 1.165 e 1.166 extraem apenas apresentacao: `localFilesPresentationPolicy` e `LocalFilesResourceGrid`.
- Efeitos de risco permanecem na tela: listagem do cofre, limpeza de residuos, gate protegido, player, mapa externo, update check, exclusao local, encerramento de chamado, navegacao e estado React.
- `LocalFilesResourceGrid` recebe callbacks para abrir player, abrir cofre, navegar para funcionamento e checar update; nao importa router, update service, Linking, storage, cofre ou finalizacao.
- `localFilesPresentationPolicy` centraliza textos/status, inclusive confirmacao de exclusao e aviso de localizacao exata ao abrir mapa externo.
- Contratos LGPD preservados: sem novo dado coletado, sem log sensivel, sem path local real, sem coordenada real e sem conteudo de midia.
- Revisao Cristine/Eliane/Lina recomendou parar `app/arquivos.tsx` neste ponto; nao mover `deleteLocalPackage`, `finishPackageNow`, `Linking.openURL`, `EvidencePlayerCard`, `LocalEvidenceRail`, storage, paths locais, criptografia, loopback/player ou limpeza de residuos.
- Validacoes aprovadas: `test:local-files-presentation`, `smoke-test`, `typecheck`, `lint`, `test:crypto`, `test:protected-route-access`, `test:finish-code`, `test:finish-confirmation-dialog`, `private:android:readiness`, `npm test` e `git diff --check`.
- `private:android:readiness` manteve a pendencia local conhecida de Node 20.16.0 para release publico, aceitavel para build privado debug.

## QA/Security - 2026-05-22 - Etapas 1.167 e 1.168 onboarding presentation policy

- Mudanca restrita a policy pura de apresentacao da tela `Boas-vindas` e helper puro de status do `ConsentCard`; sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- `app/onboarding.tsx` continua responsavel por `SafeScreen` e composicao dos cards; `ConsentCard` continua componente visual.
- `onboardingPresentationPolicy` expoe apenas copy publica e catalogo de passos, sem JSX, tema, API, Share, storage, permissao, localizacao, camera, microfone ou navegacao.
- `consentCardPresentationPolicy` expoe apenas labels de status e `buildConsentCardPresentation(status)`.
- Contratos preservados: textos continuam conservadores e nao prometem resposta oficial, protecao garantida, prova judicial, envio automatico ou gravacao oculta.
- O smoke bloqueia copy inline de onboarding e bloqueia API, Share, storage e navegacao nas policies.
- Nao introduz log novo, chave, token, hash, codigo, identity token, SDP, ICE, payload P2P, URI local, path de arquivo, coordenada, telefone, nome real novo ou conteudo de midia.
- Validacoes aprovadas: `test:onboarding-presentation`, `smoke-test`, `typecheck`, `lint`, `private:android:readiness`, `npm test` e `git diff --check`.
- `private:android:readiness` manteve a pendencia local conhecida de Node 20.16.0 para release publico, aceitavel para build privado debug.
- Android/build nao foram executados porque a fatia nao altera UX nativa, chamada real, renderizacao WebRTC, camera, gravacao, Share nativo real, cofre, player ou loop de midia.

## QA/Security - 2026-05-22 - Etapas 1.169 e 1.170 status components presentation policies

- Mudanca restrita a helpers puros de apresentacao de `PermissionGate` e `InviteCard`; sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- `PermissionGate` continua renderizando somente titulo, texto e status; permissoes reais seguem em `app/configuracoes.tsx`.
- `InviteCard` continua renderizando card e callback injetado; convite, aceite, revogacao, backend, Share e vinculos reais seguem em `app/contatos.tsx` e services existentes.
- `permissionGatePresentationPolicy` expoe apenas labels de status e `buildPermissionGatePresentation(status)`.
- `inviteCardPresentationPolicy` expoe apenas labels, tons, chaves de icone e `buildInviteCardPresentation(status)`.
- Contratos preservados: labels, tons e icones de status permanecem equivalentes aos anteriores; nenhuma promessa nova ou status tecnico sensivel foi exposto.
- O smoke bloqueia API, Share, storage, navegacao, tema, icones, permissao real e efeitos reais dentro das policies.
- Nao introduz log novo, chave, token, hash, codigo, identity token, SDP, ICE, payload P2P, URI local, path de arquivo, coordenada, telefone, nome real novo ou conteudo de midia.
- Validacoes aprovadas: `test:status-components-presentation`, `smoke-test`, `typecheck`, `lint`, `private:android:readiness`, `npm test` e `git diff --check`.
- `private:android:readiness` manteve a pendencia local conhecida de Node 20.16.0 para release publico, aceitavel para build privado debug.
- Android/build nao foram executados porque a fatia nao altera UX nativa, chamada real, renderizacao WebRTC, camera, gravacao, Share nativo real, cofre, player ou loop de midia.

## QA/Security - 2026-05-22 - Etapas 1.171 e 1.172 presentation component policies

- Mudanca restrita a helpers puros de apresentacao de `StatusBanner` e `ResourceTile`; sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- `StatusBanner` continua renderizando somente titulo, texto e borda conforme tom recebido; status reais seguem nas telas/policies de dominio existentes.
- `ResourceTile` continua renderizando icone, label, descricao opcional e callback injetado; navegacao/update/mapa/cofre seguem fora do componente.
- `statusBannerPresentationPolicy` expoe apenas mapeamento de tom visual e `buildStatusBannerPresentation(tone)`.
- `resourceTilePresentationPolicy` expoe apenas parametros de text fit e `buildResourceTilePresentation(description)`.
- Contratos preservados: tons, ajuste de fonte e decisao de descricao permanecem equivalentes aos anteriores; nenhuma promessa nova ou status tecnico sensivel foi exposto.
- O smoke bloqueia API, Share, storage, navegacao, tema, icones, permissao real e efeitos reais dentro das policies.
- Nao introduz log novo, chave, token, hash, codigo, identity token, SDP, ICE, payload P2P, URI local, path de arquivo, coordenada, telefone, nome real novo ou conteudo de midia.
- Validacoes aprovadas: `test:presentation-components`, `smoke-test`, `typecheck`, `lint`, `private:android:readiness`, `npm test` e `git diff --check`.
- `private:android:readiness` manteve a pendencia local conhecida de Node 20.16.0 para release publico, aceitavel para build privado debug.
- Android/build nao foram executados porque a fatia nao altera UX nativa, chamada real, renderizacao WebRTC, camera, gravacao, Share nativo real, cofre, player ou loop de midia.

## QA/Security - 2026-05-22 - Etapas 1.173 e 1.174 brand launch policies

- Mudanca restrita a helpers puros de apresentacao/acessibilidade de `AppLaunchScreen` e `BrandLockup`; sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- `AppLaunchScreen` continua renderizando `Animated`, asset do simbolo e barra de carregamento; a policy expoe somente nome da marca, label de acessibilidade e parametros visuais.
- `BrandLockup` continua renderizando o asset aprovado da marca; a policy expoe somente label, role e dimensoes do logo.
- Sem alteracao de SOS, WebRTC, cofre, player, convites reais, permissao real, login, backend, portal, publicacao, criptografia, chaves ou armazenamento local.
- Validacoes aprovadas: `test:brand-components-presentation`, `smoke-test`, `typecheck`, `lint`, `private:android:readiness`, `npm test` e `git diff --check`.
- `private:android:readiness` manteve a pendencia local conhecida de Node 20.16.0 para release publico, aceitavel para build privado debug.

## QA/Security - 2026-05-22 - Etapas 1.175 e 1.176 action component policies

- Mudanca restrita a helpers puros de apresentacao/acessibilidade de `ButtonIcon` e `EmergencyCallDock`; sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- `ButtonIcon` continua renderizando `Pressable`, icone recebido, label e estados pressed/disabled; a policy expoe somente role, estado desabilitado, tamanho visual e text fit.
- `EmergencyCallDock` continua renderizando icones Lucide, lista de alvos e callback `onCallTarget(target)`; a policy expoe somente hint/label/role, tamanho visual e text fit.
- Sem alteracao de SOS, WebRTC, cofre, player, convites reais, permissao real, login, backend, portal, publicacao, criptografia, chaves ou armazenamento local.
- Validacoes aprovadas: `test:action-components-presentation`, `smoke-test`, `typecheck`, `lint`, `private:android:readiness`, `npm test` e `git diff --check`.
- `private:android:readiness` manteve a pendencia local conhecida de Node 20.16.0 para release publico, aceitavel para build privado debug.

## QA/Security - 2026-05-22 - Etapas 1.177 e 1.178 brand background invite policies

- Mudanca restrita a helpers puros de apresentacao/acessibilidade de `BrandBackground` e `InviteCard`; sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- `BrandBackground` continua renderizando `Animated`, hooks, asset, JSX, tema e interpolations reais; a policy expoe somente dados/ranges/configs puros.
- `InviteCard` continua renderizando tema, icones Lucide, `Pressable`, callbacks e JSX; a policy expoe somente status, label, tone, text-fit, role e tamanho visual.
- Sem alteracao de SOS, WebRTC, cofre, player, convites reais, permissao real, login, backend, portal, publicacao, criptografia, chaves ou armazenamento local.
- Validacoes aprovadas: `test:brand-components-presentation`, `test:status-components-presentation`, `smoke-test`, `typecheck`, `lint`, `private:android:readiness`, `npm test` e `git diff --check`.
- `private:android:readiness` manteve a pendencia local conhecida de Node 20.16.0 para release publico, aceitavel para build privado debug.

## QA/Security - 2026-05-23 - Etapas 1.179 e 1.180 screen/call presentation policies

- Etapas 1.179 e 1.180 extraem apenas apresentacao/acessibilidade: `safeScreenPresentationPolicy` e `emergencyCallButtonPresentationPolicy`.
- `SafeScreen` continua renderizando container seguro, topo, marca opcional, scroll, filhos, estilos e tema; a policy expoe defaults e ajuste de texto.
- `EmergencyCallButton` continua renderizando modal, botao, icone, tema, estado React, callbacks e a ligacao real `Linking.openURL("tel:190")`.
- A policy de chamada publica nao contem `tel:190`; isso preserva o telefone real fixo no componente.
- `PanicButton` ficou intacto nesta rodada por recomendacao de risco, evitando tocar SOS visual sem validacao fisica dedicada.
- Validacoes aprovadas: `test:screen-components-presentation`, `test:presentation-components`, `smoke-test`, `typecheck`, `lint`, `private:android:readiness`, `npm test` e `git diff --check`.
- Sem build/instalacao Android porque a fatia e presentational e nao altera runtime fisico.

## QA/Security - 2026-05-24 - Etapas 1.183 a 1.188 bloco SS presentational

- Roberto autorizou SS por 3 rodadas; executadas tres duplas presentational pequenas.
- Etapas 1.183/1.184: `FuncionamentoScreen` e `LocalFilesResourceGrid` receberam policies para copy/configuracao visual e linhas da grade.
- Etapas 1.185/1.186: `ConsentCard` e `StatusBanner` receberam text-fit em policies puras, sem alterar textos ou consumidores.
- Etapas 1.187/1.188: `BrandLockup` e `AppLaunchScreen` receberam parametros visuais finos em policies, sem mover assets, hooks, animacao ou boot real.
- Nao houve novo segredo, credencial, SDP, ICE, payload P2P, path local, coordenada, telefone novo, nome real novo ou conteudo de midia.
- Validacoes focadas aprovadas: `test:how-it-works-presentation`, `test:local-files-presentation`, `test:onboarding-presentation`, `test:presentation-components`, `test:brand-components-presentation`, `smoke-test`, `typecheck` e `lint`.
- Sem build/instalacao Android porque o bloco e presentational e nao altera runtime fisico.
- Proxima recomendacao: rodar validacao ampla (`npm test`, readiness privado e `git diff --check`) antes de commit/push; depois fazer nova microtriagem antes de tocar blocos sensiveis.

## QA/Security - 2026-05-23 - Etapas 1.181 e 1.182 emergency home shell policies

- Etapas 1.181 e 1.182 extraem apenas apresentacao/acessibilidade: `emergencyTopBarPresentationPolicy` e `emergencySettingsDrawerPresentationPolicy`.
- `EmergencyTopBar` continua renderizando `AppTopBar` e recebendo `menuOpen`/`onToggleMenu`; a policy expoe somente labels e configuracao visual do menu.
- `EmergencySettingsDrawer` continua renderizando icones Lucide, tema, callbacks e destinos reais; a policy expoe somente ordem, labels, chaves de icone, tamanho, role e text-fit.
- A policy do drawer nao contem rotas nem paineis; isso evita transformar uma fatia visual em policy comportamental de navegacao.
- `PanicButton`, `AppTopBar`, `BrandedDialog`, gate protegido, cofre, player, SOS/WebRTC, backend e storage ficaram fora do escopo.
- Validacoes aprovadas: `test:emergency-home-shell-presentation`, `test:action-components-presentation`, `smoke-test`, `typecheck`, `lint`, `private:android:readiness`, `npm test` e `git diff --check`.
- Sem build/instalacao Android porque a fatia e presentational e nao altera runtime fisico.
