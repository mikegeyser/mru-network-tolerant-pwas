module.exports = {
  globDirectory: 'build/',
  globPatterns: ['**/*.{json,ico,jpg,png,html,js,css}'],
  swDest: 'build/sw.js',
  swSrc: 'src/sw.js',
  injectionPointRegexp: /(const precacheManifest = )\[\](;)/
};
