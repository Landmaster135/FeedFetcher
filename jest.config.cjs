module.exports = {
  verbose: true,
  testMatch: [
    "**/__tests__/**/*.test.js"
  ],
  testPathIgnorePatterns: ["./node_modules/"],
  transformIgnorePatterns: [
    "node_modules"
    // "./node_modules/(?!(xxxx.*?\\.js$))"
  ],
  // transform: {
  //   // "^.+\\.(ts|tsx)$": "ts-jest",
  //   "^.+\\.(js)$": "babel-jest",
  // },
};
