const tsJest = require('ts-jest');

const tsJestTransformer = tsJest.default.createTransformer({
  tsconfig: {
    jsx: 'react',
  },
});

module.exports = {
  process(sourceText, sourcePath, options) {
    // Strip "use client" and "use server" directives
    const newSourceText = sourceText
      .replace(/^['"]use client['"];?\s*/gm, '')
      .replace(/^['"]use server['"];?\s*/gm, '');

    // Pass to ts-jest for actual transformation
    return tsJestTransformer.process(newSourceText, sourcePath, options);
  },
};
