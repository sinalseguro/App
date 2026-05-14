# Checkpoint - Refinamento UX Frente 1.3 Fonte Ampliada

Data: 2026-05-14
Coordenacao: Ze
Especialistas considerados: Tarcila, Lina, Eliane e Katia

## Motivo

A validacao visual anterior da Frente 1.3 em Android fisico mostrou que os fluxos continuavam acessiveis com fonte ampliada `1.3`, mas havia cortes/overflow em textos longos nas telas:

- `Perfis e papeis`;
- `Anjos de confianca`;
- `Convite recebido`.

## Ajustes aplicados

- `StatusBanner`: line-height ampliado em titulo e texto para evitar corte vertical em textos longos.
- `SafeScreen`: line-height ampliado em titulo, subtitulo e rodape das telas.
- `ResourceTile`: titulo e descricao agora podem ocupar ate duas linhas, com menor reducao automatica de fonte e altura minima maior.
- `app/perfis.tsx`: cards de perfil receberam altura minima e line-height maiores para fonte ampliada.

## Escopo preservado

- Sem alteracao de contratos de backend.
- Sem alteracao de API, perfis, convites, chaves, SOS, cofre, player, midia, localizacao, P2P ou iOS.
- Sem liberar anjos, conveniados ou integracao governamental.

## Validacoes locais

Dependencias foram restauradas com `npm ci --ignore-scripts` porque `node_modules` havia sido removido na limpeza de regeneraveis dos portais.

Gates aprovados:

- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run typecheck`;
- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run lint`;
- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run test:profiles`;
- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm test`;
- `git diff --check -- app/perfis.tsx src/components/ResourceTile.tsx src/components/SafeScreen.tsx src/components/StatusBanner.tsx`.

## Validacao fisica pendente

`adb devices -l` iniciou o daemon, mas nao listou aparelho conectado no momento desta correcao.

Antes de fechar a Frente 1.3 sem ressalvas:

- reconectar/autorizar o Android fisico;
- instalar build atualizado ou reaproveitar build se aplicavel;
- repetir capturas de `Perfis e papeis`, `Anjos de confianca` e `Convite recebido` em fonte `1.0` e `1.3`;
- confirmar ausencia de cortes/overflow e crash scan saneado.

## Estado de continuidade

A correcao de codigo esta pronta para nova validacao visual. A Frente 1.3 pode continuar, mas a aprovacao UX final ainda depende do Android fisico.

## Retomada com especialistas - build Android

Data/hora: 2026-05-14 14:36 -03

Especialistas retomados: Katia/Tereza para build Android, Tarcila/Lina/Eliane para criterios de validacao visual, Cristine/Lucena para checkpoint e saneamento.

Resultado tecnico:

- `../../scripts/higienizar-reciclaveis-android.sh --dry-run --select all` confirmou apenas reciclaveis Android.
- `../../scripts/higienizar-reciclaveis-android.sh --apply --select all` removeu `android/app/.cxx`, `android/app/build` e `android/build`; falhas: 0.
- Primeira tentativa anterior havia falhado por cache Gradle corrompido em `android/.gradle/8.14.3/fileHashes.bin`.
- Nova tentativa usou Node 22, `--max-workers=1`, sem paralelo, `arm64-v8a` e build debug bundled.
- Build aprovado: `:app:assembleDebug`, `BUILD SUCCESSFUL in 8m 49s`.
- APK gerado: `android/app/build/outputs/apk/debug/app-debug.apk`.
- Tamanho: `80610429 bytes` (`77M`).
- SHA-256: `9497463b801c1fb6dacb5ed978391b07fa473abfdb7b56e895e4b3a75ffe3146`.
- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run private:android:readiness` aprovado com `0 pendencia(s)`.

Bloqueio atual para fechamento:

- `adb devices -l` nao lista aparelho.
- `adb mdns services` nao descobriu servico `_adb-tls-connect._tcp`.
- `system_profiler SPUSBDataType` e `ioreg` nao indicaram Android/Xiaomi/ADB/MTP visivel no USB.
- O APK novo esta pronto, mas a instalacao e a validacao visual fisica nao foram executadas nesta retomada por ausencia do device ADB.

Checklist pendente quando o Android voltar a aparecer como `device`:

- instalar `android/app/build/outputs/apk/debug/app-debug.apk`;
- validar `Perfis e papeis`, `Anjos de confianca` e `Convite recebido` com fonte `1.0`;
- repetir as mesmas telas com fonte `1.3`;
- restaurar fonte `1.0`;
- capturar screenshots/UI dumps saneados e crash scan sem `FATAL EXCEPTION`, `AndroidRuntime`, `ReactNativeJS Error` ou ANR;
- registrar a aprovacao visual final antes de fechar a Frente 1.3 sem ressalvas.
