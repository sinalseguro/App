# 02 - Backlog Mobile

Responsavel: Cristine  
Supervisao: Ze

## Legenda

- `MVP`: entra na primeira versao controlada.
- `Homologacao`: entra apenas em ambiente controlado.
- `Futuro`: fase posterior.
- `Juridico`: depende de Doneda/Schneier.
- `Convênio`: depende de instrumento formal.

## Epico A - Fundacao

| ID | Item | Tipo | Responsavel | Aceite |
|---|---|---|---|---|
| A01 | Criar repo publico | MVP | Cristine/Kim | Git `main` com remoto `sinalseguro/App`. |
| A02 | Criar app shell Expo | MVP | Ada | Rotas principais abrem. |
| A03 | Criar memoria Cristine | MVP | Cristine/Ze | `.codex/memory/CRISTINE.md` versionado. |
| A04 | Criar lifecycle docs | MVP | Knuth/ESCRIBA | Plano, cronograma, backlog e timeline. |

## Epico B - Design e UX

| ID | Item | Tipo | Responsavel | Aceite |
|---|---|---|---|---|
| B01 | Design tokens | MVP | Tarcila/Ada | Cores, tipografia, espacamento, raio e movimento. |
| B02 | Componentes base | MVP | Ada/Norman | Componentes obrigatorios implementados. |
| B03 | Fluxo de onboarding | MVP | Norman/Myers | Fluxo claro, acessivel e sem dado excessivo. |
| B04 | Modo discreto | MVP/Juridico | Norman/Schneier | Reduz exposicao sem enganar loja/sistema. |

## Epico C - Alertas

| ID | Item | Tipo | Responsavel | Aceite |
|---|---|---|---|---|
| C01 | PanicButton | MVP | Hedy | Pressao longa/sequencia com cancelamento. |
| C02 | Alerta teste/real | MVP | Hedy/Myers | Estados separados e rastreaveis. |
| C03 | Outbox criptografada | MVP | Hedy/Schneier | Pacote local salvo em cofre do sistema e pronto para retry. |
| C04 | Localizacao pontual | MVP/Juridico | Ada/Doneda | Permissao explicada, revogavel e registrada no pacote. |
| C05 | Pacote de emergencia | MVP/Juridico | Hedy/Ada/Schneier | Hash, localizacao, consentimento, midia bloqueada e plano API/P2P. |

## Epico D - API e anjos

| ID | Item | Tipo | Responsavel | Aceite |
|---|---|---|---|---|
| D01 | API client | MVP | Ritchie/Ada | Contrato segue `docs/api/openapi.yaml`. |
| D02 | Convite unico | MVP | Ritchie/Hedy | Codigo opaco, expiravel e uso unico. |
| D03 | Rede de anjos | MVP | Marty/Ada | Adicionar, aceitar, revogar e listar. |
| D04 | Consentimentos | MVP/Juridico | Doneda/Ada | Versao, escopo e aceite registrados. |

## Epico E - QA e release

| ID | Item | Tipo | Responsavel | Aceite |
|---|---|---|---|---|
| E01 | Matriz de testes | MVP | Myers | Android antigo/atual, iOS, offline, permissoes. |
| E02 | Threat model | MVP | Schneier | Riscos e bloqueios documentados. |
| E03 | Build interno | MVP | Kim | EAS interno sem segredos versionados. |
| E04 | Relatorio de fase | MVP | Cristine | Timeline e memoria atualizadas. |
| E05 | Distribuicao Android/iOS | MVP | Kim/Cristine | QR codes, paginas estaveis, release assinado e hashes. |
| E06 | Logo README e assets publicos | MVP | Tarcila | Logo aprovada aplicada no README e portais. |
| E07 | Etapa 1 Android instalavel | MVP | Cristine/Kim/Ada/Margaret | `docs/13_ETAPA_1_ANDROID_INSTALAVEL.md`, EAS preview APK e readiness versionados. |
| E08 | Higienizacao do primeiro APK | MVP/Juridico | Schneier/Doneda/Myers | Sem camera/microfone, sem logs de alerta, release notes de alerta simulado. |
| E09 | Publicacao do APK interno | MVP | Kim/Cristine | GitHub Release com `sinalseguro-android.apk`, `checksums.txt` e link validado no portal. |
