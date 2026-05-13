# 34 - Decisao de Escopo: MVP Android Primeiro, iOS Pos-MVP

Data: 2026-05-13
Responsavel: Ze
Frente: 1.2 - midia critica, gravacao, criptografia, cofre e player

## Decisao

Roberto decidiu interromper a tentativa de destravar iPhone/iOS nesta fase porque o custo operacional passou a bloquear o andamento do projeto.

A partir deste checkpoint:

- a conclusao do MVP deve focar no Android;
- iPhone/iOS fica formalmente movido para etapa pos-MVP;
- a Frente 1.2 deve ser finalizada em torno dos gates Android viaveis;
- nao iniciar novas tentativas de build, instalacao, debug, Appium, WebDriverAgent, CoreDevice, `devicectl`, `idevicesyslog` ou validacao fisica iPhone durante a conclusao do MVP Android;
- os achados iOS ficam preservados para retomada futura, sem bloquear as proximas frentes do MVP Android.

## Estado Android que sustenta a decisao

O Android ja tem uma base fisica forte para seguir:

- fluxo de SOS com gravacao local;
- preservacao nativa `native_segmented_v1`;
- criptografia AES-256-GCM por segmento;
- cofre com estado protegido;
- player com fonte temporaria preparada;
- limpeza de midia clara persistente;
- matriz fisica anterior com 60s, 3min e ciclo longo;
- inventario saneado anterior com 0 midias claras persistentes;
- validacoes locais recorrentes: `typecheck`, `lint`, `test`, `test:crypto`, `test:device-keys`, readiness privado e `git diff --check`.

O foco agora e consolidar esse caminho Android como MVP 100% funcional e nao manter o iPhone como bloqueio.

## Entraves iPhone/iOS registrados

Durante a Frente 1.2, o iPhone exigiu varias camadas de contencao:

- `recordAsync` e `stopRecording` tiveram comportamento instavel em testes fisicos;
- houve casos de pacote sem midia, preservacao tardia e saturacao por ciclo continuo;
- foi necessario criar JSONL operacional saneado para isolar falhas sem expor URI, caminho sensivel, chave, nonce/tag, hash bruto, token, e-mail, IP, coordenada, payload ou midia;
- o iPhone fisico validou ciclos curtos e preservacao nativa parcial, mas nao fechou a matriz longa da frente;
- o player do arquivo de 36s abriu em teste fisico;
- o arquivo de 1min38 inicialmente nao reproduziu;
- apos rebase de caminho de container iOS, houve evidencias de `playback_player_replace_result` e `playback_start_result` para playback curto;
- na rodada seguinte, a UX foi ajustada para mostrar o pacote de 1min38 como `1 video`, eliminando a fragmentacao visivel para usuario leigo;
- porem, ao abrir o player unificado com 8 segmentos, o preparo nativo iOS falhou com `playback_prepare_error`, `assetCount: 8`, `storageEngine: native_segmented_v1` e `errorCode: media_error`;
- a hipotese tecnica preservada para retomada e fragilidade do merge nativo iOS com `AVMutableComposition`/`AVAssetExportSession` em multiplos MP4 curtos, alem de possivel impacto de nomes temporarios longos;
- foi aplicado patch experimental no motor iOS para nomes temporarios curtos e export normalizado, mas ele nao foi validado fisicamente e nao deve ser tratado como gate aprovado.

## Entraves de ferramenta iOS

O bloqueio tambem foi operacional:

- `devicectl` listou o iPhone como indisponivel em CoreDevice;
- `devicectl` falhou com erro de usage assertion no iPhone;
- `idevicedebug` conseguia relancar o app, mas nao entregou deep link de navegacao;
- a validacao visual precisou depender de screenshots via cabo e acao manual no aparelho;
- Appium/WebDriverAgent ja havia sido pesquisado, mas seguiu bloqueado pelo runner fisico;
- o Xcode 26.5 mostrou SDK `iphoneos26.5`, mas marcou `Any iOS Device` e o iPhone fisico como inelegiveis com a mensagem de que iOS 26.5 nao estava instalado;
- tentativa de `xcodebuild -downloadPlatform iOS` ficou silenciosa por varios minutos e foi interrompida para nao consumir tempo/espaco;
- o disco estava com margem apertada, exigindo limpeza de regeneraveis.

## Evidencias preservadas

Evidencias da rodada ficam sob:

- `docs/evidencias/ios/2026-05-13-frente-1-2-unified-player/`

Principais evidencias:

- app instalado e aberto no iPhone;
- cofre mostrando o arquivo de 1min38 como `1 video`;
- player abrindo o pacote como item unico;
- erro visual `Video indisponivel` no player unificado;
- logs saneados indicando `native_playback_source_uri_rebased` e `playback_prepare_error` para 8 segmentos.

Essas evidencias sao internas de engenharia e nao devem virar material publico.

## Nova regra de continuidade

Para concluir o MVP:

1. nao gastar mais ciclos nesta etapa com iOS/iPhone;
2. regenerar Android quando necessario;
3. instalar APK privado Android no aparelho fisico;
4. repetir smoke fisico Android com SOS, cofre, player, fechamento e inventario saneado;
5. se os gates Android passarem, considerar a Frente 1.2 suficiente para liberar as proximas frentes do MVP Android;
6. registrar iOS como backlog pos-MVP com tarefa propria, ambiente proprio e tempo dedicado.

## Backlog iOS pos-MVP

Quando o iOS voltar ao escopo, retomar com frente propria:

- estabilizar Xcode/CoreDevice/device support antes de mexer em produto;
- validar build nativo iOS limpo;
- revisar patch experimental de merge iOS;
- criar teste especifico para pacote com mais de 3 segmentos;
- validar 36s, 60s, 1min38, 3min e 5min;
- provar ausencia de midia clara persistente;
- provar liberacao de camera/microfone;
- consolidar logs e screenshots saneados;
- so entao declarar suporte iOS homologado.
