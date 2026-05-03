# 16 - Segundo Plano, Atalho Fisico e Duracao do Chamado

Data: 2026-05-02  
Supervisao: Ze  
Gerencia mobile: Cristine  
Especialistas acionados: Ada, Hedy, Margaret, Katherine, Norman, Myers, Schneier, Doneda e Knuth

## Objetivo

Responder ao requisito de agilidade em emergencia sem prometer recursos que Android/iOS nao garantem:

- reduzir atrito da permissao de GPS;
- permitir duracao padrao configuravel do chamado;
- permitir encerramento manual do chamado;
- preparar caminho tecnico para segundo plano;
- documentar limite real do atalho fisico por volume com tela bloqueada.

## Decisoes do MVP

### Localizacao sem pedir sempre

Implementado como pre-autorizacao foreground:

- a tela `Configuracoes` permite autorizar localizacao antes do primeiro chamado;
- quando a permissao ja esta concedida, o app usa `Location.getForegroundPermissionsAsync()` e nao dispara novo dialogo do sistema;
- se a permissao for negada/revogada, o chamado local continua sendo criado com status explicito;
- o app nao tenta burlar o Android/iOS nem substituir a decisao da usuaria.

Limite:

- no build publico, nao foi ativado `ACCESS_BACKGROUND_LOCATION`;
- background location fica bloqueada ate homologacao, justificativa juridica, consentimento destacado, notificacao persistente e revisao de loja.
- a leitura de status de segundo plano trata a ausencia de permissao no manifest como bloqueio esperado, sem quebrar a tela de configuracoes.

### Duracao padrao do chamado

Implementado:

- opcoes: `30s`, `1min`, `3min`, `5min`;
- padrao inicial: `1min`;
- a preferencia fica em `AsyncStorage`, pois nao contem dado sensivel;
- cada pacote registra `plannedDurationSeconds`;
- o chamado ativo pode ser encerrado manualmente antes do tempo;
- se o tempo padrao expirar enquanto o app esta ativo, o pacote e finalizado como `default_duration_elapsed`.

Limite:

- duracao de chamado nao e a mesma coisa que politica de retencao;
- retencao e exportacao continuam pendentes de backend, termos, RIPD/DPIA e revisao juridica.

### Encerrar chamado/gravação

Implementado para o pacote local:

- chamada ativa usa status `recording_local`;
- botao `Finalizar chamado ativo` fecha o pacote com motivo `manual_finish`;
- finalizar nao apaga evidencia local;
- finalizar recalcula SHA-256 sem carregar o bloco `integrity` anterior e deixa o pacote em `queued_for_delivery`;
- tela `Arquivos locais` permite finalizar pacote ativo caso a usuaria navegue ate ela.

Limite:

- midia real continua bloqueada no build publico;
- portanto o encerramento atual fecha a coleta local de metadados/localizacao e o manifesto de midia bloqueada.

### Execucao em segundo plano

Status: documentada, nao ativada no build publico.

Para homologacao futura, Android exigira:

- foreground service legitimo;
- tipo correto de foreground service;
- notificacao persistente;
- consentimento especifico;
- justificativa para Google Play;
- `ACCESS_BACKGROUND_LOCATION` quando o app precisar obter localizacao estando em background.

iOS exigira:

- autorizacao `Always`;
- `UIBackgroundModes` com `location`;
- justificativa clara;
- preparo para suspensao/limites do sistema;
- revisao App Store.

### Atalho fisico por botao de volume

Status: pesquisa futura nativa, nao prometida no MVP.

Motivos:

- Expo/React Native nao oferece API JS confiavel para capturar volume com tela bloqueada;
- iOS nao deve ser tratado como plataforma com gatilho geral por volume em background;
- Android varia por fabricante e estado do app;
- usar acessibilidade, overlay, audio silencioso ou captura indevida de media key para contornar o sistema fica bloqueado por seguranca e politicas de loja.

Alternativas seguras para proximas fases:

- botao in-app com pressao longa;
- widget/atalho do sistema quando autorizado;
- quick action;
- notificacao persistente em homologacao;
- modulo nativo Android especifico apenas apos threat model e QA por fabricante.

## Arquivos alterados

- `app/_layout.tsx`;
- `app/configuracoes.tsx`;
- `app/index.tsx`;
- `app/alerta.tsx`;
- `app/arquivos.tsx`;
- `src/features/emergency/emergencyPreferences.ts`;
- `src/features/emergency/emergencyRecorder.ts`;
- `src/features/emergency/locationCapture.ts`;
- `src/features/emergency/types.ts`;
- `src/features/emergency/packagePresentation.ts`;
- `src/components/EmergencyPackageCard.tsx`;
- `app.json`.

## Criterios de aceite

- `npm run typecheck` aprovado;
- `npm run lint` aprovado;
- `npm test` aprovado;
- configuracao de duracao persiste;
- chamado ativo aparece como ativo;
- botao de finalizar encerra o chamado sem apagar pacote;
- pacote finalizado tem novo SHA-256;
- smoke test impede regressao de hash final calculado sobre `integrity` antigo;
- localizacao concedida previamente nao solicita dialogo novamente;
- localizacao negada nao impede pacote local;
- build publico continua sem camera, microfone, overlay, storage legado e background location;
- tela `Configuracoes` nao chama fluxo que exija `ACCESS_BACKGROUND_LOCATION` no build publico;
- documentacao nao promete acionamento por volume com tela travada.

## Validacao Android fisica

Status em 2026-05-02: aprovado em aparelho Android fisico `23129RA5FL` via ADB Wi-Fi `192.168.0.5:5555`.

Resultados:

- app debug instalado e aberto;
- splash inicial saiu para a Home depois de carregado o bundle JS pelo Metro;
- `app/_layout.tsx` passou a chamar `SplashScreen.hideAsync()` no mount para evitar retencao extra da tela de inicializacao;
- Tarcila aprovou splash, icone, adaptive icon atual e lockup para homologacao interna;
- `Configuracoes` abriu sem erro mesmo sem `ACCESS_BACKGROUND_LOCATION` no manifest publico;
- localizacao foreground autorizada foi reutilizada sem novo prompt;
- duracao padrao `30s` foi salva em `Configuracoes`;
- ao voltar para Home, preferencias foram recarregadas no foco da tela;
- botao de panico in-app iniciou chamado ativo por ate `30s`;
- botao `Finalizar chamado ativo` encerrou o chamado sem apagar o pacote;
- `Arquivos locais` exibiu pacote `QUEUED_FOR_DELIVERY`, coleta finalizada pela usuaria, duracao planejada `30s`, georreferencia preservada e SHA-256;
- logcat do processo do app nao mostrou crash, excecao de background location, camera, microfone, upload `/alerts` ou WebRTC.

Observacao:

- build debug via Expo Dev Client depende do Metro para carregar JS; release interna assinada deve ser gerada novamente antes de publicacao como `internal.3`.

## Fontes tecnicas oficiais

- Expo Location SDK 54: `https://docs.expo.dev/versions/v54.0.0/sdk/location/`;
- Android background location: `https://developer.android.com/develop/sensors-and-location/location/permissions/background`;
- Android foreground service restrictions: `https://developer.android.com/about/versions/12/foreground-services`;
- Android foreground service types Android 14+: `https://developer.android.com/about/versions/14/changes/fgs-types-required`;
- Apple App Store Guidelines: `https://developer.apple.com/app-store/guidelines/`.
