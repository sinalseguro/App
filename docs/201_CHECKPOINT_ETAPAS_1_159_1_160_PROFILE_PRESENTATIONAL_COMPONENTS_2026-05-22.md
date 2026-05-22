# Checkpoint - Etapas 1.159 e 1.160 - Componentes Visuais de Perfis

Data: 2026-05-22

## Escopo

Rodada SS de refatoracao presentational em `app/perfis.tsx`, mantendo duas fatias pequenas por vez apos a recomendacao de parar `app/contatos.tsx`.

- Etapa 1.159: extrair o card de opcao de perfil para `ProfileOptionCard`.
- Etapa 1.160: extrair o botao de retorno para anjos para `ProfilesContinueButton`.

## Alteracoes

- `app/perfis.tsx`
  - adiciona `ProfileOptionCard` para renderizar uma opcao de perfil/papel;
  - adiciona `ProfilesContinueButton` para renderizar o CTA `Voltar para anjos`;
  - mantem carregamento de perfil, persistencia local, status, `router.push("/contatos")`, `setProfile()` e `setStatus()` no `ProfilesScreen`.
- `scripts/smoke-test.mjs`
  - passa a exigir `ProfileOptionCard` e `ProfilesContinueButton`;
  - passa a falhar se os componentes visuais de perfis assumirem storage real, navegacao real, API, Share, `useEffect`, `setProfile()` ou `setStatus()`.

## Limites preservados

`ProfilesScreen` continua responsavel por:

- carregar o perfil local com `getActiveProtectionProfile()`;
- salvar o perfil local com `saveActiveProtectionProfile()`;
- atualizar estado React e mensagem de status;
- executar navegacao real para `/contatos`.

Os novos componentes recebem dados e callbacks injetados. Eles nao executam storage, API, Share, navegacao real, efeitos de ciclo de vida nem setters reais de estado.

## QA e seguranca

- Mudanca restrita a apresentacao local da tela `Perfis e papeis`.
- Sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- Contratos preservados: menor continua bloqueado como anjo/convite pela policy existente; a tela continua sem coletar documento, data de nascimento completa, endereco, agenda ou relato sensivel.
- Nao introduz log novo, chave, token, hash, codigo, identity token, SDP, ICE, payload P2P, URI local, path de arquivo, coordenada, telefone, nome real novo ou conteudo de midia.

## Validacoes

Aprovadas:

- `npm run test:profiles`
- `node scripts/smoke-test.mjs`
- `npm run typecheck`
- `npm run lint`
- `npm run private:android:readiness`
- `npm test`
- `git diff --check`

Observacoes:

- `npm run private:android:readiness` manteve a pendencia local ja conhecida: Node 20.16.0 abaixo do requisito de release publica, aceitavel para build privado debug.
- Sem build/instalacao Android porque a fatia e presentational e nao altera runtime fisico, UX nativa, camera, microfone, gravacao, WebRTC real, storage de midia, cofre, player ou portal.

## Proxima recomendacao

Manter `app/perfis.tsx` como tela pequena e nao continuar extraindo por estetica. A revisao Cristine/Eliane recomenda que a proxima rodada SS avalie primeiro `app/funcionamento.tsx`, por ser a area de menor risco sem hook, API, storage, router ou token. Depois, avaliar `app/convite.tsx` para policy apresentacional do aceite, mantendo token, validacao, cache, aceite real e navegacao na tela.
