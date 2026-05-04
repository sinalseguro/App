# 26 - Build Privado Com Midia Local

Data: 2026-05-03  
Supervisao: Ze  
Gerencia mobile: Cristine  
Especialistas: Tarcila, Norman, Ada, Hedy, Margaret, Schneier, Doneda, Myers e Knuth

## Objetivo

Habilitar o recurso central de gravacao local no fluxo de SOS para validacao privada controlada, sem liberar transmissao publica, streaming, P2P, backend real ou compartilhamento externo.

## Escopo habilitado

- `CAMERA` e `RECORD_AUDIO` no APK privado.
- Permissao explicita do Android antes da primeira gravacao.
- Gravacao local de video/audio ao acionar o SOS.
- Configuracao local de camera frontal, traseira ou duas cameras para a proxima gravacao.
- Opcao `Duas cameras` tenta captura frontal e traseira no build privado; se Android/Expo ou o aparelho bloquear captura dupla, o app preserva a camera disponivel e registra fallback tecnico no pacote.
- Tempo de gravacao configuravel: `Ilimitado`, `1min`, `5min`, `15min`, `30min`, `60min`.
- Encerramento manual do chamado pelo SOS ativo ou Cofre.
- Preservacao do video no sandbox privado do app.
- Player local com `expo-video` dentro do Cofre.
- Hash SHA-256 do conteudo preservado em base64.

## Escopo bloqueado

- Gravacao oculta.
- Uso de acessibilidade, overlay ou botao fisico para burlar o sistema.
- `SYSTEM_ALERT_WINDOW`.
- Armazenamento externo legado.
- Backup Android de evidencias locais.
- Upload para backend.
- Streaming WebRTC/P2P.
- Compartilhamento com anjos.
- Exportacao para autoridade.
- Dados reais sem documentos juridicos e consentimento formal.

## Fluxo tecnico

1. Usuaria aciona o SOS por pressao longa.
2. O app cria pacote local `recording_local`.
3. O app solicita/reutiliza permissao de camera e microfone.
4. `EmergencyMediaRecorder` inicia `CameraView.recordAsync()`.
5. Ao encerrar manualmente, `stopRecording()` resolve a captura.
6. `preserveLocalVideoAsset()` copia o arquivo para `sinalseguro-media/`.
7. O arquivo temporario de camera e removido.
8. O pacote recebe `media.status = recorded_local`.
9. Cofre/Player abre o video local usando `expo-video`.

## Segurança e privacidade

- O Manifest nativo preparado pelo build privado define `android:allowBackup="false"`.
- O app nao grava em armazenamento externo.
- O app nao transmite arquivo, coordenada completa, token ou payload sensivel.
- O indicador `midia local` fica visivel durante a captura; o preview minimo foi ampliado para evitar fluxo de gravacao oculta.
- O Cofre bloqueia exclusao de chamado ativo no UI e no servico; se algum arquivo local nao for removido, o pacote e mantido para nova tentativa.
- O hash de video e local; prova juridica formal ainda exige backend, cadeia de custodia e auditoria.
- Chaves por envelope, RBAC, MFA, retencao e exportacao auditada ficam para etapa backend/homologacao.

## Refinos de 2026-05-03

- Tarcila ajustou o topo para usar somente o simbolo da marca como imagem; o nome `SinalSeguro` fica como texto de interface para contraste e responsividade.
- O estado ativo do SOS deixou de usar glow/halo verde. O feedback ativo agora segue a paleta magenta/rosa da identidade visual.
- O anel de progresso do SOS foi preso a uma camada SVG recortada pela propria circunferencia do botao, discreto, responsivo, horario para acionar e anti-horario para encerrar.
- `EmergencyMediaRecorder` solicita camera/microfone antes de depender de `CameraView.onCameraReady`, reduzindo risco de o primeiro SOS nao pedir permissao.
- `cameraMode` no asset preservado registra a camera efetivamente usada (`front` ou `back`) e `requestedCameraMode` preserva a preferencia original quando a usuaria escolhe `Duas cameras`.
- Quando `Duas cameras` nao fica pronta, o recorder tenta fallback frontal e depois traseiro antes de seguir apenas com metadados.
- O Player sincroniza a barra de progresso com `expo-video` quando existe arquivo local real.

## Comandos

```bash
npm run private:android:readiness
npm run build:android:private
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

## Checkpoint instalado - 2026-05-03

- Build: `npm run build:android:private`.
- Resultado: `BUILD SUCCESSFUL`.
- Artefato: `android/app/build/outputs/apk/debug/app-debug.apk`.
- Tamanho: 107 MB.
- SHA-256: `2fbef1caee679d901b1e3f6dac2cf3966aa2621d4da8ef1f24d8631b71b99d46`.
- Dispositivo: Android `23129RA5FL` via ADB Wi-Fi `192.168.0.4:5555`.
- Instalacao: `adb install -r` com resultado `Success`.
- Permissoes concedidas para homologacao: camera, microfone, localizacao fina/aproximada e notificacoes.
- Cold start revalidado apos ajuste do topo: `Status: ok`, `LaunchState: COLD`, `TotalTime: 6026`.
- Logcat filtrado: sem `FATAL`, `AndroidRuntime`, `Unable to load script`, `Failed to connect`, `setValueWithKeyAsync`, `RedBox` ou `Exception`.
- Evidencia visual: `docs/assets/mobile/2026-05-03-android-private-media-home.png`.
- Revalidacao final de abertura: `TotalTime: 5787`, log salvo em `/tmp/sinalseguro-private-media-logcat-final.txt`, sem ocorrencias fatais filtradas.
- Evidencia final: `docs/assets/mobile/2026-05-03-android-private-media-home-final.png`.
- Evidencia do topo com simbolo sem texto: `docs/assets/mobile/2026-05-03-android-topo-simbolo.png`.
- Evidencia apos anel responsivo e selecao de duas cameras: `docs/assets/mobile/2026-05-03-android-ring-camera-home.png`.

Observacao operacional: a injecao de toque por ADB nao acionou os controles nesta rodada. A validacao funcional do gesto SOS com camera, encerramento manual, preservacao do video e reproducao no Player deve ser feita manualmente por Roberto/Myers no aparelho fisico.

## Validacoes de fechamento

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado; pendencia aceita de Node local `20.16.0`.
- `npm run release:android:readiness`: bloqueado corretamente para publico por Node local e por instrumentacao privada de midia (`expo-camera`/`expo-video`).

## Validacao obrigatoria

- Abrir o app sem Metro.
- Autorizar camera e microfone pelo fluxo de Configuracoes ou no primeiro SOS.
- Acionar SOS.
- Confirmar badge discreto `midia local`.
- Encerrar SOS manualmente.
- Abrir Cofre.
- Abrir Player.
- Confirmar video local listado/reproduzivel.
- Verificar `logcat` sem `FATAL`, `AndroidRuntime`, `Unable to load script`, coordenadas completas, upload, `/alerts`, `/media` ou WebRTC.

## Criterio de aprovacao Tarcila/Norman

- Logo sempre visivel no topo.
- Home fixa com SOS central grande.
- Fundo institucional com marca e animacoes suaves.
- Modais e botoes dentro da identidade visual.
- Configuracoes compacta por icones e modais, sem lista longa.

## Criterio de aprovacao Schneier/Doneda/Myers

- Sem backup Android de midia sensivel.
- Sem armazenamento externo.
- Sem envio externo.
- Sem gravacao oculta.
- Permissoes solicitadas pelo sistema.
- Arquivo preservado no cofre apos encerramento manual.
- Delete remove pacote e arquivo local.
