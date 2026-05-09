const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("node:fs");
const path = require("node:path");

const pluginRoot = __dirname;
const templateRoot = path.join(pluginRoot, "native-media-engine");

const androidPackagePath = path.join(
  "app",
  "src",
  "main",
  "java",
  "br",
  "com",
  "sinalseguro",
  "app",
  "media"
);

function copyTemplate(templateRelativePath, targetPath) {
  const contents = fs.readFileSync(path.join(templateRoot, templateRelativePath), "utf8");
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, contents);
}

function replaceOnce(contents, search, replacement, description) {
  if (contents.includes(replacement)) return contents;
  if (!contents.includes(search)) {
    throw new Error(`Nao foi possivel aplicar SinalSeguroMediaEngine: ${description}`);
  }
  return contents.replace(search, replacement);
}

function ensureAndroid(projectRoot) {
  const androidRoot = path.join(projectRoot, "android");
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

  if (!fs.existsSync(mainApplicationPath)) return;

  copyTemplate(
    path.join("android", "SinalSeguroMediaEngineModule.kt"),
    path.join(androidRoot, androidPackagePath, "SinalSeguroMediaEngineModule.kt")
  );
  copyTemplate(
    path.join("android", "SinalSeguroMediaEnginePackage.kt"),
    path.join(androidRoot, androidPackagePath, "SinalSeguroMediaEnginePackage.kt")
  );

  let contents = fs.readFileSync(mainApplicationPath, "utf8");
  contents = replaceOnce(
    contents,
    "import android.content.res.Configuration\n",
    "import android.content.res.Configuration\nimport br.com.sinalseguro.app.media.SinalSeguroMediaEnginePackage\n",
    "importar pacote Android"
  );
  contents = replaceOnce(
    contents,
    "              // add(MyReactNativePackage())\n",
    "              // add(MyReactNativePackage())\n              add(SinalSeguroMediaEnginePackage())\n",
    "registrar pacote Android"
  );
  fs.writeFileSync(mainApplicationPath, contents);
}

function ensureIos(projectRoot) {
  const iosRoot = path.join(projectRoot, "ios");
  const projectPath = path.join(iosRoot, "SinalSeguro.xcodeproj", "project.pbxproj");
  const appSourceRoot = path.join(iosRoot, "SinalSeguro");

  if (!fs.existsSync(projectPath)) return;

  copyTemplate(path.join("ios", "SinalSeguroMediaEngine.swift"), path.join(appSourceRoot, "SinalSeguroMediaEngine.swift"));
  copyTemplate(path.join("ios", "SinalSeguroMediaEngine.m"), path.join(appSourceRoot, "SinalSeguroMediaEngine.m"));

  let contents = fs.readFileSync(projectPath, "utf8");
  if (!contents.includes("7A12E4102EF1000100000001 /* SinalSeguroMediaEngine.swift in Sources */")) {
    contents = contents.replace(
      "\t\tF11748422D0307B40044C1D9 /* AppDelegate.swift in Sources */ = {isa = PBXBuildFile; fileRef = F11748412D0307B40044C1D9 /* AppDelegate.swift */; };\n",
      "\t\tF11748422D0307B40044C1D9 /* AppDelegate.swift in Sources */ = {isa = PBXBuildFile; fileRef = F11748412D0307B40044C1D9 /* AppDelegate.swift */; };\n" +
        "\t\t7A12E4102EF1000100000001 /* SinalSeguroMediaEngine.swift in Sources */ = {isa = PBXBuildFile; fileRef = 7A12E4102EF1000100000003 /* SinalSeguroMediaEngine.swift */; };\n" +
        "\t\t7A12E4102EF1000100000002 /* SinalSeguroMediaEngine.m in Sources */ = {isa = PBXBuildFile; fileRef = 7A12E4102EF1000100000004 /* SinalSeguroMediaEngine.m */; };\n"
    );
  }

  if (!contents.includes("7A12E4102EF1000100000003 /* SinalSeguroMediaEngine.swift */")) {
    contents = contents.replace(
      "\t\tF11748442D0722820044C1D9 /* SinalSeguro-Bridging-Header.h */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.c.h; name = \"SinalSeguro-Bridging-Header.h\"; path = \"SinalSeguro/SinalSeguro-Bridging-Header.h\"; sourceTree = \"<group>\"; };\n",
      "\t\tF11748442D0722820044C1D9 /* SinalSeguro-Bridging-Header.h */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.c.h; name = \"SinalSeguro-Bridging-Header.h\"; path = \"SinalSeguro/SinalSeguro-Bridging-Header.h\"; sourceTree = \"<group>\"; };\n" +
        "\t\t7A12E4102EF1000100000003 /* SinalSeguroMediaEngine.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; name = SinalSeguroMediaEngine.swift; path = SinalSeguro/SinalSeguroMediaEngine.swift; sourceTree = \"<group>\"; };\n" +
        "\t\t7A12E4102EF1000100000004 /* SinalSeguroMediaEngine.m */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.c.objc; name = SinalSeguroMediaEngine.m; path = SinalSeguro/SinalSeguroMediaEngine.m; sourceTree = \"<group>\"; };\n"
    );
  }

  if (!contents.includes("7A12E4102EF1000100000003 /* SinalSeguroMediaEngine.swift */,\n")) {
    contents = contents.replace(
      "\t\t\t\tF11748442D0722820044C1D9 /* SinalSeguro-Bridging-Header.h */,\n",
      "\t\t\t\tF11748442D0722820044C1D9 /* SinalSeguro-Bridging-Header.h */,\n" +
        "\t\t\t\t7A12E4102EF1000100000003 /* SinalSeguroMediaEngine.swift */,\n" +
        "\t\t\t\t7A12E4102EF1000100000004 /* SinalSeguroMediaEngine.m */,\n"
    );
  }

  if (!contents.includes("7A12E4102EF1000100000001 /* SinalSeguroMediaEngine.swift in Sources */,\n")) {
    contents = contents.replace(
      "\t\t\t\tF11748422D0307B40044C1D9 /* AppDelegate.swift in Sources */,\n",
      "\t\t\t\tF11748422D0307B40044C1D9 /* AppDelegate.swift in Sources */,\n" +
        "\t\t\t\t7A12E4102EF1000100000001 /* SinalSeguroMediaEngine.swift in Sources */,\n" +
        "\t\t\t\t7A12E4102EF1000100000002 /* SinalSeguroMediaEngine.m in Sources */,\n"
    );
  }

  fs.writeFileSync(projectPath, contents);
}

function syncSinalSeguroMediaEngine(projectRoot) {
  ensureAndroid(projectRoot);
  ensureIos(projectRoot);
}

function withSinalSeguroMediaEngine(config) {
  config = withDangerousMod(config, [
    "android",
    async (config) => {
      ensureAndroid(config.modRequest.projectRoot);
      return config;
    }
  ]);

  config = withDangerousMod(config, [
    "ios",
    async (config) => {
      ensureIos(config.modRequest.projectRoot);
      return config;
    }
  ]);

  return config;
}

module.exports = withSinalSeguroMediaEngine;
module.exports.syncSinalSeguroMediaEngine = syncSinalSeguroMediaEngine;

if (require.main === module && process.argv.includes("--apply")) {
  syncSinalSeguroMediaEngine(process.cwd());
  console.log("sinalseguro_media_engine=synced");
}
