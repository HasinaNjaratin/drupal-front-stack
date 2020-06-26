module.exports = {
    ident: 'postcss',
    sourceMap: true,
    plugins: [
        require('autoprefixer'),
        require('postcss-custom-properties'),
        require('postcss-css-variables'),
        require('postcss-mixins'),
        require('postcss-nested')
    ]
}