# CSS-Factory
A simple tool to make CSS files cleaned, linted, prefixed, prettified, RTL-ized and minified, all together, just with one command.

### Usage instrunctions:
1. Clone this repo.
2. Install packages.
3. Put your CSS files in `./work/0_input/` folder.
4. Run `build` command.
5. Get the regulated version from `./work/5_dist`.

### Commands reference:
- `npm run build`

  this command will process all CSS files in `./work/0_input/` and will create cleand, linted, prettified version in `./work/4_pretty` and minified version in `./work/5_dist`. 
  it also will create RTL-ized version separately beside them.

- `npm run quick`

  this command will process all CSS files in `./work/0_input/` and will create cleand, linted, prettified and minified version in `./work/quick`. (without RTL)

- `npm run less`

  this command will process all LESS files in `./work/less/` and will create cleand, linted, prettified and minified CSS version in `./work/quick`.

- `npm run empty`

  this command will clear all files in all sub-folders of `./work/`.

- `npm run update`

  this command will update each used package in `package.json/devDependencies/*` to the latest version, then will install, audit, rebuild them forcibly.

### Footnote
This tool regulates CSS styles to be compatible with [Bootstrap&copy; 4.x browser compatibilty level](https://getbootstrap.com/docs/4.6/getting-started/browsers-devices/#supported-browsers).
If you want the output be in different compatibility level, you should edit `gulpfile.js` (lines 32 through 42) based on [Autoprefixer](https://github.com/postcss/autoprefixer) documentations.
