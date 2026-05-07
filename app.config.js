const baseConfig = require("./app.json");

const appleSignInEnabled = process.env.EXPO_PUBLIC_APPLE_SIGN_IN_ENABLED === "1";
const googleSignInIosUrlScheme = process.env.EXPO_PUBLIC_GOOGLE_OIDC_IOS_URL_SCHEME?.trim() ?? "";
const iosPushEnabled = process.env.EXPO_PUBLIC_IOS_PUSH_ENABLED === "1";

function normalizePluginName(plugin) {
  return Array.isArray(plugin) ? plugin[0] : plugin;
}

function withoutConditionalIosCapabilities(plugin) {
  const name = normalizePluginName(plugin);
  if (name === "expo-apple-authentication") return false;
  if (name === "expo-notifications") return false;
  return true;
}

function withGoogleSignInConfig(plugin) {
  const name = normalizePluginName(plugin);
  if (name !== "@react-native-google-signin/google-signin" || !googleSignInIosUrlScheme) {
    return plugin;
  }

  return [
    name,
    {
      ...(Array.isArray(plugin) ? plugin[1] ?? {} : {}),
      iosUrlScheme: googleSignInIosUrlScheme
    }
  ];
}

module.exports = () => {
  const expo = JSON.parse(JSON.stringify(baseConfig.expo));
  const plugins = (expo.plugins ?? []).filter(withoutConditionalIosCapabilities).map(withGoogleSignInConfig);

  if (iosPushEnabled) {
    plugins.splice(2, 0, "expo-notifications");
  }

  if (appleSignInEnabled) {
    expo.ios = {
      ...expo.ios,
      usesAppleSignIn: true
    };
    plugins.push("expo-apple-authentication");
  } else if (expo.ios) {
    delete expo.ios.usesAppleSignIn;
  }

  return {
    expo: {
      ...expo,
      plugins
    }
  };
};
