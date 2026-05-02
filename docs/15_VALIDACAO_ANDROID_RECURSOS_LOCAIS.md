# 15 - Validacao Android: Convites, Pacotes Locais e Arquivos

Data: 2026-05-02  
Supervisao: Ze  
Gerencia mobile: Cristine  
Especialistas acionados: Ada, Hedy, Margaret, Myers, Schneier, Doneda e Knuth

## Objetivo

Validar em aparelho Android fisico os recursos solicitados para a etapa atual:

- convite local por share sheet e deep link;
- botao de panico em modo teste/local;
- gravacao de pacote local de emergencia;
- georreferencia consentida;
- fallback quando a permissao de localizacao e negada;
- area de arquivos locais;
- ausencia de camera, microfone, overlay, midia real, upload real e WebRTC;
- persistencia da outbox local apos fechar e reabrir o app.

## Ambiente

- Dispositivo: `23129RA5FL`.
- Fabricante/sistema: Xiaomi HyperOS.
- Android: 15, SDK 35.
- Conexao ADB: Wi-Fi em `192.168.0.5:5555`, configurada a partir do cabo USB.
- Build validado: debug local de homologacao, nao e release publica.
- Package: `br.com.sinalseguro.app`.
- Version: `0.1.0`.
- VersionCode: `2`.
- APK validado: `android/app/build/outputs/apk/debug/app-debug.apk`.
- SHA-256 do APK debug validado: `a3b04d9e29349319ead70200c75c030d980b6b1b67feb8a5d34ec78c6b6b71b5`.

## Ajuste de seguranca antes da validacao

Durante a primeira instalacao, Myers/Schneier identificaram que o manifest debug gerado pelo Expo incluia `android.permission.SYSTEM_ALERT_WINDOW`.

Acao executada:

- a permissao foi removida dos manifests nativos gerados para o APK instalado;
- foi criado o plugin local `./plugins/with-android-debug-permission-hardening` para remover permissoes proibidas dos manifests debug quando o projeto nativo for gerado novamente;
- o APK foi reconstruido e reinstalado;
- a checagem por `aapt dump permissions` confirmou ausencia de `CAMERA`, `RECORD_AUDIO`, `SYSTEM_ALERT_WINDOW`, `READ_EXTERNAL_STORAGE` e `WRITE_EXTERNAL_STORAGE`.

## Resultado dos testes

| Cenario | Resultado | Evidencia |
|---|---|---|
| Instalacao via ADB Wi-Fi | Aprovado | APK instalado apos remover versao antiga com assinatura diferente |
| Abertura do app | Aprovado | `docs/evidencias/android/2026-05-02-recursos-locais/01-home.png` |
| Convite local | Aprovado | `02-convite-criado.png` |
| Share sheet | Aprovado com cuidado | abriu WhatsApp; evidencias brutas com contatos foram descartadas |
| Deep link `sinalseguro://convite?convite=qa123` | Aprovado | `03-deeplink-convite.png` |
| Alerta de teste com localizacao permitida | Aprovado | `04-alerta-georreferenciado.png` |
| Arquivos locais com pacote georreferenciado | Aprovado | `05-persistencia-arquivos.png` |
| Persistencia apos `force-stop` e reabertura | Aprovado | mesmo pacote e hash preservados |
| Dialogo oficial de localizacao | Aprovado | `06-dialogo-permissao-localizacao.txt` |
| Alerta de teste com localizacao negada | Aprovado | `07-alerta-localizacao-negada.png` |
| Arquivos locais com pacote sem georreferencia | Aprovado | `08-arquivos-4-pacotes.png` |
| Midia real | Aprovado | nao foram criados arquivos `.mp4`, `.m4a`, `.wav`, `.jpg`, `.png`, `.webm`, `.mov` ou `.3gp` no sandbox do app |
| Logcat | Aprovado | sem crash, coordenadas, token, payload sensivel, `/alerts`, upload, WebRTC, camera ou microfone |

## Observacoes de privacidade

- O fluxo de compartilhamento abriu o WhatsApp instalado no aparelho.
- Uma evidencia bruta inicial continha contatos/conversa do aparelho; ela foi removida imediatamente e nao foi registrada no repo.
- O relatorio preserva apenas evidencias do app SinalSeguro e texto do dialogo oficial de permissao.
- A tela `Arquivos locais` mostra horario, status, hash e plano de envio, mas nao mostra coordenadas completas.

## Permissoes confirmadas

Permissoes sensiveis ausentes no APK validado:

- `android.permission.CAMERA`;
- `android.permission.RECORD_AUDIO`;
- `android.permission.SYSTEM_ALERT_WINDOW`;
- `android.permission.READ_EXTERNAL_STORAGE`;
- `android.permission.WRITE_EXTERNAL_STORAGE`.

Permissoes de etapa atual:

- `android.permission.ACCESS_FINE_LOCATION`;
- `android.permission.ACCESS_COARSE_LOCATION`;
- `android.permission.POST_NOTIFICATIONS`;
- `android.permission.INTERNET`;
- `android.permission.VIBRATE`.

## Pacotes locais validados

Foram criados 4 pacotes locais de teste no aparelho:

- pacotes com georreferencia consentida;
- pacote com `permission_denied` quando a localizacao foi negada;
- todos com `QUEUED_FOR_DELIVERY`;
- todos com `Midia real: blocked_public_build`;
- todos com `API waiting_backend` e `P2P waiting_adapter`;
- hashes SHA-256 exibidos na tela de arquivos locais.

## Limites mantidos

- Nenhuma chamada real de emergencia foi feita.
- Nenhum envio real para API ocorreu.
- Nenhum P2P/WebRTC foi iniciado.
- Nenhuma camera, microfone ou gravacao audiovisual foi usada.
- Nenhum dado real de vitima foi usado.

## Pendencias

- Gerar novo APK assinado de homologacao com o hardening de permissoes incorporado ao fluxo versionado.
- Publicar uma nova GitHub Release interna somente apos repetir `release:android:readiness`, lint, typecheck e smoke test.
- Evoluir backend/API e adaptadores de envio antes de qualquer transmissao real.
- Revalidar negacao de localizacao em mais um aparelho Android antigo, pois HyperOS tem comportamento proprio de permissao e cache.
