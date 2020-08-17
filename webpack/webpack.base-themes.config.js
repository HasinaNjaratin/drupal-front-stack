const path = require('path')
const fs = require('fs')

const getWebpackBaseThemesEntries = () => {
  let webpack_entries = {}
  const path_to_theme = '../web/themes/custom/'
  // Get base custom themes name list.
  const directory_path = path.join(__dirname, path_to_theme)
  const list_directories = fs.readdirSync(directory_path, function (err) {
    if (err) {
      return console.error('Unable to scan directory: ' + err)
    }
  })
  if (list_directories) {
    list_directories.forEach(function (theme) {
      if (!theme.includes('.')) {
        webpack_entries[
          `${theme}/build/app`
        ] = `./web/themes/custom/${theme}/src/app.js`
      }
    })
  }
  return webpack_entries
}

module.exports = {
  entry: getWebpackBaseThemesEntries(),
  output: {
    path: path.resolve('./web/themes/custom/'),
    filename: '[name].js',
    publicPath: '/themes/custom/',
  },
}
