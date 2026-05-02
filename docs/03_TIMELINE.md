# 03 - Timeline Mobile

Responsavel: Cristine  
Supervisao: Ze

## 2026-05-02 - Checkpoint inicial

Status: publicado no GitHub; aguardando instaladores assinados.

Decisoes:

- App criado em `apps/mobile`.
- Stack React Native + Expo Dev Client/EAS.
- Android 7+ e iOS 15.1+.
- Cristine criada como gerente AI mobile.
- Documentacao, memoria e estrutura inicial versionadas.
- OpenAPI inicial copiada para `docs/api/openapi.yaml`.
- Commit local inicial criado em `main`.
- Remote configurado como `https://github.com/sinalseguro/App.git`.
- Push para o remoto resolvido com a chave SSH `id_ed25519_github_sinalseguro` e alias local `github-sinalseguro-admin`.
- Tarcila aprovou o uso operacional da logo ja aplicada nos portais para o README do app.
- QR codes Android/iOS gerados em `assets/qr/`.
- Manifesto de instaladores criado em `distribution/installers.json`.
- Documentacao de distribuicao e lifecycle adicionada.

Entregas esperadas no fechamento:

- Git inicial em `main`.
- Remote `https://github.com/sinalseguro/App.git`.
- App shell com rotas principais.
- Design tokens e componentes obrigatorios.
- Sem segredos, dados reais ou arquivos sensiveis.

Validacoes executadas:

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado com checagem local contra padroes sensiveis.
- `npm test`: aprovado com smoke test.
- `npm run assets:qr`: aprovado.
- `npm audit --omit=dev --audit-level=high`: sem vulnerabilidades altas/criticas; permanecem moderadas transitivas da cadeia Expo que exigem correcao upstream ou `--force` com quebra de SDK.

Proximo passo operacional:

- Gerar APK Android assinado e publicar em GitHub Releases quando a permissao estiver resolvida.
- Preparar TestFlight/App Store para iOS com conta Apple e documentos de privacidade.

## 2026-05-02 - Acesso GitHub resolvido

Status: concluido.

- Chave publica `SHA256:D8EsPR5ldcu1hfb5vUbJFupSLsktofuGVPdr7gXg29A` cadastrada na conta GitHub `sinalseguro` como chave de autenticacao com leitura/escrita.
- Alias local `github-sinalseguro-admin` criado em `~/.ssh/config`.
- `origin` do app atualizado para `git@github-sinalseguro-admin:sinalseguro/App.git`.
- `main` publicado em `sinalseguro/App`.
- `push --dry-run` validado para `sinalseguro/App`, `sinalseguro/portais` e `sinalseguro/empresa`.

## Modelo de registro

| Data | Evento | Responsavel | Impacto | Proximo passo |
|---|---|---|---|---|
|  |  |  |  |  |
