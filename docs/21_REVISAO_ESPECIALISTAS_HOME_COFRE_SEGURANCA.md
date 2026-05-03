# 21 - Revisao dos Especialistas: Home, Cofre e Seguranca

Data: 2026-05-03  
Coordenacao: Ze  
Gestao mobile: Cristine  
Especialistas acionados: Tarcila, Norman, Ada, Hedy, Margaret, Schneier, Doneda e Myers

## Objetivo

Resolver os bloqueios apontados apos o checkpoint `docs/20_HOME_SOS_FIXA_MODULAR_ANDROID_BROWSER.md`, mantendo foco em:

- preservar a identidade visual aprovada por Tarcila;
- impedir perda acidental de evidencias locais;
- reduzir jargao tecnico na Home;
- respeitar preferencias configuraveis da usuaria;
- reforcar a regra de apenas um chamado ativo por dispositivo;
- reconciliar documentacao com o estado real da splash e do build Android.

## Correcoes aplicadas

### Home SOS

- O drawer deixou de exibir `backend/P2P` para a usuaria.
- O texto do status de atividade foi simplificado para linguagem operacional.
- O atalho `Policia 190` passa a respeitar `call190ShortcutEnabled`.
- `Bombeiros 193` e `SAMU 192` continuam visiveis como canais oficiais manuais.

### Chamado ativo

- `startEmergencyPackage()` passou a impor singleton/idempotencia no servico, nao apenas na tela React.
- Se ja houver chamado `recording_local`, o servico retorna o pacote ativo em vez de criar outro.
- Chamadas concorrentes durante captura/localizacao compartilham a mesma promise local.
- `recordEmergencyPackage()` agora bloqueia quando ja existe chamado ativo, evitando finalizar pacote ativo por engano.

### Cofre local

- A acao `Excluir` agora abre confirmacao antes da remocao.
- Pacote `recording_local` nao pode ser excluido pelo cofre; a usuaria precisa finalizar o chamado antes.
- A exclusao continua limitada ao dispositivo e registra tombstone/auditoria local antes de remover.

### Web/simulador

- O fallback web do cofre deixou de usar `sessionStorage`.
- No navegador, o armazenamento seguro e apenas memoria volatil de simulador.
- O web build segue proibido para dados reais, midia real e captura sensivel.

### Splash e Android

- O estado real atual usa `expo.splash.image` com `./assets/brand/sinalseguro-splash-approved.png`.
- Nao existe plugin `with-android-blank-native-splash` ativo neste checkpoint.
- O simbolo discreto na splash nativa evita a tela roxa vazia antes da splash React.
- As regras `secure_store_backup_rules` e `secure_store_data_extraction_rules` vem do `expo-secure-store` e aparecem nos recursos mesclados do Gradle.

## Parecer dos especialistas

Tarcila e Norman aprovam a direcao visual da Home SOS fixa e da splash, condicionada a validacao final de Roberto em telas menores.

Ada e Hedy aprovam a modularizacao com a ressalva de consolidar `alerts` e `emergency` em uma etapa futura para outbox unica, criptografada e integrada ao contrato OpenAPI.

Schneier e Doneda aprovam o bloqueio de midia real, streaming, P2P real, upload real e compartilhamento externo neste build. Web permanece apenas simulador.

Myers exige que o checkpoint so avance apos os gates locais e `release:android:readiness` com Node correto.

## Validacoes executadas

- `npm run typecheck`;
- `npm run lint`;
- `npm test`;
- `npm run release:android:readiness`;
- `git diff --check`;
- `./gradlew :app:assembleDebug --console=plain`;
- `curl -fsS http://localhost:8081` confirmou servidor web ativo.

Resultado:

- gates locais aprovados;
- readiness Android pronto condicionado, com pendencias esperadas de assinatura release e diretorio nativo gerado;
- build debug Android aprovado;
- ADB nao encontrou aparelho conectado neste fechamento, entao nao houve reinstalacao fisica nesta rodada.

## Pendencias controladas

- Build debug depende de Metro; preview/release precisa bundle embarcado.
- Assinatura release depende de variaveis de keystore fora do Git.
- Consolidar `alerts` e `emergency` em outbox unica na proxima fase tecnica.
- Validar Home em aparelho menor antes de declarar aprovacao visual final.
- Sem dados reais ate auth, consentimento bilateral, chaves, auditoria, retencao, RIPD/DPIA e revisao juridica.
