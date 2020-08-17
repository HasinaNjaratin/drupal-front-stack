const path = require('path')
const fs = require('fs')

const path_to_sites = '../web/sites/'

// Function to return source entries of all sites themes.
const getWebpackAllSitesThemesEntries = () => {
  let webpack_entries = {}
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
        const webpack_site_entries = getWebpackSpecificSiteThemesEntries(site)
        webpack_entries = { ...webpack_entries, ...webpack_site_entries }
      }
    })
  }
  return webpack_entries
}

// Function to return source entries of specific site themes.
const getWebpackSpecificSiteThemesEntries = (site) => {
  let webpack_site_entries = {}
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
        webpack_site_entries[
          `${site}/themes/custom/${theme}/build/app`
        ] = `./web/sites/${site}/themes/custom/${theme}/src/app.js`
      }
    })
  }
  return webpack_site_entries
}

// Function to manage if it is about specific site or all sites.
const getWebpackSitesThemesEntries = () => {
  const site = process.env.SITE || ''
  if (site === '') {
    return getWebpackAllSitesThemesEntries()
  } else {
    return getWebpackSpecificSiteThemesEntries(site)
  }
}

module.exports = {
  entry: getWebpackSitesThemesEntries(),
  output: {
    path: path.resolve('./web/sites/'),
    filename: '[name].js',
    publicPath: '/sites/',
  },
}
