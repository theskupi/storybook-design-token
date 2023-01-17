const StyleDictionary = require('style-dictionary').extend(
  __dirname + '/config.json'
);

console.log('Build started...');

const DESIGN_TOKEN_TYPES = [
  'color',
  'animation',
  'border',
  'borderRadius',
  'fontWeight',
  'fontSize',
  'fontFamily'
];

const extractTokenNameFromDictionaryName = (variable) => {
  if (variable) {
    const [, name] = variable.match(/([^-]+)/);
    return name;
  }
};

// Capitalize first letter to respect the addon parser for finding the right Presenter
const sanitizeString = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Register your own format
StyleDictionary.registerFormat({
  name: `customFormat`,
  formatter: function ({ dictionary, file }) {
    return (
      StyleDictionary.formatHelpers.fileHeader({ file }) +
      '\n' +
      DESIGN_TOKEN_TYPES.map(
        (item) =>
          `\n/**
* @tokens ${sanitizeString(item)}s
* @presenter ${sanitizeString(item)}
*/\n` +
          dictionary.allTokens
            .filter(
              (token) => item === extractTokenNameFromDictionaryName(token.name)
            )
            .map((token) => `$${token.name}: ${token.value};`)
            .join('\n')
      ).join('\n') +
      '\n'
    );
  }
});

// module.exports = {
//   source: ['tokens/**/*.json'],
//   platforms: {
//     scss: {
//       transformGroup: 'scss',
//       buildPath: 'build/',
//       files: [
//         {
//           destination: 'tokens.scss',
//           format: 'customFormat',
//           options: {
//             showFileHeader: false
//           }
//         }
//       ]
//     }
//   }
// };

StyleDictionary.buildAllPlatforms();
