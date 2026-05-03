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

- APK privado foi instalado no Android `192.168.0.4:5555` e abriu sem crash em cold start.
- Validacao manual do gesto SOS com camera ainda precisa de aprovacao do Roberto/Myers no aparelho fisico, porque a injecao de toque por ADB nao acionou os controles da tela.
