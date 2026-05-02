# Distribuicao Android

Esta pasta guarda apenas documentos e modelos publicaveis. Artefatos reais de build ficam fora do Git e sao publicados em GitHub Releases quando aprovados.

## Arquivos permitidos no Git

- `release-notes-template.md`
- `runbook-checklist.md`
- checksums de artefatos ja publicados

## Arquivos proibidos no Git

- APK, AAB ou IPA reais;
- keystore, certificado, `.jks`, `.keystore`, `.p12`, `.pem`, `.key`;
- `.env` ou arquivo com senha, alias, token, chave privada ou perfil de assinatura;
- dados reais de usuarios, vitimas, anjos, alertas ou localizacao.

## Destino publico

- GitHub Releases: `https://github.com/sinalseguro/App/releases`
- Portal Android: `https://www.sinalseguro.com.br/baixar/android`

## Gate da Etapa 1

- `npm run release:android:readiness` deve passar antes do build.
- O primeiro APK e shell tecnico com alerta simulado.
- Camera, microfone, midia real e dados reais ficam bloqueados.
