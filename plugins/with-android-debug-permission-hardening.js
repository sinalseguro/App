const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("node:fs");
const path = require("node:path");

const DEBUG_MANIFESTS = [
  "app/src/debug/AndroidManifest.xml",
  "app/src/debugOptimized/AndroidManifest.xml"
];

const FORBIDDEN_DEBUG_PERMISSIONS = [
  "android.permission.SYSTEM_ALERT_WINDOW",
  "android.permission.CAMERA",
  "android.permission.RECORD_AUDIO",
  "android.permission.READ_EXTERNAL_STORAGE",
  "android.permission.WRITE_EXTERNAL_STORAGE"
];

function removeForbiddenPermissions(contents) {
  let nextContents = contents;

  for (const permission of FORBIDDEN_DEBUG_PERMISSIONS) {
    const escapedPermission = permission.replaceAll(".", "\\.");
    const permissionPattern = new RegExp(
      `\\n\\s*<uses-permission\\s+android:name="${escapedPermission}"\\s*/>`,
      "g"
    );
    nextContents = nextContents.replace(permissionPattern, "");
  }

  return nextContents;
}

module.exports = function withAndroidDebugPermissionHardening(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      for (const manifestPath of DEBUG_MANIFESTS) {
        const absolutePath = path.join(config.modRequest.platformProjectRoot, manifestPath);

        if (!fs.existsSync(absolutePath)) {
          continue;
        }

        const currentContents = fs.readFileSync(absolutePath, "utf8");
        const nextContents = removeForbiddenPermissions(currentContents);

        if (nextContents !== currentContents) {
          fs.writeFileSync(absolutePath, nextContents);
        }
      }

      return config;
    }
  ]);
};
