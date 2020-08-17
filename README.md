This project help to setup and configure best front stack for drupal using [webpack](https://webpack.js.org/). It implements use of [Sass](https://sass-lang.com/) and [PostCss](https://postcss.org/) loader to optimized structure and perfomance; also [eslint](https://eslint.org/), [stylelint](https://stylelint.io/) and [prettier](https://prettier.io/) to control code quality.

**Table of Contents**

- [Setup](#setup)
- [Webpack](#webpack)
- [Multisite](#multisite)
- [Webfonts generator](#webfonts-generator)
- [Code quality control](#code-quality-control)

# Setup

> Note: The webpack config file and package.json must be at the root of drupal composer directory ([drupal composer boilerplate](https://github.com/HasinaNjaratin/drupal8-boilerplate)). __composer.json__ and __package.json__ must be at the same dir level. 

First you need to install [nodejs](https://nodejs.org/) and [npm](https://www.npmjs.com/).

Then run

```
npm i
```

# Webpack


### Minify

Only on **production build** mode.

```
npm run build
```

### Devtool/Watch

Only on **development build** mode.

```
npm run dev
```

### Hooks

Before every build, webfonts are regenerated.


# Multisite

On all existing commands, by entering *env SITE = <site_name>* as a prefix, the operation is only carried out on the specified site theme and / or on the base theme.

Examples:

```
npm run build
```
allows you to build all the assets of the base theme and all the sites.

```
env SITE=mySiteA npm run build 
```
allows you to build the assets of the base theme and the mySiteA site.

```
env SITE=mySiteB npm run webpack-sites-build
```
allows to build only the assets of the mySiteB site.

### Other avalaible commands

```
npm run webpack-base-build
```
allows you to build only the assets of the base theme

```
npm run webpack-sites-build
```
allows to build only the assets of the sites

```
npm run webfonts
```
allows to generate fonts from svg. The svg files are placed in /src/fonts/svg/* then the fonts will be generated in /src/fonts/webfonts/*


# Webfonts generator

[Webfonts generator](https://www.npmjs.com/package/webfonts-generator) allow to create a font from svg file.

Put svg files in */assets/fonts/svg/*
Run a build or 

```
npm run webfonts
```

A css file is generated in _/assets/fonts/webfonts/_ and your custom fonts are now available.

You can customize the webfonts generator script in __webfonts.generator.js__

# Code quality control

You can run command in specific part of project by adding prefix :
- _module_ : to check _www/modules/custom/_
- _theme_ : to check _www/themes/custom/_
- _all_ : suffix to check both modules and themes

### Eslint

ESLint covers both code quality and coding style issues found in JavaScript code.

- For drupal modules custom side :

```
npm run module-eslint
```

To fix :

```
npm run module-eslint-fix
```

- For drupal themes custom side :

```
npm run theme-eslint
```

To fix :

```
npm run theme-eslint-fix
```

- For both modules and themes :

```
npm run eslint-all
```

To fix :

```
npm run eslint-all-fix
```

### Stylelint

A mighty, modern linter that helps you avoid errors and enforce conventions in your styles.


- For drupal modules custom side :

```
npm run module-stylelint
```

To fix :

```
npm run module-stylelint-fix
```

- For drupal themes custom side :

```
npm run theme-stylelint
```

To fix :

```
npm run theme-stylelint-fix
```

- For both modules and themes :

```
npm run stylelint-all
```

To fix :

```
npm run stylelint-all-fix
```

### Prettier

Prettier is an opinionated code formatter. It enforces a consistent style by parsing your code and re-printing it with its own rules that take the maximum line length into account, wrapping code when necessary.

- For drupal modules custom side :

```
npm run module-prettier
```

- For drupal themes custom side :

```
npm run theme-prettier
```

- For both modules and themes :

```
npm run prettier-all
```

### Lint all

It check eslint, stylelint and run prettier in both modules and themes folders.

To check code quality, run :

```
npm run lint-all
```

To fix :

```
npm run lint-all-fix
```
