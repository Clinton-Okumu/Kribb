const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Extend the default blockList to also ignore editor temp files.
// These are created by vim swap files, conform.nvim, safe-write, etc.
// Without this, Metro caches references to deleted temp files and crashes on hot reload.
config.resolver.blockList = [
  ...config.resolver.blockList,
  // Vim swap files: .filename.swp, .filename.swo, .filename.swn, etc.
  /\..*\.sw[a-z]$/,
  // Vim backup files: filename~
  /~$/,
  // Files starting with .conform. (editor temp files like .conform.<pid>.<filename>)
  /\.conform\..+/,
  // Emacs auto-save files
  /^#.*#$/,
];

module.exports = withNativeWind(config, { input: "./src/global.css" });
