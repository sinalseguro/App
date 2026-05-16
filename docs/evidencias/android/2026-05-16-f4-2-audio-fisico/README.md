# Evidencias - F4.2 Audio Android Fisico

Data: 2026-05-16

Esta pasta registra a validacao fisica parcial da F4.2.

## Resultado

- USB `0123456789ABCDEF`: atualizado, app aberto e versao visivel no modal de atualizacao.
- Wi-Fi `adb-5686add7-zXHfmi`: instavel; nao ficou disponivel para validacao final em dois aparelhos.
- API publica e readiness responderam ok.
- Limpeza efemera em producao retornou 0 envelopes e 0 sinais P2P para remocao em dry-run.

## Leitura rapida

- `screen-current-usb-awake-0123456789ABCDEF.png`: Home/SOS no aparelho USB atualizado.
- `screen-current-usb-config-0123456789ABCDEF.png`: tela de configuracoes no USB.
- `screen-current-usb-update-0123456789ABCDEF.png`: modal mostrando `Instalada 0.1.8 (codigo 10)`.
- `screen-open-adb-5686add7-zXHfmi__2_._adb-tls-connect._tcp.png`: evidencia de que o segundo aparelho ainda estava em tela antiga antes de cair do ADB.
- `window-*.xml`: dumps de UI para auditoria.
- `device-*.txt`: metadados de dispositivo coletados pelo ADB.

## Retomada

Para fechar a validacao, reconectar dois Androids estaveis e repetir o roteiro do checkpoint:

`apps/mobile/docs/55_CHECKPOINT_F4_2_VALIDACAO_ANDROID_PARCIAL_2026-05-16.md`
