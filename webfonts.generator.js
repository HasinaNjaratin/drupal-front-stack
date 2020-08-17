/**
 * @file
 */

const path = require('path')
const fs = require('fs')
const fsExtra = require('fs-extra')
const webfontsGenerator = require('webfonts-generator')

const path_to_base_theme = './www/themes/custom/'
const path_to_sites = './www/sites/'
const theme_svg_font_path = '/src/fonts/svg/'

// Get base custom themes path.
const getBaseCustomThemes = () => {
  const directory_path = path.join(__dirname, path_to_base_theme)
  const list_directories = fs.readdirSync(directory_path, function (err) {
    if (err) {
      return console.error('Unable to scan directory: ' + err)
    }
  })
  let base_custom_themes = []
  if (list_directories) {
    list_directories.forEach(function (dir) {
      if (!dir.includes('.')) {
        base_custom_themes.push(path_to_base_theme + dir)
      }
    })
  }
  return base_custom_themes
}

// Function to get list of custom themes path of all site.
const getAllSitesCustomThemes = () => {
  let sites_custom_themes = []
  const directory_path = path.join(__dirname, path_to_sites)
  const list_site_directory = fs.readdirSync(directory_path, function (err) {
    // Handling error.
    if (err) {
      return console.error('Unable to scan directory: ' + err)
    }
  })
  if (list_site_directory) {
    // Get custom themes directories for each site.
    list_site_directory.forEach(function (site) {
      if (!site.includes('.')) {
        const site_custom_themes = getSpecificSiteCustomThemes(site)
        sites_custom_themes = sites_custom_themes.concat(site_custom_themes)
      }
    })
  }
  return sites_custom_themes
}

// Function to get list of custom themes path in specific site.
const getSpecificSiteCustomThemes = (site) => {
  let site_custom_themes = []
  const site_theme_directory_path = path.join(
    __dirname,
    path_to_sites + site + '/themes/custom/'
  )
  if (fs.existsSync(site_theme_directory_path)) {
    const site_theme_directories = fs.readdirSync(
      site_theme_directory_path,
      function (err) {
        // Handling error.
        if (err) {
          return console.error('Unable to scan directory: ' + err)
        }
      }
    )
    // Construct list of custom themes path for each sites.
    site_theme_directories.forEach(function (theme) {
      if (!theme.includes('.')) {
        site_custom_themes.push(
          path_to_sites + site + '/themes/custom/' + theme
        )
      }
    })
  }
  return site_custom_themes
}

// Function to get svg files path by theme name.
const getSvg = (theme) => {
  // Joining path of directory.
  const directory_path = path.join(__dirname, theme + theme_svg_font_path)
  if (!fs.existsSync(directory_path)) {
    return []
  }
  let svg_files = []
  // Read files directory.
  const files = fs.readdirSync(directory_path, function (err) {
    // Handling error.
    if (err) {
      return console.error('Unable to scan directory: ' + err)
    }
  })
  // Check svg files.
  if (files) {
    files.forEach(function (file) {
      if (file.split('?')[0].split('#')[0].split('.').pop() === 'svg') {
        svg_files.push(theme + theme_svg_font_path + file)
      }
    })
  }
  return svg_files
}

// Export Font Generator function.
module.exports = () => {
  // Get base themes path list.
  const base_custom_themes = getBaseCustomThemes()
  // Get sites themes path list.
  const site = process.env.SITE || ''
  const sites_custom_themes =
    site === '' ? getAllSitesCustomThemes() : getSpecificSiteCustomThemes(site)
  // List of custom themes path.
  const all_custom_themes = base_custom_themes.concat(sites_custom_themes)
  all_custom_themes.forEach((theme) => {
    const svg_files = getSvg(theme)
    if (svg_files.length > 0) {
      // Empty dest directory.
      const dest_path = theme + '/src/fonts/webfonts'
      fsExtra.emptyDirSync(dest_path)
      // Generate fonts.
      webfontsGenerator(
        {
          files: svg_files,
          dest: dest_path,
          fontName: 'eefont',
          templateOptions: {
            classPrefix: 'eeicon-',
            baseSelector: '.eeicon',
          },
          types: ['eot', 'woff', 'woff2', 'ttf', 'svg'],
          fileName: 'app.[fontname].[hash].[ext]',
        },
        function (error) {
          if (error) {
            console.error('Webfonts generation failed!', error)
          } else {
            console.info('Webfonts generated with success!')
          }
        }
      )
    }
  })
}
