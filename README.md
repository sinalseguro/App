# SinalSeguro App

![Logo SinalSeguro](assets/brand/sinalseguro-logo.png)

App mobile Android e iOS do SinalSeguro.

Status: APK Android interno 2 publicado para homologacao controlada, com identidade visual validada por Tarcila.
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

- Pre-convite local com codigo opaco, expiracao sugerida e compartilhamento permitido pelo sistema somente para instalar/aceitar convite.
- Pacote local de emergencia com horario, consentimento, georreferencia pontual autorizada e hash, sem envio externo neste build.
- Area `Cofre local` para acessar os pacotes gravados neste dispositivo e verificar o que permanece bloqueado ate backend, contrato, chaves e auditoria.
- Midia real, camera, microfone e transmissao continuam bloqueados fora da homologacao.

## Limites

- Nao versionar `.env`, tokens, chaves, credenciais, dados reais ou relatos identificaveis.
- Nao implementar gravacao oculta.
- Nao usar acessibilidade para burlar permissoes do sistema.
- Nao prometer acionamento de orgao publico sem convenio formal.
- Nao compartilhar evidencia por share sheet do sistema; convites sao a unica excecao permitida e nao carregam evidencia.
- P2P fica como pesquisa futura/best-effort.
- Midia real fica bloqueada para producao ate RIPD/DPIA, retencao e revisao juridica.

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
- `docs/09_TESTES_QA.md`
- `docs/10_DISTRIBUICAO_INSTALAVEIS.md`
- `docs/11_LIFECYCLE.md`
- `docs/12_TARCILA_LOGO_README.md`
- `docs/13_ETAPA_1_ANDROID_INSTALAVEL.md`
- `docs/14_CONVITES_E_PACOTE_EMERGENCIA.md`
- `docs/api/openapi.yaml`
