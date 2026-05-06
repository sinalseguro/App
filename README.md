# SinalSeguro App

![Logo SinalSeguro](assets/brand/sinalseguro-logo.png)

App mobile Android e iOS do SinalSeguro.

Status: Home SOS fixa, splash aprovada, modais SinalSeguro, Cofre por icones, configuracoes iconograficas, consentimentos locais, endpoint de atualizacao e APK debug com bundle JS embutido validados em Android fisico.
Coordenacao geral: Ze.  
Gerente AI mobile: Cristine.

## Objetivo

Criar um app gratuito para pessoas em situacao de vulnerabilidade, com rede de anjos, pre-convite local, botao de panico in-app, alerta discreto, localizacao pontual consentida e cofre local. A integracao API-first so sera ativada em build homologado, com backend, contrato, chaves e auditoria.

O app nao substitui 190, 180, delegacias, saude, assistencia social, Defensoria, Ministerio Publico, Judiciario ou qualquer servico oficial.

## Stack

- React Native com Expo Dev Client/EAS.
- TypeScript.
- Expo Router.
- Android 7+.
- iOS 15.1+.
- Design system unico para Android e iOS.

## Comandos

Use Node 22.13+ para evitar incompatibilidade com Metro/React Native.

```bash
npm install
npm run assets:qr
npm run release:android:readiness
npm run typecheck
npm run lint
npm test
npm run build:android:debug:bundled
npm run start
```

Builds internos serao feitos por EAS ou build local controlado quando Kim liberar as credenciais e perfis fora do repositorio.

Atalhos da Etapa 1 Android:

```bash
npm run doctor
npm run build:android:preview
npm run build:android:production
```

## Instalacao e QR codes

Os QR codes apontam para paginas publicas estaveis. Elas serao atualizadas para GitHub Releases, TestFlight ou lojas oficiais quando os instaladores forem aprovados.

| Plataforma | QR | URL |
|---|---|---|
| Android | ![QR Android](assets/qr/sinalseguro-android.svg) | `https://www.sinalseguro.com.br/baixar/android` |
| iOS | ![QR iOS](assets/qr/sinalseguro-ios.svg) | `https://www.sinalseguro.com.br/baixar/ios` |

Status atual:

- Android: APK interno 2 assinado, validado em aparelho fisico via ADB Wi-Fi e publicado em GitHub Releases.
- iOS: TestFlight/App Store pendente.
- GitHub Releases: canal tecnico ativo para artefatos Android.

Release Android atual:

- Tag: `android-v0.1.0-internal.2`.
- APK: `https://github.com/sinalseguro/App/releases/latest/download/sinalseguro-android.apk`.
- SHA-256: `dbad294407038cac954fd3154bac6c4ea9dbb30b4e79164f58807e83f0d358cb`.

Checkpoint tecnico atual:

- Splash nativa substituida por lockup aprovado com simbolo grande, nome e fundo institucional `#120A20`.
- Home principal fixa, sem rolagem, com foco no SOS central responsivo e atalhos oficiais `Policia 190`, `Bombeiros 193` e `SAMU 192`.
- Menu retratil por engrenagem com acoes objetivas: `Cofre`, `Anjos`, `Player` e `Configuracoes`; toque fora fecha o menu.
- `Modo atual` abre modal de ajuda/opcoes dentro da identidade visual.
- Todos os alertas criticos de Home e Cofre usam modal SinalSeguro, nao `Alert.alert` nativo.
- Cofre local foi refatorado para tela fixa por icones: Player, Cofre, Funcionamento e Atualizar.
- O modal do Cofre usa grade vertical de pacotes locais; cada pacote abre acoes em linhas/colunas para visualizar, compartilhar interno futuro, excluir ou finalizar quando ativo.
- Configuracoes ficam em tela iconografica sem banner/status tecnico no topo.
- Player e trilha do cofre abrem em modais.
- Encerramento de chamado ativo pelo Cofre segue o mesmo protocolo da Home: confirmacao e codigo local opcional quando ativado.
- Modais possuem rolagem interna para reduzir risco de overflow em Android menor ou fonte ampliada.
- Componentes da Home separados em `src/features/emergency-home/` para manter evolucao modular e revisao por Tarcila, Norman, Ada, Hedy, Schneier e Myers.
- Chamado ativo tem regra singleton no servico, evitando dois pacotes `recording_local` simultaneos.
- Exclusao de pacote local exige confirmacao e fica bloqueada enquanto o chamado estiver ativo.
- Simulador web usa memoria volatil, nao cofre real.
- Pre-convite local com codigo opaco, expiracao sugerida e compartilhamento permitido pelo sistema somente para instalar/aceitar convite.
- Pacote local de emergencia com horario, consentimento, georreferencia pontual autorizada, hash e video/audio local quando a usuaria conceder camera e microfone no build privado.
- Area `Cofre local` para acessar pacotes e videos preservados neste dispositivo e verificar o que permanece bloqueado ate backend, contrato, chaves e auditoria.
- Build privado de midia local habilita `CAMERA` e `RECORD_AUDIO` para homologacao controlada; transmissao, compartilhamento externo, P2P e backend real continuam bloqueados.

APK privado atual com midia local para validacao:

- Caminho: `android/app/build/outputs/apk/debug/app-debug.apk`.
- SHA-256: `f5a407ca1937f589f8d1c1f4dc1d2f251e8cf1f7031e59ef76f3ac3373724f15`.
- Build local: `npm run build:android:private`.
- Observacao: o aparelho foi reinstalado pelo transporte ADB Wi-Fi ativo `192.168.0.4:5555`; o USB nao apareceu como transporte separado em `adb devices -l` nesta rodada.
- O APK debug atual embute o bundle JS e desliga o suporte nativo de desenvolvedor apenas neste modo de validacao, abrindo sem Metro, sem `adb reverse` e sem depender de `localhost:8081`.
- O gate publico `npm run release:android:readiness` fica bloqueado enquanto este workspace contiver a instrumentacao privada de midia (`expo-camera`/`expo-video`). Para loja/publico, usar perfil ou branch sem midia local ate a liberacao juridica.
- Cold start validado no Android fisico com `TotalTime: 4487`, sem crash fatal no `logcat` filtrado por PID do app.
- A validacao de toque SOS/camera permanece manual no aparelho, porque a injecao de toque por ADB nao acionou os controles nesta rodada.

## OIDC Google

O app esta preparado para login Google via `expo-auth-session` e troca do ID token no backend SinalSeguro por JWT interno.

Variaveis publicas do app:

- `EXPO_PUBLIC_GOOGLE_OIDC_ANDROID_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_OIDC_WEB_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_OIDC_IOS_CLIENT_ID`

Variavel segura do backend, sempre fora do Git:

- `GOOGLE_OIDC_CLIENT_IDS`

Configuracao Android para o client OAuth:

- Package name: `br.com.sinalseguro.app`
- SHA-1 local do APK debug privado atual: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`

Para esta fase, usar primeiro o client OAuth **Android**. O valor gerado deve ser colocado em `EXPO_PUBLIC_GOOGLE_OIDC_ANDROID_CLIENT_ID` no ambiente de build do app e tambem em `GOOGLE_OIDC_CLIENT_IDS` no backend, separado por virgula caso existam outros clients futuros.

Regras:

- Nao usar client secret no app.
- Nao reutilizar client OAuth do CereusIA; o SinalSeguro deve manter audiencia propria e isolada.
- Backend aceita apenas audiencias listadas em `GOOGLE_OIDC_CLIENT_IDS`.
- Google/iCloud ficam bloqueados visualmente quando o client ID da plataforma atual nao estiver configurado.

## Evidencias visuais

| Tela | Print |
|---|---|
| Home SOS | ![Home SOS](docs/assets/mobile/2026-05-03-home-sos.png) |
| Menu da Home | ![Menu Home](docs/assets/mobile/2026-05-03-home-menu.png) |
| Cofre fixo | ![Cofre fixo](docs/assets/mobile/2026-05-03-cofre-fixo.png) |
| Player modal | ![Player modal](docs/assets/mobile/2026-05-03-cofre-player-modal.png) |
| Como funciona | ![Como funciona](docs/assets/mobile/2026-05-03-funcionamento.png) |
| Home SOS bolha | ![Home SOS bolha](docs/assets/mobile/2026-05-04-home-sos-bolha.png) |
| Menu Cofre/Player | ![Menu Cofre Player](docs/assets/mobile/2026-05-04-home-menu-cofre-player.png) |
| Configuracoes sem banner | ![Configuracoes sem banner](docs/assets/mobile/2026-05-04-configuracoes-sem-banner.png) |
| Cofre modal em grade | ![Cofre modal em grade](docs/assets/mobile/2026-05-04-cofre-modal-grid.png) |

## Evidencias Android fisico - 2026-05-03

| Validacao | Print |
|---|---|
| Home sem Metro/sem reverse | ![Android Home bundled](docs/assets/mobile/2026-05-03-android-home-bundled.png) |
| Configuracoes por icones | ![Android Configuracoes](docs/assets/mobile/2026-05-03-android-configuracoes-bundled.png) |
| Cofre por icones | ![Android Cofre](docs/assets/mobile/2026-05-03-android-cofre-bundled.png) |
| SOS ativo com localizacao | ![Android SOS ativo](docs/assets/mobile/2026-05-03-android-sos-bundled-pos-localizacao.png) |
| Anel SOS destacado e Home atual | ![Android anel SOS](docs/assets/mobile/2026-05-03-android-ring-visivel-home.png) |
| Anel SOS durante pressao longa | ![Android anel SOS em hold](docs/assets/mobile/2026-05-03-android-ring-visivel-hold.png) |

## Limites

- Nao versionar `.env`, tokens, chaves, credenciais, dados reais ou relatos identificaveis.
- Nao implementar gravacao oculta.
- Nao usar acessibilidade para burlar permissoes do sistema.
- Nao prometer acionamento de orgao publico sem convenio formal.
- Nao compartilhar evidencia por share sheet do sistema; convites sao a unica excecao permitida e nao carregam evidencia.
- P2P fica como pesquisa futura/best-effort.
- Midia local fica habilitada somente no build privado de homologacao; producao publica, transmissao, anjos recebendo stream e exportacao seguem bloqueados ate RIPD/DPIA, retencao, contrato, backend, RBAC, chaves e revisao juridica.

## Documentacao

- `docs/00_PLANO_MOBILE.md`
- `docs/01_CRONOGRAMA.md`
- `docs/02_BACKLOG.md`
- `docs/03_TIMELINE.md`
- `docs/04_AGENTES.md`
- `docs/05_DESIGN_SYSTEM.md`
- `docs/06_UX_UI_IX.md`
- `docs/07_ARQUITETURA.md`
- `docs/08_SEGURANCA_LGPD.md`
- `docs/26_BUILD_PRIVADO_MIDIA_LOCAL.md`
- `docs/09_TESTES_QA.md`
- `docs/10_DISTRIBUICAO_INSTALAVEIS.md`
- `docs/11_LIFECYCLE.md`
- `docs/12_TARCILA_LOGO_README.md`
- `docs/13_ETAPA_1_ANDROID_INSTALAVEL.md`
- `docs/14_CONVITES_E_PACOTE_EMERGENCIA.md`
- `docs/15_VALIDACAO_ANDROID_RECURSOS_LOCAIS.md`
- `docs/16_SEGUNDO_PLANO_ATALHO_FISICO_E_DURACAO.md`
- `docs/17_STREAMING_COFRE_PLAYER_E_190.md`
- `docs/18_VALIDACAO_UX_SPLASH_COFRE_ANDROID.md`
- `docs/19_REFINO_SPLASH_SOS_PLAYER_BROWSER.md`
- `docs/20_HOME_SOS_FIXA_MODULAR_ANDROID_BROWSER.md`
- `docs/21_REVISAO_ESPECIALISTAS_HOME_COFRE_SEGURANCA.md`
- `docs/22_REFINO_IDENTIDADE_MODAL_COFRE_SPLASH.md`
- `docs/23_ESPECIFICACAO_DESENVOLVIMENTO_APP.md`
- `docs/24_CONTINUIDADE_COFRE_ENCERRAMENTO_QA.md`
- `docs/27_REFINO_DRAWER_COFRE_PLAYER_CONFIG.md`
- `docs/api/openapi.yaml`
