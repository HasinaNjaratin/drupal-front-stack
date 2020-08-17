const path = require('path')
const fs = require('fs')
const fsExtra = require('fs-extra')

const path_to_sites = './www/sites/'
const path_to_base_theme = './www/themes/custom/'

// Function to empty base themes build folder.
const emptyBaseThemeBuildFolder = () => {
  const base_theme_directory_path = path.join(__dirname, path_to_base_theme)
  const list_directories = fs.readdirSync(base_theme_directory_path, function (
    err
  ) {
    if (err) {
      return console.error('Unable to scan directory: ' + err)
    }
  })
  if (list_directories) {
    list_directories.forEach(function (dir) {
      if (!dir.includes('.')) {
        const build_output_dir = path_to_base_theme + dir + '/build'
        fsExtra.emptyDirSync(build_output_dir)
      }
    })
  }
}

// Function to empty all sites custom themes build folder.
const emptyAllSitesThemeBuildFolder = () => {
  const sites_theme_directory_path = path.join(__dirname, path_to_sites)
  const list_site_directory = fs.readdirSync(
    sites_theme_directory_path,
    function (err) {
      // Handling error.
      if (err) {
        return console.error('Unable to scan directory: ' + err)
      }
    }
  )
  if (list_site_directory) {
    // Get custom themes directories for each site.
    list_site_directory.forEach(function (site) {
      if (!site.includes('.')) {
        emptySpecificSiteThemeBuildFolder(site)
      }
    })
  }
}

// Function to empty specific site custom themes build folder.
const emptySpecificSiteThemeBuildFolder = (site) => {
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
        fsExtra.emptyDirSync(
          path_to_sites + site + '/themes/custom/' + theme + '/build'
        )
      }
    })
  }
}

module.exports = () => {
  // Clean base custom themes build output directory.
  emptyBaseThemeBuildFolder()

  // Clean sites custom themes build output directory.
  const site = process.env.SITE || ''
  if (site === '') {
    emptyAllSitesThemeBuildFolder()
  } else {
    emptySpecificSiteThemeBuildFolder(site)
  }
}
