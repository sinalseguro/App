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
- Exclusao local grava tombstone/auditoria antes de remover o pacote.

## Midia, camera e streaming

- Build publico nao solicita `CAMERA` nem `RECORD_AUDIO`.
- Preferencias de camera frontal/traseira/ambas sao apenas preparo para homologacao.
- Video/audio real exigem RIPD/DPIA, contrato, consentimento versionado, indicador visual, criptografia, hashes e auditoria.
- Streaming WebRTC/P2P fica futuro/best-effort, nunca promessa de emergencia.

## Dados e seguranca

- Pacote local registra horario, consentimento, localizacao pontual se autorizada, manifesto de midia e hash.
- Web usa simulador volatil para cofre seguro.
- Dispositivo usa `expo-secure-store` para registros pequenos.
- Midia real futura deve usar arquivo criptografado no armazenamento do app, com chave pequena no cofre do sistema e envelope pelo backend.
- Logs nao podem conter coordenadas completas, tokens, payloads sensiveis, chaves, audio, video ou relatos.

## Permissoes

Declaradas no build publico:

- `ACCESS_FINE_LOCATION`.
- `ACCESS_COARSE_LOCATION`.
- `POST_NOTIFICATIONS`.

Bloqueadas no build publico:

- `CAMERA`.
- `RECORD_AUDIO`.
- `SYSTEM_ALERT_WINDOW`.
- `READ_EXTERNAL_STORAGE`.
- `WRITE_EXTERNAL_STORAGE`.

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
./gradlew assembleDebug
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
