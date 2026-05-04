# 23 - Especificacao de desenvolvimento do app

Data: 2026-05-03  
Fonte de verdade operacional: este repositorio, `AGENTS.md`, `.codex/AGENTS.md` e `.codex/memory/CRISTINE.md`.

## Stack

- React Native + Expo Dev Client/EAS.
- TypeScript.
- Expo Router.
- Android 7+ (`minSdkVersion 24`, `targetSdkVersion 36`).
- iOS 15.1+.
- Design system proprio em `src/design/`.

## Principios de arquitetura

- Interface e regras separadas em arquivos proprios.
- Componentes visuais reutilizaveis em `src/components/`.
- Fluxos de dominio em `src/features/`.
- Telas em `app/` apenas orquestram estado, navegacao e composicao.
- Preferir modelos/tipos explicitos para regras sensiveis.
- Comentarios e documentacao em portugues.
- Sem segredos, chaves, `.env` ou dados reais no Git.

## Componentes base

- `AppTopBar`: topo padrao com logo, contexto, voltar e menu.
- `BrandBackground`: fundo visual da Home com marca em transparencia e animacoes suaves.
- `BrandedDialog`: modal SinalSeguro para confirmacoes e alertas criticos.
- `ResourceTile`: icone de recurso usado em telas fixas.
- `PanicButton`: SOS circular responsivo com gesto de pressao longa.
- `EmergencySettingsDrawer`: menu retratil da Home.
- `EmergencyCallDock`: atalhos oficiais 190, 193 e 192.
- `EvidencePlayerCard`: player seguro local/recebido.
- `LocalEvidenceRail`: trilha horizontal de pacotes locais com acoes em raio.
- `SafeScreen`: base rolavel para paginas informativas e configuracoes.

## Home SOS

- Deve ser fixa, sem rolagem.
- Deve exibir logo no topo via `AppTopBar`.
- Deve priorizar o botao central `SOS`.
- SOS ocupa 75% da largura horizontal possivel, com limite maximo para telas grandes.
- Pressao longa aciona ou encerra o chamado.
- Chamado ativo muda o texto para `ATIVO` e liga particulas discretas.
- Atalhos oficiais ficam visiveis no rodape: `Policia 190`, `Bombeiros 193`, `SAMU 192`.
- O 190 pode ser ocultado por preferencia; 193 e 192 seguem visiveis.

## Encerramento do chamado

- Encerramento exige o mesmo gesto deliberado do SOS.
- Opcionalmente exige codigo local configuravel.
- Codigo fica salvo apenas como hash local.
- Padrao: codigo desativado.
- Se codigo estiver ativo e incorreto, chamado continua ativo.

## Cofre local

- Deve ser tela fixa e iconografica.
- Dados tecnicos ficam no menu sanduiche.
- Player abre em modal.
- Trilha de arquivos abre em modal.
- Exclusao exige confirmacao em `BrandedDialog`.
- Chamada ativa nao pode ser excluida antes de finalizar.
- Finalizacao de chamada ativa pelo Cofre deve reutilizar o mesmo protocolo de seguranca da Home.
- Se `finishSafety.requireCode` estiver ativo, o Cofre deve exigir o codigo local antes de encerrar.
- Exclusao local grava tombstone/auditoria antes de remover o pacote.

## Midia, camera e streaming

- Build publico continua sem transmissao, stream, P2P, upload e compartilhamento externo de midia.
- Build privado de homologacao local pode solicitar `CAMERA` e `RECORD_AUDIO` para gravar video/audio no sandbox privado do app quando a usuaria autorizar.
- Preferencias de camera frontal/traseira/duas cameras determinam a proxima gravacao local do SOS.
- `Duas cameras` e modo de homologacao: tenta frontal e traseira simultaneamente, com fallback automatico para camera unica quando Android/Expo ou o aparelho bloquear captura dupla.
- Video/audio local exigem permissao explicita do sistema, indicador discreto do app, aceite local de termos e acesso pelo cofre/player.
- A transmissao para anjos, API, P2P ou autoridade exige RIPD/DPIA, contrato, consentimento versionado, criptografia por envelope, hashes, RBAC e auditoria.
- Streaming WebRTC/P2P fica futuro/best-effort, nunca promessa de emergencia.

## Dados e seguranca

- Pacote local registra horario, consentimento, localizacao pontual se autorizada, manifesto de midia e hash.
- Web usa simulador volatil para cofre seguro.
- Dispositivo usa `expo-secure-store` para registros pequenos.
- Aceites locais de termos, privacidade e compartilhamento emergencial ficam versionados em `legalConsent`.
- Midia local no build privado fica no sandbox do app, com backup Android bloqueado no Manifest nativo.
- O hash SHA-256 do asset de video e calculado sobre o conteudo preservado em base64 para detectar alteracao do arquivo no cofre local.
- Criptografia por envelope e chaves relacionadas a usuarios autorizados entram na etapa de backend/homologacao controlada.
- Logs nao podem conter coordenadas completas, tokens, payloads sensiveis, chaves, audio, video ou relatos.

## Botao SOS

- O botao SOS ocupa a area central da Home e usa pressao longa para acionar ou encerrar.
- O progresso do gesto e circular, discreto e preso a circunferencia do proprio botao.
- Acionamento progride no sentido horario; encerramento progride no sentido anti-horario.
- O anel nao deve sair da borda visual do botao em Android, iOS ou web responsivo.

## Permissoes

Declaradas diretamente no build publico:

- `ACCESS_FINE_LOCATION`.
- `ACCESS_COARSE_LOCATION`.
- `POST_NOTIFICATIONS`.

Permissoes transitivas observadas no APK debug por dependencias Expo/AndroidX e que devem ficar documentadas e revisadas antes de release publica:

- `WAKE_LOCK`.
- `RECEIVE_BOOT_COMPLETED`.
- `USE_BIOMETRIC`.
- `USE_FINGERPRINT`.
- Permissoes de badge/launcher de fabricantes adicionadas por bibliotecas de notificacao.

Bloqueadas no build publico:

- `CAMERA`.
- `RECORD_AUDIO`.
- `SYSTEM_ALERT_WINDOW`.
- `READ_EXTERNAL_STORAGE`.
- `WRITE_EXTERNAL_STORAGE`.

Declaradas apenas no build privado de midia local:

- `CAMERA`.
- `RECORD_AUDIO`.

Bloqueadas tambem no build privado:

- `SYSTEM_ALERT_WINDOW`.
- `READ_EXTERNAL_STORAGE`.
- `WRITE_EXTERNAL_STORAGE`.
- backup Android de evidencias locais (`android:allowBackup="false"` no Manifest nativo preparado pelo build privado).

## API futura

Contratos previstos em `docs/api/openapi.yaml`:

- `auth`.
- `devices`.
- `trusted_contacts`.
- `invitations`.
- `consents`.
- `alerts`.
- `delivery_attempts`.
- `media_assets`.
- `audit_events`.
- `app_updates`.

Endpoint de atualizacao planejado:

- `GET /app/releases/latest?platform=android|ios&version=<versao>`;
- usado pela acao `Atualizar app` no Cofre;
- nao deve expor URL assinada, token ou dado sensivel em logs ou push.

## Login e consentimentos

- Login Google/Apple/iCloud fica preparado como fluxo OIDC futuro, sem client secret no app.
- A conta de administracao ou homologacao nunca deve ser versionada com token, senha ou chave.
- Termos de uso, privacidade e compartilhamento emergencial devem ter versao e aceite por dispositivo.
- Quem recebe stream, arquivo ou localizacao deve aceitar compromisso de sigilo e uso somente no SinalSeguro ou por exportacao auditada para finalidade legal.

## Build Android de validacao

O APK debug usado para validacao fisica deve ser gerado com JS embutido quando o objetivo for testar abertura sem Metro:

```bash
npm run build:android:private
```

Essa rotina usa `-PsinalBundleDebugJs=true` em `android/app/build.gradle`, embute `index.android.bundle` no APK e desliga o suporte nativo de desenvolvedor apenas neste modo de validacao. Isso evita travamento visual quando o aparelho nao consegue acessar `localhost:8081`.

Antes do build privado com midia local, executar:

```bash
npm run private:android:readiness
```

Esse gate aceita a pendencia de Node local apenas para debug privado, verifica `CAMERA`/`RECORD_AUDIO` no Manifest nativo gerado pelo script privado, mantem overlay/storage legado bloqueados e confirma backup Android desativado. O `app.json` permanece sem camera/microfone como padrao publico.

Build validado em 2026-05-03:

- arquivo `android/app/build/outputs/apk/debug/app-debug.apk`;
- SHA-256 `056e41d7e1e91aef10c6763bb094bfe27973693c8c163b222c6f4be2952be67b`;
- instalado no Android `23129RA5FL` via ADB Wi-Fi `192.168.0.4:5555`;
- abriu sem Metro, sem `adb reverse` e sem consulta fatal ao packager;
- permissoes de camera, microfone, localizacao fina/aproximada e notificacoes concedidas via ADB para homologacao privada;
- validacao funcional de SOS com camera permanece manual, porque a injecao de toque por ADB nao acionou os controles nesta rodada.

## Gates minimos

Antes de salvar/publicar:

```bash
npm run typecheck
npm run lint
npm test
git diff --check
```

Antes de instalar Android:

```bash
npm run build:android:debug:bundled
/Users/roberto/Library/Android/sdk/platform-tools/adb devices -l
/Users/roberto/Library/Android/sdk/platform-tools/adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

Antes de release publica:

- Myers aprova QA.
- Schneier aprova seguranca.
- Doneda aprova LGPD/documentos.
- Tarcila aprova identidade visual.
- Cristine registra memoria e timeline.
- Ze fecha decisao.
