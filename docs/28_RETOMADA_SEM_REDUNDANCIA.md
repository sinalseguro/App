# 28 - Retomada sem redundancia e passagem para proxima etapa

Data: 2026-05-05
Sessao de origem informada: `019de8eb-f592-73d1-bc40-fb1fe3dab9e5`
Coordenacao: Ze e Cristine
Especialistas ativos: Tarcila, Norman, Ada, Hedy, Margaret, Katherine, Schneier, Doneda, Myers, Kim e Knuth/ESCRIBA

## Objetivo

Evitar que novas interrupcoes reiniciem o ciclo de releitura, redundancia e validacoes repetidas antes de implementar. Esta pagina passa a ser o ponto unico de retomada operacional para fechar o ciclo atual e entrar na proxima etapa.

## Estado atual que deve ser preservado

- O repositorio ativo e `apps/mobile`.
- O branch ativo esperado e `main`.
- O remoto esperado e `origin/main` no repositorio publico `sinalseguro/App`.
- Ha trabalho local em andamento que nao deve ser descartado sem pedido explicito.
- A etapa ativa e o fechamento do ciclo privado Android com midia local, SOS, Cofre/Player, configuracoes, seguranca local e validacao em aparelho fisico.
- A documentacao principal deste ciclo esta em:
  - `docs/27_REFINO_DRAWER_COFRE_PLAYER_CONFIG.md`
  - `docs/03_TIMELINE.md`
  - `.codex/memory/CRISTINE.md`
  - `.codex/memory/TARCILA.md`
  - `.codex/memory/TECNICA_MOBILE.md`
  - `.codex/memory/SEGURANCA_QA.md`

## Regra de retomada rapida

Na proxima retomada, nao refazer pesquisa geral. Executar somente:

```bash
cd "apps/mobile"
git status --short --branch
sed -n '1,220p' docs/28_RETOMADA_SEM_REDUNDANCIA.md
```

Depois disso, seguir a fila abaixo. So abrir outros documentos se uma pendencia exigir detalhe especifico.

## Fila unica de execucao

1. Preservar todas as alteracoes locais atuais.
2. Revisar apenas os arquivos alterados em `git status --short`.
3. Fechar pendencias de UX/IX ja comentadas:
   - topo com logo/nome aprovado por Tarcila e contraste adequado;
   - clique em logo/nome deve voltar para a Home;
   - SOS ativo com bolha 3D, anel interno, uma unica camada superior em degradê, texto `ATIVO` acima das particulas e sombra verde discreta no texto;
   - Home com `Policia`, `Bombeiros` e `SAMU` ativos por padrao, sem numero no rotulo do botao `Policia`;
   - atalho de Anjo mantido desativado/preparatorio ate gestao de anjos, aceite real e auditoria futura;
   - menu com cores da identidade visual;
   - Cofre sem card tecnico redundante e com duracao/tempo de gravacao na grade;
   - `Atualizar` no Cofre deve representar verificacao de atualizacao/API, nao apenas recarregar lista local;
   - Configuracoes deve ficar em grade iconografica, com conteudos longos em modais;
   - termos de uso, privacidade, autorizacoes, login Google/iCloud e preparo de endpoints devem ficar documentados e representados na UI como etapa preparada, sem credenciais no repo.
4. Rodar gates leves:

```bash
npm run typecheck
npm run lint
npm test
npm run private:android:readiness
git diff --check
```

5. Validar no browser apenas as rotas afetadas:
   - `http://localhost:8081/`
   - `http://localhost:8081/arquivos?painel=cofre`
   - `http://localhost:8081/arquivos?painel=player`
   - `http://localhost:8081/configuracoes`
   - `http://localhost:8081/funcionamento`
6. Se os gates passarem, gerar APK privado:

```bash
npm run build:android:private
shasum -a 256 android/app/build/outputs/apk/debug/app-debug.apk
```

7. Instalar no Android somente quando `adb devices -l` listar o aparelho.
8. Antes de instalar em aparelho fisico, confirmar a acao no momento da instalacao.
9. Validar no Android:
   - abertura fria sem travamento;
   - splash nativa aprovada;
   - Home fixa;
   - SOS inicia pacote local;
   - camera/microfone apenas no build privado e com permissao explicita;
   - encerramento preserva arquivo;
   - Cofre lista pacote;
   - Player abre/reproduz quando houver midia local;
   - excluir remove localmente com confirmacao;
   - configuracoes mantem autorizacoes e termos acessiveis.
10. Atualizar memoria, timeline, documentacao e publicar Git.

## O que nao deve ser refeito

- Nao reabrir a pesquisa completa de stack mobile.
- Nao recriar plano de agentes.
- Nao redesenhar do zero a Home, Cofre, Player ou Configuracoes sem novo comentario visual do Roberto.
- Nao trocar a identidade visual aprovada por Tarcila.
- Nao mudar o escopo publico para gravacao oculta, P2P critico, streaming real ou acionamento oficial sem nova etapa juridica/seguranca.
- Nao configurar Google, iCloud ou contas logadas no navegador sem confirmacao de acao no momento exato.
- Nao instalar APK em aparelho fisico sem confirmacao de instalacao quando o dispositivo aparecer no ADB.

## Bloqueios conhecidos

- Se `adb devices -l` nao listar o Android, a instalacao fica bloqueada. A solucao e ajustar o aparelho/cabo/autorizacao RSA antes de tentar instalar.
- O build privado pode habilitar camera/microfone para homologacao; o build publico deve continuar bloqueando midia real ate RIPD/DPIA, termos, consentimento, retencao, chaves e revisao juridica.
- Login Google/iCloud deve entrar por OIDC/backend em etapa propria, sem credenciais locais e sem usar a conta logada do navegador como segredo do projeto.

## Criterio para passar para a proxima etapa

A etapa atual pode ser encerrada quando houver:

- gates leves aprovados;
- browser validado nas rotas afetadas;
- APK privado gerado;
- Android fisico instalado e validado ou bloqueio ADB documentado;
- memoria e timeline atualizadas;
- commit e push publicados.

Se o Android continuar indisponivel, registrar o bloqueio e seguir para a proxima etapa apenas como `pendente de validacao fisica`, sem declarar aprovacao final do APK.

## Fechamento executado em 2026-05-05

- Gates locais aprovados: `typecheck`, `lint`, `test`, `private:android:readiness` e `git diff --check`.
- Browser local validado em `http://localhost:8081/`, com Home exibindo `Policia`, `Bombeiros` e `SAMU`, sem `190` no rotulo de `Policia`.
- APK privado gerado: `android/app/build/outputs/apk/debug/app-debug.apk`.
- SHA-256: `daf5a22d163acc468a9470e1bd2178606f1b547c55bdf824a22eefe5d3f022d1`.
- Instalacao USB concluida no Android `23129RA5FL`: `adb install -r` retornou `Success`.
- Evidencia principal: `docs/evidencias/android/2026-05-05-apk-privado-final/home-apk-final-after-wake.png`.
- Evidencia de estado final inativo: `docs/evidencias/android/2026-05-05-apk-privado-final/estado-final-aparelho.png`.
- Proxima etapa: `API e Anjos`, detalhada em `docs/29_PROXIMA_ETAPA_API_ANJOS.md`.
