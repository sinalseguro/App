const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("node:fs");
const path = require("node:path");

const BLANK_SPLASH_DRAWABLE = `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle">
  <size android:width="1dp" android:height="1dp" />
  <solid android:color="@android:color/transparent" />
</shape>
`;

function ensureBlankNativeSplash(platformProjectRoot) {
  const drawablePath = path.join(platformProjectRoot, "app/src/main/res/drawable/splashscreen_blank.xml");
  const stylesPath = path.join(platformProjectRoot, "app/src/main/res/values/styles.xml");

  fs.mkdirSync(path.dirname(drawablePath), { recursive: true });
  fs.writeFileSync(drawablePath, BLANK_SPLASH_DRAWABLE);

  if (!fs.existsSync(stylesPath)) {
    return;
  }

  const currentStyles = fs.readFileSync(stylesPath, "utf8");
  const nextStyles = currentStyles.replace(
    /<item name="windowSplashScreenAnimatedIcon">@drawable\/[^<]+<\/item>/,
    '<item name="windowSplashScreenAnimatedIcon">@drawable/splashscreen_blank</item>'
  );

  if (nextStyles !== currentStyles) {
    fs.writeFileSync(stylesPath, nextStyles);
  }
}

module.exports = function withAndroidBlankNativeSplash(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      ensureBlankNativeSplash(config.modRequest.platformProjectRoot);
      return config;
    }
  ]);
};
