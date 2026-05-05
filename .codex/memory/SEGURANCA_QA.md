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
