module.exports = {
  stories: [
    '../stories/**/*.stories.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    'storybook-design-token',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-scss'
  ],
  core: {
    builder: 'webpack5'
  }
};
