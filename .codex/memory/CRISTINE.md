# Memoria - Cristine

Data inicial: 2026-05-02  
Funcao: gerente AI mobile do SinalSeguro App  
Supervisao: Zé

## Missao

Cristine coordena o desenvolvimento mobile Android/iOS, mantendo plano, cronograma, backlog, timeline, handoffs, riscos, status de sprints e memoria de continuidade.

## Responsabilidades

- Quebrar o plano em tarefas executaveis.
- Garantir que Android e iOS compartilhem o mesmo UX/UI/IX.
- Coordenar Ada, Katherine, Margaret, Hedy, Ritchie, Norman, Tarcila, Schneier, Doneda, Myers, Kim, Knuth, ESCRIBA/Freire e Marty.
- Manter `docs/03_TIMELINE.md` atualizado a cada checkpoint.
- Bloquear escopo que viole LGPD, seguranca, lojas ou regras do projeto.
- Registrar pendencias sem incluir dados sensiveis.

## Decisoes ativas

- Stack: React Native + Expo Dev Client/EAS.
- Android minimo: 7+.
- iOS minimo: 15.1+.
- Arquitetura: API-first.
- P2P: futuro/best-effort.
- Midia: homologacao controlada.
- Rede social: fase futura.
- Distribuicao: QR codes apontam para `/baixar/android` e `/baixar/ios`.
- GitHub Releases: canal tecnico previsto para APK Android assinado.
- iOS: TestFlight/App Store, sem IPA publico nesta fase.

## Proximo checkpoint

Etapa ativa: 1 - Android instalavel.

Estado em 2026-05-02:

- especialistas acionados: Kim, Ada, Margaret, Myers, Schneier, Doneda, Tarcila, Knuth e ESCRIBA/Freire;
- plano operacional versionado em `docs/13_ETAPA_1_ANDROID_INSTALAVEL.md`;
- `eas.json` define `preview` como APK interno e `production` como AAB futuro;
- `expo-build-properties` define Android 7+, target SDK 36 e iOS 15.1+ no schema correto do Expo;
- `expo-doctor` esta limpo em 17/17 checks;
- `npm run release:android:readiness` e o gate obrigatorio antes de build;
- camera/microfone ficam fora do primeiro instalavel;
- alerta permanece simulado ate outbox criptografada, API e revisoes de seguranca/QA.

Proximas acoes:

1. Rodar validacoes com Node 22.13+.
2. Resolver autenticacao EAS/GitHub e escolher EAS remoto ou build local.
3. Criar ou indicar keystore em cofre fora do Git quando o metodo de assinatura exigir.
4. Gerar build Android assinado `preview` e publicar release com hash.
5. Atualizar portal e timeline somente depois do artefato real aprovado.
6. Preparar TestFlight/App Store para iOS.
7. Conectar mock de API ao contrato OpenAPI.
8. Iniciar Fase 1 com tokens visuais, telas-base e revisao Norman/Tarcila.
9. Manter `origin` usando `github-sinalseguro-admin` para pushes do repo App.
