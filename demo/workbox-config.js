module.exports = {
  globDirectory: 'build/',
  globPatterns: ['**/*.{json,ico,jpg,png,html,js,css}'],
  swSrc: 'src/sw.js',
  swDest: 'build/sw.js',
  injectionPointRegexp: /(const precacheManifest = )\[\](;)/
};
