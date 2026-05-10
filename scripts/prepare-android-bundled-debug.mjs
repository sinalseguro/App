import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const { syncSinalSeguroMediaEngine } = require("../plugins/with-sinalseguro-media-engine");
const androidRoot = path.join(process.cwd(), "android");
const buildGradlePath = path.join(androidRoot, "app", "build.gradle");
const localPropertiesPath = path.join(androidRoot, "local.properties");
const mainApplicationPath = path.join(
  androidRoot,
  "app",
  "src",
  "main",
  "java",
  "br",
  "com",
  "sinalseguro",
  "app",
  "MainApplication.kt"
);
const androidManifestPath = path.join(androidRoot, "app", "src", "main", "AndroidManifest.xml");

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: false
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function ensureAndroidProject() {
  if (existsSync(buildGradlePath) && existsSync(mainApplicationPath)) {
    return;
  }

  console.log("Projeto Android gerado nao encontrado. Executando Expo prebuild.");
  run("npx", ["expo", "prebuild", "--platform", "android", "--no-install"]);
}

function escapeLocalPropertiesPath(value) {
  return value.replaceAll("\\", "\\\\").replaceAll(":", "\\:");
}

function ensureAndroidSdkLocation() {
  if (existsSync(localPropertiesPath)) {
    return;
  }

  const sdkDir = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
  if (!sdkDir) {
    return;
  }

  writeFileSync(localPropertiesPath, `sdk.dir=${escapeLocalPropertiesPath(sdkDir)}\n`);
}

function replaceOnce(contents, search, replacement, description) {
  if (contents.includes(replacement)) {
    return contents;
  }

  if (!contents.includes(search)) {
    throw new Error(`Nao foi possivel aplicar patch Android: ${description}`);
  }

  return contents.replace(search, replacement);
}

function patchBuildGradle() {
  let contents = readFileSync(buildGradlePath, "utf8");

  if (!contents.includes("def sinalBundleDebugJs =")) {
    const signingAnchor = 'def releaseKeyPassword = System.getenv("SINAL_APP_ANDROID_KEY_PASSWORD")\n';
    const projectRootAnchor = "def projectRoot = rootDir.getAbsoluteFile().getParentFile().getAbsolutePath()\n";
    const anchor = contents.includes(signingAnchor) ? signingAnchor : projectRootAnchor;

    contents = replaceOnce(
      contents,
      anchor,
      `${anchor}def sinalBundleDebugJs = (findProperty("sinalBundleDebugJs") ?: "false").toBoolean()\n`,
      "declarar sinalBundleDebugJs"
    );
  }

  if (!contents.includes("debuggableVariants = []")) {
    contents = replaceOnce(
      contents,
      '    bundleCommand = "export:embed"\n',
      '    bundleCommand = "export:embed"\n\n' +
        "    // Validacao fisica embute JS no APK debug e nao depende do Metro.\n" +
        "    if (sinalBundleDebugJs) {\n" +
        "        debuggableVariants = []\n" +
        "    }\n",
      "configurar debuggableVariants"
    );
  } else {
    contents = contents.replace(
      /if \(\(findProperty\("sinalBundleDebugJs"\) \?: "false"\)\.toBoolean\(\)\) \{\n\s+debuggableVariants = \[\]\n\s+\}/,
      "if (sinalBundleDebugJs) {\n        debuggableVariants = []\n    }"
    );
  }

  contents = replaceOnce(
    contents,
    '        buildConfigField "String", "REACT_NATIVE_RELEASE_LEVEL", "\\"${findProperty(\'reactNativeReleaseLevel\') ?: \'stable\'}\\""\n',
    '        buildConfigField "String", "REACT_NATIVE_RELEASE_LEVEL", "\\"${findProperty(\'reactNativeReleaseLevel\') ?: \'stable\'}\\""\n' +
      '        buildConfigField "boolean", "SINAL_BUNDLED_DEBUG", "${sinalBundleDebugJs}"\n',
    "declarar SINAL_BUNDLED_DEBUG"
  );

  writeFileSync(buildGradlePath, contents);
}

function patchMainApplication() {
  let contents = readFileSync(mainApplicationPath, "utf8");

  contents = replaceOnce(
    contents,
    "          override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG\n",
    "          override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG && !BuildConfig.SINAL_BUNDLED_DEBUG\n",
    "desativar developer support no APK bundled"
  );

  writeFileSync(mainApplicationPath, contents);
}

function ensurePermission(contents, permission) {
  if (contents.includes(`android:name="${permission}"`) && !contents.includes(`android:name="${permission}" tools:node="remove"`)) {
    return contents;
  }

  const removalPattern = new RegExp(
    `\\n\\s*<uses-permission\\s+android:name="${permission.replaceAll(".", "\\.")}"\\s+tools:node="remove"\\s*/>`,
    "g"
  );
  const withoutRemoval = contents.replace(removalPattern, "");

  if (withoutRemoval.includes(`android:name="${permission}"`)) {
    return withoutRemoval;
  }

  return withoutRemoval.replace(
    /<manifest([^>]*)>/,
    `<manifest$1>\n  <uses-permission android:name="${permission}"/>`
  );
}

function ensureMainActivitySupportsPictureInPicture(contents) {
  const mainActivityPattern = /<activity\b[^>]*android:name="\.MainActivity"[^>]*>/;
  const mainActivity = contents.match(mainActivityPattern)?.[0];

  if (!mainActivity || mainActivity.includes("android:supportsPictureInPicture=")) {
    return contents;
  }

  return contents.replace(
    mainActivity,
    mainActivity.replace(/>$/, ' android:supportsPictureInPicture="true">')
  );
}

function patchAndroidManifest() {
  if (!existsSync(androidManifestPath)) return;

  let contents = readFileSync(androidManifestPath, "utf8");
  contents = ensurePermission(contents, "android.permission.CAMERA");
  contents = ensurePermission(contents, "android.permission.RECORD_AUDIO");
  contents = ensureMainActivitySupportsPictureInPicture(contents);
  contents = contents.replace(/android:allowBackup="true"/g, 'android:allowBackup="false"');
  contents = contents.replace(/\s+android:fullBackupContent="@xml\/[^"]+"/g, "");
  contents = contents.replace(/\s+android:dataExtractionRules="@xml\/[^"]+"/g, "");
  writeFileSync(androidManifestPath, contents);
}

ensureAndroidProject();
syncSinalSeguroMediaEngine(process.cwd());
ensureAndroidSdkLocation();
patchBuildGradle();
patchMainApplication();
patchAndroidManifest();

console.log("Android preparado para build debug bundled.");
