# 22 - Refino de identidade, splash, modais e cofre fixo

Data: 2026-05-03  
Responsavel: Ze  
Coordenacao mobile: Cristine  
Validacao visual: Tarcila com Norman  
Validacao tecnica: Ada, Hedy, Margaret  
Validacao seguranca/LGPD/QA: Schneier, Doneda, Myers

## Objetivo

Atender aos comentarios de revisao visual e funcional feitos no navegador, deixando a Home e o Cofre prontos para validacao simulada e para nova instalacao Android quando o aparelho voltar a aparecer no ADB.

## Ajustes implementados

- Splash nativa substituida por `assets/brand/sinalseguro-splash-approved.png`, com simbolo grande, nome `SinalSeguro` e fundo institucional `#120A20`.
- Splash React mantida com simbolo, nome, assinatura e barra de loading.
- Topo do app passou a usar componente reutilizavel `AppTopBar`, com logo, contexto, botao voltar e menu.
- Home continua fixa, sem rolagem, com foco no SOS central e atalhos oficiais.
- Registro historico: o drawer da Home chegou a ter `Modo atual` clicavel, icone de ajuda e modais SinalSeguro; no checkpoint posterior, modo/status foram removidos da Home e o drawer ficou restrito a acoes iconograficas.
- `Alert.alert` foi removido dos fluxos criticos de Home e Cofre; confirmacoes passam por `BrandedDialog`.
- SOS recebeu efeito visual 3D discreto, profundidade, estado pressionado e particulas ativas mais altas e lentas.
- Cofre local foi refeito como tela fixa por icones: Player, Cofre, Funcionamento e Atualizar.
- Dados tecnicos do Cofre foram movidos para o menu sanduiche.
- Player e trilha do cofre abrem em modais de identidade visual.
- O Cofre reutiliza o protocolo de encerramento seguro da Home quando um chamado ativo for finalizado pela trilha local.
- `BrandedDialog` recebeu rolagem interna para proteger telas menores e fonte ampliada.
- Nova pagina `Como funciona` explica acionamento, localizacao, cofre, criptografia, midia e privacidade.
- Configuracoes ganharam preparacao de preferencia para video local futuro: frontal, traseira ou ambas.

## Decisoes de seguranca

- Camera, microfone, video real, audio real, streaming e upload de midia continuam bloqueados no build publico.
- Preferencias de camera sao apenas preparo de homologacao; o app nao solicita `CAMERA` nem `RECORD_AUDIO`.
- Midia real so pode avancar com RIPD/DPIA, contrato, consentimento versionado, criptografia, retencao, auditoria e revisao Schneier/Doneda/Myers.
- O cofre web permanece simulador visual/volatil; dados sensiveis reais nao entram neste checkpoint.

## Evidencias visuais

Home SOS:

![Home SOS](assets/mobile/2026-05-03-home-sos.png)

Menu da Home:

![Menu da Home](assets/mobile/2026-05-03-home-menu.png)

Cofre fixo:

![Cofre fixo](assets/mobile/2026-05-03-cofre-fixo.png)

Player em modal:

![Player modal](assets/mobile/2026-05-03-cofre-player-modal.png)

Como funciona:

![Como funciona](assets/mobile/2026-05-03-funcionamento.png)

## Validacoes executadas

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `./gradlew assembleDebug`: aprovado.
- Browser Use em `http://localhost:8081/`: Home, drawer, modais, Cofre e Funcionamento validados.
- `PATH="/Applications/Codex.app/Contents/Resources:$PATH" npm run release:android:readiness`: aprovado como pronto condicionado, com pendencias esperadas de assinatura e diretorio nativo gerado/ignorado.

Complemento posterior desta rodada:

- `docs/24_CONTINUIDADE_COFRE_ENCERRAMENTO_QA.md` registra a correcao do encerramento protegido pelo Cofre, prints recapturados, matriz de permissoes e pendencias de Android fisico.

## Android

APK debug atualizado:

- Caminho local: `android/app/build/outputs/apk/debug/app-debug.apk`.
- SHA-256: `481d9aca5dd1cabb36520440f7959c71b542af5619803aadbe5170164b300e70`.

Instalacao fisica:

- Bloqueada nesta rodada porque `adb devices -l` nao retornou nenhum aparelho, mesmo apos `adb kill-server` e `adb start-server`.
- Quando o Android reaparecer no ADB, reinstalar com:

```bash
/Users/roberto/Library/Android/sdk/platform-tools/adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

## Handoff para portais

Sessao de referencia dos portais: `019ddfad-a214-72a3-9b50-ba204e1c9351`.

Os agentes de portal devem usar este checkpoint para refatorar o conteudo publico com foco em:

- app como camada central do MVP;
- botao SOS in-app;
- gratuidade;
- privacidade e LGPD;
- cofre local;
- midia real apenas em homologacao;
- rede de anjos e convites;
- ausencia de promessa de orgaos publicos sem convenio formal.

## Pendencias

- Reinstalar no Android fisico quando o aparelho voltar ao ADB.
- Validar splash nativa no aparelho reinstalado.
- Gerar release interna 3 somente depois da validacao fisica aprovada por Tarcila/Myers.
- Atualizar portais apos aceite visual do app.
