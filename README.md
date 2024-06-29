# CSS-Factory
A simple tool to clean, lint, prefix, prettify, RTL-ize, and minify CSS files, all with just one command.

### Usage instrunctions:
1. Clone this repository.
2. Install the required packages.
3. Place your CSS files in the `./work/0_input/` folder.
4. Run the `build` command.
5. Retrieve the processed files from the `./work/5_dist` folder."

### Commands reference:
- `npm run build`

  This command will process all CSS files in `./work/0_input/` and create a cleaned, linted, prettified version in `./work/4_pretty` and a minified version in `./work/5_dist.`.
  It will also create an RTL-ized version separately alongside them.

- `npm run quick`

  This command will process all CSS files in `./work/0_input/` and create a cleaned, linted, prettified, and minified version in `./work/quick` (without RTL).

- `npm run less`

  This command will process all LESS files in `./work/less/` and create a cleaned, linted, prettified, and minified CSS version in `./work/quick`.

- `npm run empty`

  This command will clear all files in all subfolders of `./work/`.

- `npm run update`

  This command will update each package in `package.json/devDependencies/*` to the latest version, then install, audit, and forcibly rebuild them.

### Footnote
This tool ensures CSS styles are compatible with the [Bootstrap 5.x browser compatibility level](https://getbootstrap.com/docs/5.3/getting-started/browsers-devices/#supported-browsers).
If you want the output to be at a different compatibility level, you should edit `gulpfile.js` (lines 47 through 55) based on the [Autoprefixer](https://github.com/postcss/autoprefixer) documentation.