# Checklist de Release Android

## Antes do build

- [ ] Confirmar `git status` limpo.
- [ ] Rodar `npm ci --ignore-scripts` com Node 22.13+.
- [ ] Rodar `npm run release:android:readiness`.
- [ ] Garantir Android SDK com `android-36`.
- [ ] Garantir Java 17.
- [ ] Garantir que keystore e senhas estejam fora do Git.
- [ ] Confirmar que `CAMERA` e `RECORD_AUDIO` nao entram no primeiro instalavel.
- [ ] Confirmar que alerta e apenas simulado e sem transmissao real.
- [ ] Confirmar revisao Myers/Schneier/Doneda/Tarcila.

## Build

- [ ] Gerar APK assinado interno.
- [ ] Renomear artefato para `sinalseguro-android.apk`.
- [ ] Calcular `shasum -a 256 sinalseguro-android.apk`.
- [ ] Preencher release notes.

## Publicacao

- [ ] Publicar no GitHub Releases do repo `sinalseguro/App`.
- [ ] Anexar APK e `checksums.txt`.
- [ ] Atualizar portal `/baixar/android` se o link definitivo mudar.
- [ ] Validar download via QR code.
- [ ] Registrar timeline e memoria Cristine.
- [ ] Registrar que o link e publico se o release estiver em repositorio publico.
