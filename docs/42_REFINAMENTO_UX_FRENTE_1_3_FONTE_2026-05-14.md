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
