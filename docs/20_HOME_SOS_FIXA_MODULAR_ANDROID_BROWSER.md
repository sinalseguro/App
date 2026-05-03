# 20 - Home SOS Fixa, Modular e Validada

Data: 2026-05-03  
Coordenação: Zé  
Gestão mobile: Cristine  
Aprovação visual: Tarcila, com Norman e Myers  
Segurança: Schneier  
Mobile: Ada, Hedy e Margaret

## Objetivo

Aplicar os comentários de validação da tela inicial do app, garantindo que a Home seja uma superfície fixa de emergência, sem rolagem, sem texto duplicado e com foco total no botão SOS.

## Decisões aplicadas

- A Home deixou de usar `SafeScreen`, porque esse componente usa `ScrollView`.
- O header nativo foi removido apenas na rota inicial.
- O título e o subtítulo duplicados foram removidos da área principal.
- O botão SOS ficou responsivo, circular, com `width: "75%"`, `aspectRatio: 1` e limite máximo.
- A Home passou a mostrar apenas:
  - topo discreto com nome, modo atual e engrenagem;
  - botão SOS central;
  - atalhos oficiais `Policia 190`, `Bombeiros 193` e `SAMU 192`.
- Cofre/player, anjos, convites, configurações e atividade ficam no menu retrátil da engrenagem.
- O SOS ativo muda para `ATIVO` e mantém partículas discretas.
- O fallback web do cofre foi ajustado para não chamar `expo-secure-store` no navegador.
- No navegador, o acionamento simulado não captura localização real.
- O fluxo SOS passou a tratar falha de persistência com erro controlado, sem marcar chamado ativo quando o pacote não for preservado.
- O código universal `1900` deixou de ser padrão válido; ativar encerramento protegido exige novo código salvo como hash local.

## Modularização

Para manter evolução saudável e facilitar supervisão por agentes, a Home foi separada em arquivos próprios:

- `src/features/emergency-home/EmergencyTopBar.tsx`;
- `src/features/emergency-home/EmergencySettingsDrawer.tsx`;
- `src/features/emergency-home/EmergencyCallDock.tsx`;
- `src/features/emergency-home/EmergencyCallTarget.ts`;
- `src/features/emergency-home/routes.ts`.

O modelo `EmergencyCallTarget` concentra os dados e o URI de chamada dos canais oficiais, evitando espalhar strings e regras pela interface.

## Validação Browser

URL validada explicitamente: `http://localhost:8081/`.

Critérios verificados:

- Home visível em `/`;
- subtítulo antigo removido;
- atalhos `Policia 190`, `Bombeiros` e `SAMU` presentes;
- engrenagem presente;
- drawer com modo atual, cofre/player, anjos, convites e configurações;
- nenhum erro recente no navegador após recarregar a Home em aba limpa.

Evidência:

- `docs/evidencias/browser/2026-05-03-home-sos-refatorada/01-home-sos-fixa.png`.

## Validação Android

Dispositivo:

- Serial ADB: `192.168.0.5:5555`;
- pacote: `br.com.sinalseguro.app`.

Execução:

- `./gradlew :app:assembleDebug --console=plain`;
- `adb -s 192.168.0.5:5555 install -r android/app/build/outputs/apk/debug/app-debug.apk`;
- abertura por deep link `sinalseguro:///`;
- gesto SOS por ADB com `input swipe`.

Critérios verificados:

- Home carregada no dispositivo;
- menu retrátil abre e fecha;
- Home fixa com SOS central e atalhos oficiais;
- SOS acionado por gesto longo e estado `ATIVO` exibido;
- partículas discretas visíveis no estado ativo;
- `logcat` sem `FATAL`, `AndroidRuntime`, `RedBox`, `Unable to load script` ou `setValueWithKeyAsync`.

Evidências:

- `docs/evidencias/android/2026-05-03-home-sos-refatorada/01-home-sos-fixa.png`;
- `docs/evidencias/android/2026-05-03-home-sos-refatorada/02-home-drawer.png`;
- `docs/evidencias/android/2026-05-03-home-sos-refatorada/03-sos-ativo.png`.

## Gates executados

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run release:android:readiness`: pronto condicionado;
- `git diff --check`: aprovado;
- `./gradlew :app:assembleDebug --console=plain`: aprovado;
- `adb install -r`: aprovado.

## Parecer de continuidade

Tarcila aprova o checkpoint para validacao visual de Roberto porque a tela inicial voltou a seguir a identidade SinalSeguro, prioriza o gesto de emergencia, remove conteudo redundante e usa icones/atalhos essenciais sem competir com o SOS.

Norman aprova a organizacao da experiencia como superficie fixa de emergencia, desde que a validacao do usuario confirme toque confortavel em aparelhos menores.

Schneier e Doneda mantem os bloqueios de midia real, streaming, upload, P2P e compartilhamento externo ate existir backend com autenticacao, chaves, auditoria, consentimento bilateral, retencao e RIPD/DPIA.

## Pendências controladas

- Release assinado ainda depende de `SINAL_APP_ANDROID_KEYSTORE_PATH` e `SINAL_APP_ANDROID_KEY_ALIAS`.
- O diretório nativo `android/` continua gerado e ignorado pelo Git.
- Build debug usa Metro para JS; para validação sem servidor local, gerar preview/release com bundle embarcado.
- Backend/P2P, streaming real, mídia real e compartilhamento externo seguem bloqueados até contrato, API, criptografia de ponta, auditoria, RIPD/DPIA e revisão jurídica.
