const fs = require('fs');
const sass = require('sass');
const write = require('write');
const rimraf = require('rimraf');
const postcss = require('postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

const constants = require('./constants');
const log = require('./log');

async function build() {
  log('Starting PaperCSS build...');

  rimraf.sync('dist', { disableGlob: true });

  log('Compiling SCSS to CSS, entrypoint:', constants.ENTRYPOINT_PATH);

  const compiledCSS = sass.renderSync({ file: constants.ENTRYPOINT_PATH });

  log('Processing CSS: autoprefixer...');

  const autoprefixedCSS = await postcss([autoprefixer]).process(compiledCSS.css, { from: undefined });

  log('Processing CSS: cssnano...');

  const minifiedCSS = await postcss([cssnano]).process(autoprefixedCSS.css, { from: undefined });

  log('Writing paper.css and paper.min.css files to dist/ ...');

  write(constants.PAPER_DIST_PATH, autoprefixedCSS.css);
  write(constants.PAPER_DIST_MIN_PATH, minifiedCSS.css);

  log('Build done!');
}

build();
