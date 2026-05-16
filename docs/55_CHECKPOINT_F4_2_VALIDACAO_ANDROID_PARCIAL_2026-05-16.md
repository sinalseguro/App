# Checkpoint - F4.2 Validacao Android Parcial

Data: 2026-05-16
Coordenacao: Ze
Especialistas: Katia, Lina, Tarcila, Eliane, Fabio, Cristine e Doneda

## Objetivo

Continuar a validacao fisica da F4.2, com foco no fluxo:

1. usuario originador aciona SOS;
2. anjo aceito recebe alerta;
3. anjo entra no audio;
4. originador conecta o anjo;
5. encerramento do SOS fecha a chamada e limpa sinalizacao efemera.

## Estado validado

- APK Android atual: `versionName=0.1.8`, `versionCode=10`.
- Hash do APK de referencia: `e36a0cebfc7bd79caa49593ae391db55a971be6f2df903823871d02424bd146a`.
- Dispositivo USB `0123456789ABCDEF` instalado e atualizado com sucesso.
- Tela principal abriu sem crash visivel.
- Menu `Configuracoes > Atualizacao` mostra claramente:
  - `Instalada 0.1.8 (codigo 10)`;
  - `Seu app esta atualizado`;
  - data da ultima verificacao.
- API publica respondeu:
  - `https://api.sinalseguro.com.br/api/health`: `status=ok`;
  - `https://api.sinalseguro.com.br/api/health/ready`: `database=ok`.
- EC2 com servicos ativos:
  - `sinalseguro-api`: active;
  - `cereusia-crm`: active.
- Limpeza efemera em producao, com ambiente correto carregado:
  - `dry-run: revogaria 0 envelope(s) ao vivo e removeria 0 sinal(is) P2P`.
- Logs recentes do app no USB nao mostraram `FATAL EXCEPTION`, `AndroidRuntime` ou crash relacionado ao SinalSeguro durante a navegacao validada.
- Verificacao segura dos logs do backend contou 0 ocorrencias recentes para `encrypted_key`, `encryptedKey`, `candidate`, `sdp` e `payload`; ocorrencias de `ice` eram falso positivo por texto de servico.

## Bloqueio encontrado

O segundo Android, que estava conectado via ADB Wi-Fi, saiu da lista de dispositivos antes da validacao completa.

Evidencias:

- `adb devices -l` passou a listar somente `0123456789ABCDEF`;
- `adb mdns services` chegou a encontrar `192.168.0.5:37391`, mas `adb connect` retornou `Connection refused`;
- tentativa anterior de instalacao no Wi-Fi ficou pendurada;
- tentativa anterior de `adb push` do APK para o Wi-Fi transferiu os bytes, mas terminou com `EOF`;
- captura anterior do Wi-Fi ainda mostrava texto antigo em `Alertas recebidos`, indicando que aquela ponta nao estava confiavelmente atualizada para validar a UI de audio.

## Decisao

A validacao fisica completa de dois Androids nao deve ser considerada aprovada neste checkpoint, porque apenas uma ponta ficou comprovadamente atualizada e acessivel.

O backend e o aparelho USB estao prontos para continuar. A proxima execucao deve comecar pela reconexao estavel do segundo Android, preferencialmente via USB, antes de acionar o SOS.

## Proximo passo recomendado

1. conectar o segundo Android por USB com depuracao ativa;
2. confirmar `adb devices -l` com dois aparelhos estaveis;
3. instalar ou atualizar o APK 0.1.8 codigo 10 no segundo aparelho;
4. capturar telas antes do SOS nos dois aparelhos;
5. acionar SOS no originador;
6. validar no anjo: alerta recebido, aceite, botao `Entrar no audio`;
7. validar no originador: faixa `Audio com anjo` e acao `Conectar anjo`;
8. capturar logs e contadores do backend sem expor payloads sensiveis;
9. encerrar SOS e confirmar que a chamada e a sinalizacao efemera foram encerradas.

## Evidencias locais

Pasta:

`apps/mobile/docs/evidencias/android/2026-05-16-f4-2-audio-fisico/`

Principais arquivos:

- `screen-current-usb-awake-0123456789ABCDEF.png`
- `screen-current-usb-config-0123456789ABCDEF.png`
- `screen-current-usb-update-0123456789ABCDEF.png`
- `screen-open-adb-5686add7-zXHfmi__2_._adb-tls-connect._tcp.png`
- `adb-devices.txt`
- `device-0123456789ABCDEF.txt`
- `device-adb-5686add7-zXHfmi__2_._adb-tls-connect._tcp.txt`
