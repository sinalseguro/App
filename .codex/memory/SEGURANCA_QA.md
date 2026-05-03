# Memoria - Schneier, Doneda e Myers

Data: 2026-05-03  
Papel: seguranca, LGPD e QA.

## Decisoes bloqueantes

- Build publico nao pode solicitar `CAMERA` nem `RECORD_AUDIO`.
- Video, audio, streaming e upload real ficam bloqueados ate homologacao controlada.
- Homologacao exige RIPD/DPIA, termos, consentimento versionado, retencao, auditoria, criptografia e criterio de loja.
- Alertas criticos devem ser modais internos para consistencia visual e testabilidade.
- Compartilhamento externo de evidencia segue bloqueado.
- Logs nao podem conter dados sensiveis, coordenadas completas, tokens, payloads ou midia.

## Gates atuais

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `./gradlew assembleDebug`: aprovado.
- Browser Use validou Home, drawer, Cofre, Player e Funcionamento.
- `release:android:readiness`: aprovado com Node 24 via `PATH="/Applications/Codex.app/Contents/Resources:$PATH"`.
- Cofre passou a respeitar o mesmo protocolo de encerramento seguro da Home: confirmacao e codigo local opcional.
- Matriz de permissoes documenta permissoes transitivas do APK debug; camera, microfone, overlay e storage legado seguem ausentes.

## Pendencia QA

- Validacao Android fisica desta rodada ficou pendente porque `adb devices -l` nao detectou o aparelho.
- Release interna 3 segue bloqueada ate validacao Android fisica e aprovacao Tarcila/Myers.
