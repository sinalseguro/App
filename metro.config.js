const { getDefaultConfig } = require('expo/metro-config');

process.env.EXPO_NO_METRO_WORKSPACE_ROOT = '1';

const config = getDefaultConfig(__dirname);

config.projectRoot = __dirname;
config.watchFolders = [__dirname];

module.exports = config;
