# 09 - Testes QA

Responsavel: Myers

## Matriz inicial

| Area | Cenarios |
|---|---|
| Onboarding | aceite, recusa, leitura, retorno |
| Login | proprio, Google, Apple, sessao expirada |
| Convite | criado, aceito, expirado, usado duas vezes |
| Anjos | listar, adicionar, revogar |
| Alerta | teste, real, cancelar, falso positivo, pacote local, hash |
| Arquivos locais | listar pacotes, atualizar, verificar hash, status de envio |
| Offline | sem rede, API fora, retry, deduplicacao |
| Localizacao | permitida, negada, revogada, indisponivel |
| Push | discreto, lock screen, deep link autenticado |
| Acessibilidade | fonte grande, leitor de tela, contraste |
| Plataforma | Android 7+, Android atual, iOS atual |

## Critérios de bloqueio

- Alerta perdido sem outbox.
- Dado sensivel em log, push ou URL.
- App promete resposta oficial.
- Fluxo de midia fora de homologacao.
- Falha de autorizacao em alerta ou anjo.

## Evidencias

- Prints saneados.
- Logs de teste sem dados sensiveis.
- Relatorio por fase.
- Lista de bugs e retestes.
- Aprovação Myers antes de release interno.

## Distribuicao

- QR Android abre `/baixar/android`.
- QR iOS abre `/baixar/ios`.
- Links de instalacao nao prometem artefato antes de assinatura.
- GitHub Release deve conter hash SHA-256.
- Portal deve informar status quando instalador ainda estiver pendente.
- Nenhum build de debug deve ser divulgado como producao.

## Etapa 1 Android instalavel

Checklist minimo de Myers:

- instalar APK em Android 7+ e Android atual;
- abrir app, onboarding, home, alerta de teste, contatos e configuracoes;
- confirmar que alerta permanece simulado e nao transmite dados;
- confirmar que camera e microfone nao sao solicitados;
- confirmar que `SYSTEM_ALERT_WINDOW` e armazenamento legado nao aparecem no APK;
- testar permissao de notificacao em Android 13+;
- revisar edge-to-edge/safe area em Android moderno com target SDK 36;
- registrar hash, dispositivo, versao e resultado sem dados pessoais.

## Convites e pacote local

Checklist minimo de Myers:

- gerar convite local e confirmar link publico com parametro `convite`;
- confirmar que deep link futuro nao autentica outra pessoa;
- compartilhar convite via share sheet sem dado sensivel adicional;
- acionar alerta de teste e confirmar pacote local em outbox;
- abrir area `Arquivos locais` e confirmar que os pacotes gravados aparecem;
- confirmar que a tela exibe horario, hash, status de georreferencia, midia bloqueada e plano API/P2P;
- confirmar que coordenadas completas nao sao exibidas sem autenticacao forte;
- validar pacote com localizacao permitida, negada e servico indisponivel;
- confirmar que API e P2P ficam como pendentes, sem transmissao real;
- confirmar que midia real permanece bloqueada e sem permissao de camera/microfone.

## Checkpoint 2026-05-03 - Home SOS fixa

Checklist executado por Myers com supervisao de Tarcila, Norman, Ada, Hedy, Schneier e Doneda:

- validar `http://localhost:8081/`, nao `/arquivos`, quando o objetivo for tela inicial;
- confirmar Home sem `SafeScreen`/`ScrollView` e sem rolagem na superficie de emergencia;
- confirmar que titulo/subtitulo duplicados foram removidos do corpo;
- confirmar SOS circular com largura responsiva de 75% e texto legivel;
- confirmar atalhos oficiais visiveis como `Policia`, `Bombeiros` e `SAMU`, com numeros preservados somente na confirmacao de chamada;
- confirmar drawer por engrenagem com modo atual, cofre/player, anjos, convites, configuracoes e atividade;
- acionar SOS por gesto longo no Android fisico e confirmar estado `ATIVO`;
- verificar `logcat` sem `FATAL`, `AndroidRuntime`, `RedBox`, `Unable to load script` ou `setValueWithKeyAsync`;
- registrar evidencias saneadas em `docs/evidencias/browser/2026-05-03-home-sos-refatorada/` e `docs/evidencias/android/2026-05-03-home-sos-refatorada/`.

## Checkpoint 2026-05-03 - Revisao especialistas

Checklist complementar de Myers:

- confirmar que `startEmergencyPackage()` nao cria dois chamados `recording_local` simultaneos;
- confirmar que `recordEmergencyPackage()` nao finaliza chamado ativo por engano;
- confirmar que excluir pacote local exige confirmacao;
- confirmar que pacote ativo nao pode ser excluido pelo cofre;
- confirmar que drawer da Home nao mostra jargao `backend/P2P`;
- confirmar que `Policia`, `Bombeiros` e `SAMU` aparecem por padrao e nao sao ocultados por preferencia local;
- confirmar que fallback web do cofre usa memoria volatil e nao `sessionStorage`;
- confirmar que a documentacao de splash corresponde ao `app.json` atual.

## Checkpoint 2026-05-06 - Midia criptografada C2

Checklist executado:

- rodar `npm run typecheck`, `npm test`, `npm run lint` e `npm run build:android:private`;
- instalar o APK privado no Android fisico conectado por ADB;
- acionar SOS por gesto longo e confirmar estado ativo sem travamento;
- encerrar SOS por gesto longo e aguardar preservacao criptografada;
- confirmar asset cifrado com `manifest.sseg`, chunks `.sseg` e `thumbnail.sseg`;
- confirmar por ADB absoluto que `cache/Camera` fica vazio apos preservacao;
- confirmar por ADB absoluto que `cache/VideoThumbnails` fica vazio apos derivacao da thumbnail;
- confirmar que nao ha `.mp4` claro nos caches nativos apos preservacao verificada;
- salvar screenshot/logcat/inventario em `docs/evidencias/android/2026-05-06-capture-cleanup-thumbnail/`.

Resultado:

- aprovado no Android fisico `192.168.0.4:5555`;
- APK SHA-256 `024150800908109199f84e1be2ef5bd9c72ae1f6986ecee0a8269f2c44ca1323`;
- asset validado `7c967904-589c-452c-85fc-8203aee83be9`, com `manifest.sseg`, 22 chunks e `thumbnail.sseg`;
- `cache/Camera` e `cache/VideoThumbnails` vazios no inventario final.
