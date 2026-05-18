# Checkpoint Pre-Refatoracao - App Mobile

Data: 2026-05-17  
Coordenacao: Ze  
Status: checkpoint documental, sem alteracao de comportamento do app.

## Estado Congelado

- Android atual: `0.1.15`, `versionCode 17`.
- APK publicado pelo portal: `sinalseguro_android.apk`.
- SHA-256: `a7b90059ce2b976c9af18ca6a43754815e423a6832aa8835305a2a99b0bb6a64`.
- Fluxo validado: login, vinculo de anjo, SOS ao vivo para um anjo, transmissao ao anjo, preservacao local cifrada e encerramento.
- iOS permanece pos-MVP.

## Hotspots Da Refatoracao

- `app/index.tsx`: concentra SOS, estado visual, midia local, live call, sync e encerramento.
- `src/services/apiClient.ts`: concentra schemas, sessao, refresh e endpoints.
- `src/features/emergency/`: fronteira de midia existe, mas ainda carrega caminhos nativo, legado, cache e player.
- `src/features/live-call/`: ja separa parte do WebRTC, mas ainda precisa reduzir duplicidade de estado.

## Plano Mobile

1. Separar o API client por dominio mantendo fachada compativel.
2. Extrair controlador puro de SOS/live-call sem mudar UX.
3. Isolar adaptadores de midia nativa, legado e playback.
4. Reduzir live call em estados explicitos.
5. Acrescentar testes unitarios reais conforme os modulos forem extraidos.
6. Atualizar README do app com arquitetura, comandos, fluxos e regras de seguranca.

## Gates

- `npm run typecheck`;
- `npm run lint`;
- `npm test`;
- `npm run private:android:readiness`;
- build Android debug bundled quando a fatia tocar codigo executavel;
- validacao fisica em dois Androids para SOS/WebRTC/midia/convites.

## Limites

- nao alterar layout, textos, identidade visual ou fluxo do usuario;
- nao mudar contratos de API sem plano especifico;
- nao remover fallback legado antes de validar ativos antigos;
- nao enviar midia bruta para backend;
- nao tratar cache local ou deep link como autoridade de vinculo.
