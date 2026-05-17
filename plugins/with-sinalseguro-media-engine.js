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
const androidWebRtcPackagePath = path.join(
  "app",
  "src",
  "main",
  "java",
  "com",
  "oney",
  "WebRTCModule"
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
  copyTemplate(
    path.join("android", "SinalSeguroLiveVideoRecorder.kt"),
    path.join(androidRoot, androidPackagePath, "SinalSeguroLiveVideoRecorder.kt")
  );
  copyTemplate(
    path.join("android", "SinalSeguroWebRtcAccess.kt"),
    path.join(androidRoot, androidWebRtcPackagePath, "SinalSeguroWebRtcAccess.kt")
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
    "import br.com.sinalseguro.app.media.SinalSeguroMediaEnginePackage\n",
    "import br.com.sinalseguro.app.media.SinalSeguroMediaEnginePackage\nimport br.com.sinalseguro.app.media.SinalSeguroNativeMediaResidueCleaner\n",
    "importar limpador nativo Android"
  );
  contents = replaceOnce(
    contents,
    "    super.onCreate()\n",
    "    super.onCreate()\n    SinalSeguroNativeMediaResidueCleaner.cleanup(this)\n",
    "limpar residuos nativos Android no startup"
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
  const appDelegatePath = path.join(appSourceRoot, "AppDelegate.swift");

  if (!fs.existsSync(projectPath)) return;

  copyTemplate(path.join("ios", "SinalSeguroMediaEngine.swift"), path.join(appSourceRoot, "SinalSeguroMediaEngine.swift"));
  copyTemplate(path.join("ios", "SinalSeguroMediaEngine.m"), path.join(appSourceRoot, "SinalSeguroMediaEngine.m"));
  ensureIosStartupResidueCleanup(appDelegatePath);

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

function ensureIosStartupResidueCleanup(appDelegatePath) {
  if (!fs.existsSync(appDelegatePath)) return;

  const startupCleanerSource = `private enum SinalSeguroStartupResidueCleaner {
  private static var lifecycleObserversInstalled = false

  static func installLifecycleCleanupObservers() {
    guard !lifecycleObserversInstalled else {
      return
    }

    lifecycleObserversInstalled = true
    NotificationCenter.default.addObserver(
      forName: UIApplication.didBecomeActiveNotification,
      object: nil,
      queue: .main
    ) { _ in
      cleanupStartupPlaybackResidues()
    }
    NotificationCenter.default.addObserver(
      forName: UIApplication.protectedDataDidBecomeAvailableNotification,
      object: nil,
      queue: .main
    ) { _ in
      cleanupStartupPlaybackResidues()
    }
  }

  static func cleanupStartupPlaybackResidues(fileManager: FileManager = .default) {
    var scannedCount = 0
    var candidateCount = 0
    var deletedCount = 0
    var failedCount = 0
    var skippedFreshCount = 0

    defer {
      writeSummary(
        scannedCount: scannedCount,
        candidateCount: candidateCount,
        deletedCount: deletedCount,
        failedCount: failedCount,
        skippedFreshCount: skippedFreshCount,
        fileManager: fileManager
      )
    }

    guard let cachesDirectory = fileManager.urls(for: .cachesDirectory, in: .userDomainMask).first else {
      return
    }

    let nativePlaybackSummary = cleanupNativePlaybackResidues(cachesDirectory: cachesDirectory, fileManager: fileManager)
    scannedCount += nativePlaybackSummary.scannedCount
    candidateCount += nativePlaybackSummary.candidateCount
    deletedCount += nativePlaybackSummary.deletedCount
    failedCount += nativePlaybackSummary.failedCount
  }

  private static func cleanupNativePlaybackResidues(
    cachesDirectory: URL,
    fileManager: FileManager
  ) -> (
    scannedCount: Int,
    candidateCount: Int,
    deletedCount: Int,
    failedCount: Int
  ) {
    let playbackDirectory = cachesDirectory
      .appendingPathComponent("sinalseguro-native-media", isDirectory: true)
      .appendingPathComponent("playback", isDirectory: true)
    guard
      let urls = fileManager.enumerator(
        at: playbackDirectory,
        includingPropertiesForKeys: [.isDirectoryKey, .fileSizeKey],
        options: []
      )?.allObjects as? [URL]
    else {
      return (0, 0, 0, 0)
    }

    var candidateCount = 0
    var deletedCount = 0
    var failedCount = 0

    for url in urls.reversed() {
      candidateCount += 1
      do {
        try fileManager.removeItem(at: url)
        deletedCount += 1
      } catch {
        failedCount += 1
      }
    }
    try? fileManager.removeItem(at: playbackDirectory)

    return (urls.count, candidateCount, deletedCount, failedCount)
  }

  private static func writeSummary(
    scannedCount: Int,
    candidateCount: Int,
    deletedCount: Int,
    failedCount: Int,
    skippedFreshCount: Int,
    fileManager: FileManager
  ) {
    guard let cachesDirectory = fileManager.urls(for: .cachesDirectory, in: .userDomainMask).first else {
      return
    }

    let debugDirectory = cachesDirectory.appendingPathComponent("sinalseguro-debug", isDirectory: true)
    do {
      try fileManager.createDirectory(at: debugDirectory, withIntermediateDirectories: true)
      var resourceValues = URLResourceValues()
      resourceValues.isExcludedFromBackup = true
      var mutableDebugDirectory = debugDirectory
      try? mutableDebugDirectory.setResourceValues(resourceValues)
      let logURL = debugDirectory.appendingPathComponent("startup-playback-residue-cleaner.jsonl")
      let line = "{\\"event\\":\\"ios_startup_playback_residue_cleanup\\",\\"scanned\\":\\(scannedCount),\\"candidates\\":\\(candidateCount),\\"deleted\\":\\(deletedCount),\\"failed\\":\\(failedCount),\\"skippedFresh\\":\\(skippedFreshCount),\\"createdAt\\":\\"\\(ISO8601DateFormatter().string(from: Date()))\\"}\\n"
      let data = Data(line.utf8)
      if fileManager.fileExists(atPath: logURL.path), let handle = try? FileHandle(forWritingTo: logURL) {
        try handle.seekToEnd()
        try handle.write(contentsOf: data)
        try handle.close()
      } else {
        try data.write(to: logURL, options: .atomic)
      }
    } catch {
      return
    }
  }
}

`;

  let contents = fs.readFileSync(appDelegatePath, "utf8");
  contents = replaceOnce(
    contents,
    "import Expo\n",
    "import Foundation\nimport Expo\n",
    "importar Foundation para diagnostico iOS"
  );
  contents = replaceOnce(
    contents,
    "  ) -> Bool {\n    SinalSeguroStartupResidueCleaner.cleanupStartupPlaybackResidues()\n\n    let delegate = ReactNativeDelegate()\n",
    "  ) -> Bool {\n    SinalSeguroStartupResidueCleaner.installLifecycleCleanupObservers()\n    SinalSeguroStartupResidueCleaner.cleanupStartupPlaybackResidues()\n\n    let delegate = ReactNativeDelegate()\n",
    "registrar observadores nativos de residuos iOS"
  );
  contents = replaceOnce(
    contents,
    "  ) -> Bool {\n    let delegate = ReactNativeDelegate()\n",
    "  ) -> Bool {\n    SinalSeguroStartupResidueCleaner.installLifecycleCleanupObservers()\n    SinalSeguroStartupResidueCleaner.cleanupStartupPlaybackResidues()\n\n    let delegate = ReactNativeDelegate()\n",
    "registrar limpeza nativa de residuos iOS"
  );

  if (contents.includes("private enum SinalSeguroStartupResidueCleaner")) {
    contents = contents.replace(
      /\nprivate enum SinalSeguroStartupResidueCleaner[\s\S]*?\n}\n\nclass ReactNativeDelegate: ExpoReactNativeFactoryDelegate \{\n/,
      `\n${startupCleanerSource}class ReactNativeDelegate: ExpoReactNativeFactoryDelegate {\n`
    );
  } else {
    contents = contents.replace(
      "\nclass ReactNativeDelegate: ExpoReactNativeFactoryDelegate {\n",
      `\n${startupCleanerSource}class ReactNativeDelegate: ExpoReactNativeFactoryDelegate {\n`
    );
  }

  fs.writeFileSync(appDelegatePath, contents);
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
