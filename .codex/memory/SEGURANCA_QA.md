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
