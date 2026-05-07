# 32 - Plano de Login, Videochamada, Anjos e Localizacao ao Vivo

Data: 2026-05-05
Coordenacao: Ze e Cristine
Especialistas: Ada, Ritchie, Kim, Brenda/Berners, Norman, Tarcila, Schneier, Doneda e Myers

## Objetivo

Preparar a evolucao do app para login real, videochamada de emergencia com anjo autorizado, localizacao em tempo real e compartilhamento de chaves, usando a EC2 do SinalSeguro como coordenador isolado. O desenho deve funcionar para cliente-servidor-cliente e para P2P, sem prometer integracao oficial com orgaos publicos e sem expor midia, audio ou localizacao em claro no servidor.

## Estado atual

- App mobile ja possui cliente API POO em `src/services/apiClient.ts`.
- Login por e-mail e Google OIDC estao preparados na tela `Configuracoes > Login`.
- Google OIDC Android foi validado em aparelho fisico com Google Sign-In nativo, JWT interno, SecureStore, `auth/me`, `/devices/` e logout.
- Google OIDC iOS ja possui OAuth Client ID privado para bundle `br.com.sinalseguro.app`, valor configurado no app/backend sem registro em Git; build iOS privada foi instalada no iPhone, mas login iOS ainda depende do aparelho desbloqueado para teste fisico.
- Apple Sign-In esta implementado no app/API, mas so deve ser ativado em build iOS com Apple Developer Program/Team e capability `Sign in with Apple`; Personal Team gratuito fica com `EXPO_PUBLIC_APPLE_SIGN_IN_ENABLED=0`.
- EC2 do SinalSeguro esta preparada como API/CRM isolada em `https://api.sinalseguro.com.br/api` e `https://gestao.sinalseguro.com.br`.
- Midia local ja tem arquitetura de chunks criptografados em `docs/30_MIDIA_CRIPTOGRAFADA_CHUNKS.md`.
- Compartilhamento remoto seguro ja tem desenho base em `docs/31_ARQUITETURA_COMPARTILHAMENTO_TEMPO_REAL.md`.

## Checkpoint F0 - 2026-05-05

- Google Auth Platform foi criada no projeto Google Cloud `sinalseguro`.
- Branding OAuth usa nome `SinalSeguro`, suporte e contato operacional da conta SinalSeguro.
- Publico esta como `Externo` e status `Testando`.
- Client OAuth Android `SinalSeguro Android privado` foi criado para package `br.com.sinalseguro.app` e SHA-1 do APK privado atual.
- Conta SinalSeguro foi adicionada como usuaria de teste.
- Client ID real ficou somente no Keychain local, em `.env.local` ignorado pelo Git e em `/etc/sinalseguro-api.env` na EC2.
- JSON baixado pelo console foi removido de `Downloads`.
- EC2 foi reiniciada e validada com health/readiness, `nginx -t`, `sinalseguro-api`, `cereusia-crm` e hash de `cereusia.conf`.
- O valor real do client ID nao foi registrado em Git, docs ou memoria.

## Checkpoint F1 - 2026-05-07

- Android abandonou o fluxo por navegador/Custom URI para esta frente e passou a usar Google Sign-In nativo.
- Backend emitiu JWT interno SinalSeguro via Google, sessao foi persistida em SecureStore, `auth/me` retornou usuario, `/devices/` registrou aparelho autenticado e logout revogou refresh token.
- OAuth iOS privado foi criado/configurado e a audiencia foi adicionada ao env isolado da EC2; `sinalseguro-api` e `cereusia-crm` permaneceram ativos.
- `ios/Podfile` corrige o script phase do Expo Constants para caminhos com espaco no iCloud.
- Build iOS `Release` para iPhone fisico foi aprovada e instalada via `ios-deploy`.
- Login iOS e teste de convites Android/iOS seguem bloqueados ate iPhone desbloqueado e Android reconectado/desbloqueado.
- Em maquinas com pouco espaco, alternar Android/iOS exige limpar regeneraveis da plataforma anterior antes de compilar a proxima.

## Principios obrigatorios

- Desenvolvimento, testes e operacao inicial devem permanecer em niveis gratuitos sempre que tecnicamente viavel.
- Nenhum billing pago, TURN pago, servico gerenciado pago ou upgrade de Google Cloud/AWS/Cloudflare deve ser ativado sem aprovacao explicita, estimativa de custo, limite de gasto e registro em memoria.
- Login e identidade nao podem depender de conta do navegador local do operador.
- Cada anjo deve ter conta propria, aceite expresso, dispositivo proprio e chave publica propria.
- Video, audio e localizacao ao vivo so podem ser compartilhados enquanto a emergencia estiver ativa.
- O servidor pode autenticar, autorizar, auditar, sinalizar e distribuir envelopes de chave, mas nao deve precisar descriptografar midia, audio ou localizacao.
- Conveniados entram em fase futura separada, com contrato, RBAC, MFA, retencao, auditoria, base juridica e RIPD/DPIA.
- Convites de anjos sao recurso restrito a contas adultas verificadas.
- Menores de idade podem existir como perfis/dependentes vinculados a responsavel legal verificado, mas nao podem convidar anjos, conveniados ou terceiros.
- Responsaveis podem adicionar filhos/dependentes e configurar a propria conta como anjo/responsavel do menor, com consentimento versionado, trilha de auditoria e revisao ECA Digital/LGPD.
- O modelo de menores deve considerar o risco de o agressor ser responsavel legal; nenhum compartilhamento automatico de midia, localizacao ou historico sensivel deve ocorrer sem regra de seguranca aprovada.
- Funcionamento em segundo plano significa prontidao para acionar/receber chamada ou ocorrencia, nao camera, microfone ou GPS permanentes.
- Camera, microfone e GPS so abrem durante ocorrencia ativa, com permissao e indicador do sistema.
- A pessoa protegida pode abrir chamada de audio/video com anjos ou responsaveis autorizados; localizacao nao entra nessa chamada por padrao.
- Filhos menores acionam SOS para pais/responsaveis e, futuramente, conveniados autorizados; eles nao convidam anjos nem viram anjos antes da maioridade.
- Uma pessoa adulta pode ser anjo de varios usuarios, mas so pode atender uma ocorrencia ativa por vez; alternancia precisa ser explicita e auditada.
- O modulo atual de midia criptografada por JS/Base64/loopback e prova tecnica de homologacao; chamadas longas, conveniados e nuvem exigem refatoracao para WebRTC nativo, gravacao segmentada, criptografia nativa por segmento e player nativo.

## Frentes globais atualizadas - 2026-05-07

Documento canonico: `../../../docs/tecnico/FRENTES_GLOBAIS_APP_BACKEND_MIDIA_ANJOS.md`.

Ordem:

1. Frente 1.1 - chaves reais por dispositivo, assinatura, rotacao, revogacao e perda de aparelho. Status: concluida, publicada em producao e homologada no Android fisico; iOS sera validado posteriormente.
2. Frente 1.2 - midia critica, gravacao, criptografia, player e performance.
3. Frente 1.3 - perfis, familia, maioridade e papeis.
4. Frente 2 - anjos e convites.
5. Frente 3 - ocorrencia SOS e roteamento.
6. Frente 4 - chamada audio/video sem localizacao por padrao.
7. Frente 5 - midia operacional e nuvem cifrada.
8. Frente 6 - localizacao em tempo real como canal separado.
9. Frente 7 - conveniados e orgaos.
10. Frente 8 - compliance, lojas, academico e empresa.

Proxima frente viavel apos a Frente 1.1:

- Frente 1.2, midia critica. A rede de anjos nao deve avancar antes de chave real por dispositivo, prova de posse, midia critica estabilizada e regras de perfis/familia/maioridade.

## Arquitetura alvo

```mermaid
flowchart LR
  AppUsuaria["App da usuaria"] --> API["EC2 SinalSeguro API"]
  AppAnjo["App/Web do anjo"] --> API
  API --> CRM["CRM/Gestao"]
  API --> Audit["Auditoria saneada"]
  AppUsuaria -- "WebRTC P2P: video/audio" --> AppAnjo
  AppUsuaria -- "Canal E2EE: localizacao ao vivo" --> AppAnjo
  API -- "sinalizacao, convites, envelopes" --> AppUsuaria
  API -- "sinalizacao, convites, envelopes" --> AppAnjo
```

## Fases de implementacao

### Fase 0 - OIDC e base de identidade

- Criar branding Google Auth Platform do projeto `sinalseguro`.
- Criar OAuth client Android para `br.com.sinalseguro.app` e SHA-1 do APK privado atual.
- Guardar client ID apenas em ambiente seguro do app e backend; nenhum valor real entra em Git ou memoria.
- Configurar `GOOGLE_OIDC_CLIENT_IDS` na EC2 e reiniciar `sinalseguro-api`.
- Validar `Entrar com Google` no Android e `POST /api/auth/google` no backend.
- Criar OAuth Client ID iOS para `br.com.sinalseguro.app` antes de validar `Entrar com Google` no iPhone.
- Ativar `EXPO_PUBLIC_APPLE_SIGN_IN_ENABLED=1` apenas quando o Bundle ID possuir capability Apple Sign-In no Team correto.

Pronto quando:

- login Google gera JWT interno do SinalSeguro;
- sessao fica em `expo-secure-store`;
- logout revoga refresh token;
- `nginx -t`, `sinalseguro-api`, `cereusia-crm` e hash de `cereusia.conf` continuam aprovados.

### Fase 1 - Contas, dispositivos e chaves

- Registrar dispositivo autenticado no endpoint `/devices/`.
- Gerar par de chaves do dispositivo no app.
- Enviar apenas chave publica e hash para o backend.
- Permitir revogacao de dispositivo e rotacao de chave.
- Registrar consentimentos versionados para login, emergencia, midia, localizacao e anjos.
- Classificar conta como `adulto`, `responsavel` ou `menor_dependente`, sem confiar apenas em texto livre informado pelo usuario.

Pronto quando:

- cada sessao autenticada tem dispositivo conhecido;
- chave privada nunca sai do aparelho;
- logs nao contem token, IP em claro, user-agent em claro, coordenada ou payload sensivel.

### Fase 1.1 - Responsaveis, filhos e maioridade

- Criar modelo minimo de vinculo `responsavel_dependente`, com responsavel adulto verificado e filho/dependente menor.
- Permitir que responsaveis adicionem filhos/dependentes e gerenciem destinatarios de emergencia do menor.
- Bloquear no app e na API qualquer convite de anjo iniciado por conta menor.
- Tratar pais/responsaveis como anjos padrao do menor somente apos aceite, dispositivo registrado e chave publica valida.
- Registrar consentimento versionado do responsavel e aviso de finalidade para emergencia, localizacao, video/audio e armazenamento.
- Aplicar minimizacao: o perfil do menor deve coletar apenas o necessario para identificacao, seguranca e acionamento.
- Adiar chat, rede social, videochamada livre ou compartilhamento amplo envolvendo menor ate politica de moderacao, denuncia, bloqueio, idade e revisao juridica.

Pronto quando:

- API nega convite criado por menor mesmo que o app falhe;
- responsavel consegue vincular dependente sem expor dados sensiveis em logs;
- o menor consegue acionar emergencia para responsaveis autorizados;
- Doneda/Schneier aprovam matriz de dados, risco de responsavel agressor, consentimento e retencao.

### Fase 2 - Anjos e convites

- Criar convite opaco, expiravel e de uso unico.
- Anjo aceita convite com conta propria.
- Convite so pode ser criado por conta adulta/responsavel autorizada; conta menor nao pode convidar.
- Anjo registra dispositivo e chave publica.
- Usuaria adulta ou responsavel pode revogar, pausar ou bloquear anjo.
- API retorna apenas anjos autorizados e com chave valida para emergencia.

Pronto quando:

- nao existe compartilhamento para contato mock ou anjo pendente;
- aceite, revogacao e bloqueio ficam auditados;
- UI deixa claro quem recebera emergencia antes de ativar compartilhamento real.

### Fase 3 - Emergencia remota idempotente

- App cria `/emergency-sessions/` com `client_alert_id` e `idempotency_key`.
- API responde de forma idempotente em repeticoes.
- App monta plano de destinatarios autorizados.
- App cria chave efemera de sessao e envelopes por anjo.
- API guarda somente envelope criptografado, metadados minimos e auditoria saneada.

Pronto quando:

- emergencia funciona offline/local se API falhar;
- reenvio nao duplica sessao;
- sem midia real no servidor nesta fase.

### Fase 4 - Sinalizacao e videochamada P2P

- Definir adaptador WebRTC para Android/iOS.
- Usar API apenas para troca de offer, answer, ICE candidates e eventos de controle.
- Usar TURN apenas como fallback tecnico futuro, com risco e custo avaliados.
- Manter DTLS-SRTP do WebRTC e envelope de chaves para dados auxiliares.
- Encerrar canais quando a emergencia for encerrada.

Pronto quando:

- pause/resume/replay de UI nao recria sessoes indevidas;
- app recupera falha de candidato ICE;
- chamadas encerram ao revogar anjo, sair da conta ou finalizar emergencia;
- Myers valida tempo ate primeiro frame, memoria, CPU e reconexao.

### Fase 5 - Localizacao em tempo real

- Coletar localizacao somente durante emergencia ativa e com permissao em contexto.
- Aplicar intervalo adaptativo para bateria e seguranca.
- Enviar localizacao em canal criptografado para anjos autorizados.
- Parar coleta imediatamente ao encerrar emergencia ou revogar permissao.
- Nunca registrar coordenada em logs; guardar somente metadado minimo de status quando necessario.

Pronto quando:

- app mostra estado claro de compartilhamento ativo;
- background location so entra se houver justificativa, disclosure e politica aprovadas;
- Google Play Data Safety e Apple Privacy Details refletem exatamente o comportamento.

### Fase 6 - CRM e area admin

- CRM deve separar gestao operacional de dados sensiveis.
- Modulos iniciais:
  - usuarios e dispositivos;
  - responsaveis, filhos/dependentes e politica de maioridade;
  - anjos, convites e consentimentos;
  - sessoes de emergencia com status saneado;
  - auditoria;
  - configuracoes do hub de login;
  - politicas e versoes de termos;
  - fila de revisao tecnica e juridica.
- Norman/Tarcila revisam fluxo visual antes de qualquer publicacao.
- Schneier/Doneda definem mascaramento, acesso por papel e retencao.

Pronto quando:

- admin exige staff, papel adequado e MFA na fase de producao;
- auditoria nao exibe segredo nem dado bruto;
- conveniados continuam fora ate contrato e permissao propria.

### Fase 7 - Loja, leis e release

- Atualizar politica de privacidade, termos, matriz LGPD, RIPD/DPIA e retencao.
- Declarar camera, microfone, localizacao, identificadores, conta, contatos e dados sensiveis nas lojas.
- Criar fluxo de exclusao de conta e exportacao quando aplicavel.
- Ativar perfis de menores somente com politica ECA Digital/LGPD especifica, responsavel verificado, consentimento adequado, minimizacao e controles contra abuso.
- Validar Apple Sign-In se houver outro login social no iOS publico.

Pronto quando:

- Google Play Data Safety e Apple Privacy Details batem com codigo e backend;
- consentimentos sao versionados;
- release publica nao usa permissoes ou coleta sem finalidade ativa.

## Sequencia sem retrabalho apos interrupcao

1. Ler `AGENTS.md`, `.codex/memory/CRISTINE.md`, `docs/03_TIMELINE.md`, este documento e `docs/31_ARQUITETURA_COMPARTILHAMENTO_TEMPO_REAL.md`.
2. Rodar `git status --short --branch`.
3. Confirmar se o client ID Google real ja existe em ambiente seguro, sem imprimir o valor.
4. Validar API com `Testar API` no app ou por health check.
5. Avancar apenas no proximo bloco incompleto da fase atual.
6. Antes de build, deploy ou configuracao externa, registrar checkpoint em memoria e docs.

## Lacunas tecnicas que bloqueiam midia real

Antes de ativar video/audio/localizacao reais para anjos, fechar estes contratos:

- OpenAPI unico para `auth`, `devices`, `trusted_contacts`, `recipient_public_keys`, `emergency_sessions`, `key_envelopes`, `p2p_signaling`, `location_stream` e `audit`.
- OpenAPI e modelo de dominio para `guardians`, `dependents`, `age_assurance`, `guardian_consents` e bloqueio server-side de convites por menores.
- Modelo de chaves por dispositivo: geracao local, armazenamento seguro, chave publica, assinatura ou verificacao, rotacao, revogacao e perda de aparelho.
- Envelope de chave: algoritmo, AAD, versao de esquema, destinatarios multiplos, reenvio, revogacao e acesso apos encerramento.
- WebRTC: STUN/TURN, politica de relay, autenticacao da sinalizacao, expiracao de offer/answer/ICE, mitigacao de spam e fallback.
- Localizacao ao vivo: frequencia, precisao, pausa, encerramento, buffer offline, retencao e descriptografia pelo anjo sem servidor ver claro.
- Outbox remota mobile: fila idempotente para login, dispositivo, convites, emergencia, envelopes, sinalizacao e localizacao com rede oscilante.
- RBAC desde o banco/API: usuaria, anjo, admin, auditor e conveniado futuro.
- Retencao por tipo de dado: midia cifrada local, envelopes, localizacao, metadados, logs de sinalizacao, auditoria e tombstones.
- Threat model formal: agressor com acesso fisico ao aparelho, anjo malicioso, token roubado, replay de convite, troca de chave, enumeracao de usuarios e vazamento de localizacao.

Prioridade pratica: concluir `OIDC + devices + chaves publicas + anjos + envelopes + emergency_sessions` antes de midia real, localizacao continua ou P2P critico.

## Checkpoint Frente 1 Android - 2026-05-06

- API publica reconfirmada com `health=ok` e readiness `database=ok`.
- Ambiente local do app contem as variaveis esperadas de API/Google OIDC sem valores registrados.
- `Configuracoes > Login` passou a informar se Google OIDC esta configurado para a plataforma atual.
- Login social persiste JWT em SecureStore e valida `auth/me` quando necessario.
- Bootstrap autenticado registra dispositivo em `/devices/`, sem push token nesta frente.
- Logout chama revogacao do refresh token e limpa a sessao local.
- Base de chave publica real foi implementada, publicada e homologada no Android fisico na Frente 1.1 com Ed25519, prova de posse, rotacao e revogacao/perda; iOS sera validado posteriormente.
- Validacao Android fisica ficou pendente porque ADB nao encontrou aparelho.

## Checkpoint complementar Frente 1 Android - 2026-05-07

- Android fisico foi validado por ADB apos instabilidade do transporte USB, sem registrar IP, serial ou e-mail.
- Build Android privado passou e gerou `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256 `c527276c91ed274295062fb0d194b1c6f1f5e8ee0e9a00574e433f618247de31`.
- App abriu no pacote `br.com.sinalseguro.app` em Android 15.
- `Configuracoes > Login` confirmou API configurada, dispositivo a registrar apos login e Google OIDC configurado para Android, sem exibir Client ID.
- `Testar API` no app fisico respondeu `API SinalSeguro online: ok.`.
- `Entrar com Google` abriu o OAuth do Google, mas o provedor bloqueou antes do consentimento com `Erro 400: invalid_request` e mensagem saneada `Custom URI scheme is not enabled for your Android client.`
- Como nao houve ID token, seguem nao validados no caminho real: `POST /auth/google`, JWT interno, persistencia final no SecureStore, `auth/me`, `/devices/` autenticado e logout com revogacao do refresh token.
- Acao externa necessaria: habilitar custom URI scheme no OAuth Android privado do Google Cloud e repetir o login fisico sem imprimir Client ID, token ou e-mail.

## Checkpoint redirect OAuth Android corrigido - 2026-05-07

- Documento canônico de estado app/backend: `../../../docs/tecnico/ESTADO_ATUAL_APP_BACKEND_2026-05-07.md`.
- Diagnóstico local confirmou que o APK aceitava `sinalseguro://`, mas não aceitava `br.com.sinalseguro.app:/oauthredirect`, redirect nativo usado pelo provider Google do Expo no Android.
- `app.json` passou a registrar os schemes `sinalseguro` e `br.com.sinalseguro.app`.
- Prebuild Android atualizou o Manifest nativo.
- APK privado recompilado e reinstalado no Android físico.
- ADB confirmou que `br.com.sinalseguro.app:/oauthredirect`, `sinalseguro:/oauthredirect` e `sinalseguro://configuracoes` resolvem para `br.com.sinalseguro.app`.
- Gates aprovados na rodada: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build:android:private` e `git diff --check`.
- APK privado local atualizado: SHA-256 `e975046c54c756af14feba64fe40b83877252bb96bca0d97f2d334624218801b`.
- Bloqueio restante segue externo: habilitar `Custom URI scheme` no OAuth Android privado do Google Cloud e repetir o login real.

## Checkpoint callback OAuth Android corrigido - 2026-05-07

- Google Cloud: `Custom URI scheme` habilitado no OAuth Android privado sem registrar Client ID real e sem billing/free trial.
- O Google passou a chegar ao seletor de conta e retornar codigo para o app.
- O bloqueio seguinte era local: `sinalseguro://oauthredirect` entrava em `Unmatched Route`.
- O app agora tem rota `oauthredirect`, `maybeCompleteAuthSession` no layout raiz e fluxo Google PKCE com estado efemero no SecureStore.
- A conclusao troca codigo por ID token, chama `POST /auth/google`, persiste JWT, valida usuario quando necessario, registra `/devices/` e sincroniza consentimentos.
- API publica reconfirmada: `health=ok` e readiness `database=ok`.
- Gates aprovados: `npm run typecheck`, `npm run lint`, `npm test` e `npm run build:android:private`.
- APK privado instalado no Android fisico: SHA-256 `669ccbc6a701b6f1ecec18d9bda93761074be3c754e918042e73e197b672d8b0`.
- Bloqueio restante e operacional: aparelho entrou em keyguard/NotificationShade e precisa ser desbloqueado para a validacao final de login/logout.

## Checkpoint OAuth Google em producao - 2026-05-07

- Google Auth Platform estava em `Testing`, com acesso limitado a usuarios de teste.
- A tela de escopos foi conferida antes da mudanca e nao listava escopos confidenciais nem restritos.
- O app OAuth foi publicado em producao para publico externo, sem billing/free trial e sem registrar Client ID real.
- Esse ajuste remove a necessidade de pre-cadastro manual de test users para login basico.
- O reteste Android fim a fim permanece pendente porque o ADB perdeu o dispositivo apos a publicacao; reconectar/desbloquear antes de repetir login.

## Gates de compliance e loja

- LGPD: matriz de dados, bases legais, controlador/operador, encarregado/canal, finalidades, retencao, descarte, compartilhamentos, RIPD/DPIA, direitos do titular e logs saneados.
- ECA Digital / Lei 15.211/2025: classificar acesso provavel por criancas/adolescentes, definir politica de idade, permitir responsaveis adicionarem filhos/dependentes, bloquear convites iniciados por menores, evitar supervisao parental generica quando o responsavel puder ser agressor, e bloquear chat/video/rede social sem moderacao, denuncia e bloqueio.
- Google Play: Data Safety consistente com SDKs/backend, politica de privacidade ativa, prominent disclosure para camera/microfone/localizacao, account deletion e formulario/video para background location se existir.
- Apple: App Privacy Details, exclusao de conta no app, Sign in with Apple quando exigido por login social, push sem dado sensivel, suporte/moderacao para comunicacao entre usuarios.
- Videochamada: somente homologacao controlada ate consentimento especifico, indicador visivel de camera/microfone, retencao definida, auditoria e RIPD.
- Localizacao em tempo real: nao entra direto no MVP publico; comecar por localizacao pontual consentida e evoluir para tempo real apenas com disclosure, revogacao e revisao de loja.

## Checkpoint Frente 1 Android concluida - 2026-05-07

- Android deixou de usar navegador/Custom URI para login Google porque o provedor continuou bloqueando o fluxo por politica de resposta segura.
- Fluxo Android agora e Google Sign-In nativo via Play Services, com Web Client ID mantido somente em ambiente seguro local/EC2.
- EC2: audiencia Web adicionada apenas ao ambiente SinalSeguro; somente `sinalseguro-api` foi reiniciado; `cereusia-crm` permaneceu ativo e `cereusia.conf` nao foi alterado.
- Android fisico validou seletor nativo Google, `/auth/google`, JWT interno, SecureStore, `auth/me`, registro autenticado em `/devices/` e logout com revogacao de refresh token.
- Logs do processo do app nao expuseram token, refresh token, access token, Client ID real ou e-mail.
- Gates aprovados: `npm run typecheck`, `npm run lint`, `npm test`, `git diff --check` e build Android privado.
- APK privado validado: SHA-256 `1ca183fe0c68bd4ad45f9330da1ef93ca14bbd1789d5ed0015eada2a19d4087f`.
- Limite restante para anjos reais: deployar/homologar a Frente 1.1 de chaves reais por dispositivo e fechar as frentes seguintes de midia critica e perfis/familia/maioridade.

## Checkpoint sessao unica iOS/Android - 2026-05-07

- iPhone fisico concluiu login Google no app privado e backend manteve dispositivo iOS ativo.
- Android foi recompilado no modo debug bundled, reinstalado via ADB Wi-Fi e abriu sem crash.
- O fluxo `Configuracoes > Login > Entrar com Google` no Android mostrou modal de bloqueio quando a mesma conta ja estava ativa no iPhone.
- A mensagem exibida orienta logout no aparelho ativo ou uso/criacao de outra conta.
- Backend confirmou bloqueio recente com dispositivo ativo `ios` e tentativa corrente `android`.
- Estado final saneado do usuario: Android revogado, iOS ativo, chave publica/hash presentes no dispositivo ativo e push token ausente.
- API publica segue `health=ok` e readiness `database=ok`.
- Gates da rodada: `npm run typecheck`, `npm run lint`, `npm test`, `manage.py test sinalseguro_api.tests.test_platform_base` e `git diff --check`.
- Nenhum Client ID real, token, e-mail pessoal, IP, serial, user-agent, push token ou payload sigiloso foi registrado.
- Frente 1.1 de chaves reais por dispositivo foi implementada localmente na sessao `019e0346-97cd-7153-87ba-730bd455b5db`. Proxima frente apos deploy/homologacao: Frente 1.2, midia critica, gravacao, criptografia, player e performance. Rede de anjos passa a ser Frente 2, depois da Frente 1.3 de perfis/familia/maioridade.

## Fontes normativas para revisao

- Google OAuth 2.0 Policies: `https://developers.google.com/identity/protocols/oauth2/policies`
- Google Play User Data: `https://support.google.com/googleplay/android-developer/answer/10144311`
- Google Play Data Safety: `https://support.google.com/googleplay/android-developer/answer/10787469`
- Apple App Privacy Details: `https://developer.apple.com/app-store/app-privacy-details/`
- Apple App Review Guidelines: `https://developer.apple.com/app-store/review/guidelines/`
- LGPD: `https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm`
- ECA Digital: `https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15211.htm`
