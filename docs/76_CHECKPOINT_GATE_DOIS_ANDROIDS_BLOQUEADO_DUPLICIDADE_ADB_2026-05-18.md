# Checkpoint Gate Dois Androids Bloqueado por Duplicidade ADB

Data: 2026-05-18
Coordenacao: Ze
Especialistas: Katia, Eliane, Cristine e Lucena
Status: gate fisico SOS/anjo nao executado; ADB confirmou apenas um Android fisico.

## Objetivo

Retomar a validacao fisica com dois Androids para testar o fluxo SOS/anjo. Roberto informou que os dois aparelhos estavam conectados.

## Diagnostico ADB

`adb devices -l` mostrou duas entradas inicialmente, mas ambas eram o mesmo aparelho exposto por dois transportes:

- uma conexao USB;
- uma conexao Wi-Fi/mDNS do mesmo Android.

Confirmacoes:

- mesmo `serialno`;
- mesmo modelo `23129RA5FL`;
- mesmo `android_id`;
- mesmo IP interno reportado pelo proprio aparelho.

O barramento USB do macOS tambem mostrou apenas um dispositivo Android/Redmi conectado. Apos reiniciar o ADB e limpar a conexao duplicada, restou apenas um Android como `device`.

## Estado do app no aparelho visivel

- Pacote: `br.com.sinalseguro.app`.
- `versionName=0.1.15`.
- `versionCode=17`.
- `lastUpdateTime=2026-05-18 07:07:46`.

## Decisao

Nao executar o teste SOS/anjo usando duas entradas que apontam para o mesmo aparelho. Isso produziria falsa evidencia e poderia mascarar o problema real de notificacao, recepcao e WebRTC entre pares.

## Proxima acao

Fazer o segundo Android aparecer em `adb devices -l` como outro `serialno`/modelo/`android_id`.

Checklist pratico no segundo Android:

- desbloquear a tela;
- ativar opcoes de desenvolvedor;
- ativar depuracao USB;
- ao conectar o cabo, aceitar a autorizacao RSA;
- se aparecer modo de conexao USB, usar transferencia de arquivos/MTP ou equivalente;
- se for por Wi-Fi, abrir pareamento/depuracao sem fio e confirmar que o mDNS anuncia outro aparelho, nao a duplicata do Redmi atual.

Quando houver dois aparelhos distintos em ADB, repetir:

- instalar o APK privado `0.1.15` no segundo aparelho se necessario;
- confirmar login/permissoes/vinculo;
- acionar SOS no solicitante;
- verificar notificacao/entrada no anjo;
- confirmar video/audio owner -> anjo;
- conferir sinais/auditoria na EC2 sem midia bruta no backend;
- registrar evidencias e so entao publicar a release validada no portal/backend.
