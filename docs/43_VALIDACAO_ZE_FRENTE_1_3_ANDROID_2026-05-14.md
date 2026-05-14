# Validacao Ze - Frente 1.3 Android

Data: 2026-05-14
Coordenacao: Ze
Especialistas considerados: Katia, Tereza, Tarcila, Lina, Eliane, Cristine e Lucena

## Estado

Validacao tecnica de Ze aprovada para teste manual do Roberto.

A frente ainda nao deve ser declarada fechada sem o aceite manual do Roberto.

## Artefato

- APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- SHA-256: `abaf6fc9331e01b121789452dd0bce5f660ae417c85247d10acecac2ad7f41d9`
- Tamanho: `84594580 bytes`
- Device: Android fisico `23129RA5FL`, identificador ADB redigido nas evidencias
- Transporte final de instalacao: Wi-Fi ADB com `--no-streaming`

## Ajuste aplicado durante a validacao

A validacao visual detectou linguagem interna na tela `Perfis e papeis`.

Correção aplicada em `app/perfis.tsx`:

- `Limites da Frente 1.3` virou `Limites de proteção`
- texto com `P2P`, `upload` e `fora desta frente` foi substituido por linguagem publica

## Evidencias

Pasta saneada:

- `docs/evidencias/android/2026-05-14-frente-1-3-visual-final/`

Cobertura:

- `Perfis e papeis` com fonte `1.0`
- `Perfis e papeis` com fonte `1.3`
- scroll longo de `Perfis e papeis` com fonte `1.3`
- `Anjos de confianca` com fonte `1.0`
- `Anjos de confianca` com fonte `1.3`
- `Convite recebido` com fonte `1.0`
- `Convite recebido` com fonte `1.3`
- crash scan saneado
- `gfxinfo` e `meminfo` proporcionais ao fluxo

## Resultado visual

- Cards principais de perfil legiveis em fonte `1.3`.
- Tela de anjos com tiles legiveis, sem overflow aparente e status inferior visivel.
- Tela de convite com banners e botao legiveis em fonte `1.3`.
- Texto publico sem termos internos `Frente` ou `P2P` nas evidencias finais.
- Fonte do sistema restaurada para `1.0`.

## Logs e performance

- Crash scan saneado sem `FATAL EXCEPTION`, `Fatal signal`, `ReactNativeJS Error`, `ANR in br.com.sinalseguro.app` ou `Process: br.com.sinalseguro.app`.
- Cold start debug por deep link em `Anjos de confianca` com fonte `1.3`: `8.3s`.
- `gfxinfo` de build debug indicou jank alto no cold start; registrar para hardening posterior de performance/startup.

## Gates

- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run typecheck`
- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run lint`
- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run test:profiles`
- `:app:assembleDebug -PsinalBundleDebugJs=true -PreactNativeArchitectures=arm64-v8a`
- instalacao fisica Android via Wi-Fi ADB

## Proximo passo

Roberto deve executar o teste manual no Android instalado. Se aprovado, a Frente 1.3 Android pode ser fechada e a proxima frente pode iniciar a partir de anjos/convites, preservando conveniados, chamada, localizacao ao vivo e integracao governamental como escopos posteriores.

## Atualizacao posterior - gate de acesso

Roberto solicitou ajuste adicional: o app deve liberar acesso somente apos login, consentimentos e permissoes concedidas.

Esse ajuste foi implementado em `app/_layout.tsx` e `src/features/access/AccessGate.tsx`, com novo checkpoint em:

- `docs/44_CHECKPOINT_GATE_LOGIN_PERMISSOES_ANDROID_2026-05-14.md`

O novo APK foi gerado, mas ainda nao substitui a validacao acima como release fisicamente aprovado porque o Android nao ficou disponivel no ADB para instalacao/teste nesta rodada.
