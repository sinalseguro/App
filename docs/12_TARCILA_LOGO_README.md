# 12 - Tarcila: Logo, README e QR Codes

Responsavel visual: Tarcila  
Supervisao: Ze  
Gerencia mobile: Cristine

## Decisao visual

Foi adotada a marca ja aprovada nos portais:

- `assets/brand/sinalseguro-logo.png`;
- `assets/brand/sinalseguro-symbol.png`.
- `assets/brand/sinalseguro-icon.png`, derivado do simbolo aprovado para uso como icone de app, adaptive icon Android e splash interno.

O README do app usa a logo horizontal para reconhecimento imediato do projeto e mantem linguagem de seguranca, gratuidade e limites.

## Aplicacao no app

- Nome oficial: `SinalSeguro`.
- Lockup da tela inicial: simbolo aprovado + nome `SinalSeguro` + assinatura `Rede de Protecao e Amparo`.
- Icone do app: fundo `#1E1B2E` com simbolo aprovado centralizado, sem marcas de terceiros.
- Splash: logo SinalSeguro sobre fundo institucional escuro.
- Nenhuma tela deve usar marca de orgao publico, governo, universidade ou parceiro como se houvesse convenio confirmado.

## Parecer Etapa 1 Android - Release interna 2

Tarcila coordenou Norman, Ada e Myers nos seguintes ajustes obrigatorios para a release interna 2:

- aplicar o simbolo aprovado na tela inicial: concluido;
- corrigir contraste do botao de panico simulado usando `colors.panic = #C2185B`: concluido;
- registrar o icone de aplicativo em `app.json`: concluido;
- configurar splash com logo e fundo institucional: concluido;
- manter o nome `SinalSeguro` sem variacoes, apelidos ou abreviacoes em superficies publicas do app: concluido.

Status: aprovado para homologacao interna 2, com uso restrito aos limites juridicos, de seguranca e de QA registrados na documentacao da Etapa 1.

Evidencias:

- APK instalado em Android fisico via ADB Wi-Fi;
- `versionCode=2`, `versionName=0.1.0`;
- label Android `SinalSeguro`;
- screenshot local saneado em `/tmp/sinalseguro-android-qa/home-v2.png`;
- icone mestre registrado em `IdentidadeVisual/sinalseguro/app/MANIFESTO_ICONE_APP_2026-05-02.md`.

## QR codes

Os QR codes foram preparados com as cores da marca:

- Android: `assets/qr/sinalseguro-android.svg`;
- iOS: `assets/qr/sinalseguro-ios.svg`.

Os QR codes apontam para URLs estaveis do portal, nao para arquivos volateis. Quando os instaladores forem publicados, as paginas do portal passam a apontar para GitHub Releases, TestFlight ou lojas oficiais.

## Regra de aprovacao

Nenhum novo icone, logo, splash, mockup ou imagem institucional entra no app ou portal sem revisao visual de Tarcila e sem confirmar que nao representa parceria inexistente.
