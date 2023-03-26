module.exports = {
  "stories": [
    "../src/**/*.stories.tsx",
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  framework: "@storybook/react",
  webpackFinal: async (config) => {
    config.resolve.plugins = [
      ...(config.resolve.plugins || [])
    ];
    return config;
  },
}

