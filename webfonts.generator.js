const path = require('path')
const fs = require('fs')
const fsExtra = require('fs-extra')
const webfontsGenerator = require('webfonts-generator')

const fontName = 'mycustomtheme'
const fontIconName = 'mycustomthemeicon'
const theme_name = 'mycustomtheme'
const path_to_theme = 'www/themes/custom/'
const theme_svg_font_path = '/assets/fonts/svg/'
const custom_themes = [`${path_to_theme}${theme_name}`]

// Function to get svg files path by theme name.
const getSvg = (theme) => {
    // Joining path of directory.
    const directory_path = path.join(__dirname, './' + theme + theme_svg_font_path)
    if (!fs.existsSync(directory_path)) {
      return []
    }
    let svg_files = [];
    // Read files directory.
    const files = fs.readdirSync(directory_path, function (err) {
      // Handling error.
      if (err) {
        return console.error('Unable to scan directory: ' + err);
      }
    });
    // Check svg files.
    if (files) {
      files.forEach(function (file) {
        if (file.split("?")[0].split("#")[0].split('.').pop() === 'svg') {
          svg_files.push(theme + theme_svg_font_path + file);
        }
      });
    }
    return svg_files;
}

// Export Font Generator function.
module.exports = () => {
  custom_themes.forEach(theme => {
    const svg_files = getSvg(theme)
    if (svg_files.length > 0) {
      // Empty dest directory.
      const dest_path = theme + '/assets/fonts/webfonts'
      fsExtra.emptyDirSync(dest_path)
      // Generate fonts.
      webfontsGenerator({
        files: svg_files,
        dest: dest_path,
        fontName: fontName,
        templateOptions: {
          classPrefix: `${fontIconName}-`,
          baseSelector: `.${fontIconName}`,
        },
        types: ['eot', 'woff', 'woff2', 'ttf', 'svg'],
        fileName: 'app.[fontname].[hash].[ext]'
      }, function (error) {
        if (error) {
          console.error('Webfonts generation failed!', error);
        } else {
          console.info('Webfonts generated with success!');
        }
      })
    }
  })
}