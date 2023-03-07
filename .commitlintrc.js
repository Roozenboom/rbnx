module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-case': [2, 'always', ['lower-case']],
  },
  ignores: [(message) => message.toLowerCase().startsWith('wip')],
};
