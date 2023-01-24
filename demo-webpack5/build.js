const StyleDictionary = require('style-dictionary').extend(
  __dirname + '/config.json'
);

console.log('Build started...');

const DESIGN_TOKEN_TYPES = [
  'color',
  'fontFamilies',
  'fontSizes',
  'fontWeights',
  'lineHeights',
  'other',
  'spacing',
  'sizing',
  'boxShadow',
  'borderRadius',
  'borderWidth',
  'typography'
];

const PRESENTERS = [
  'Animation',
  'Border',
  'BorderRadius',
  'Color',
  'Easing',
  'FontFamily',
  'FontSize',
  'FontWeight',
  'LetterSpacing',
  'Lineheight',
  'Opacity',
  'Shadow',
  'Spacing'
];

const PRESENTERS_MAP = new Map([
  ...PRESENTERS.map((item) => [item, item]),
  ['Sizing', 'Spacing'],
  ['BorderWidth', 'Spacing'],
  ['BoxShadow', 'Shadow'],
  ['LineHeights', 'LineHeight'],
  ['FontFamilies', 'FontFamily'],
  ['FontWeights', 'FontWeight'],
  ['FontSizes', 'FontSize']
]);

// Get token name from dictionary
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

// Set correct presenter for unsupported token types
const setPresenter = (category) => {
  const item = sanitizeString(category);
  return PRESENTERS_MAP.get(item) || '';
};

// Formatting function if token value is object
const createSassMap = (objectValues) => {
  let properties = Object.entries(objectValues).map(([key, value]) => {
    let cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    return `  ${cssKey}: ${value},`;
  });
  return `(\n${properties.join('\n')}\n)`;
};

// Register your own format, print comment with correct presenter and token itself
StyleDictionary.registerFormat({
  name: `customFormat`,
  formatter: ({ dictionary, file }) => {
    return (
      StyleDictionary.formatHelpers.fileHeader({ file }) +
      '\n' +
      DESIGN_TOKEN_TYPES.map(
        (item) =>
          `\n/**
* @tokens ${sanitizeString(item)}
* @presenter ${setPresenter(item)}
*/\n` +
          dictionary.allTokens
            .filter(
              (token) => item === extractTokenNameFromDictionaryName(token.type)
            )
            .map(
              (token) =>
                `$${token.name}: ${
                  typeof token.value === 'object'
                    ? createSassMap(token.value)
                    : token.value
                };`
            )
            .join('\n')
      ).join('\n') +
      '\n'
    );
  }
});

// StyleDictionary.registerTransform({
//   type: 'name',
//   name: 'dotTransformer',
//   transformer: (token) => {
//     return token.path.join('.');
//   }
// });

// StyleDictionary.registerTransformGroup({
//   name: 'custom/scss',
//   transforms: ['dotTransformer']
// });

StyleDictionary.buildAllPlatforms();
