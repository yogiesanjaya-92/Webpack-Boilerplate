// We need Nodes fs module to read directory contents
const fs = require('fs')
const path = require('path');
const handlebars = require('handlebars');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// Our function that generates our html plugins
function generateHtmlPlugins(templateDir) {
    // Read files in template directory
    const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir))
    return templateFiles.filter(item => item.split('.')[2] == 'pug').map(item => {
        // Split names and extension
        const parts = item.split('.')
        const name = parts[0]
        const extension = parts[1]
        const extension2 = parts[2]
            // Create new HTMLWebpackPlugin with options
        return new HtmlWebpackPlugin({
            template: `./src/${name}.${extension}.${extension2}`,
            filename: `./${name}.${extension}`
        })
    })
}

// Call our function on our views directory.
const htmlPlugins = generateHtmlPlugins('./src')

module.exports = {
    entry: {
        main: './src/index.js',
        vendor: './src/library/library.js'
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
                test: /\.js$/,
                use: [{
                    loader: "babel-loader"
                }]
            },
            {
                test: /\.pug$/,
                use: [
                    'html-loader',
                    'pug-html-loader'
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        context: path.resolve(__dirname, './src/img'),
                        name: '[path][name].[ext]',
                        outputPath: 'img'
                    }
                }]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        context: path.resolve(__dirname, './src'),
                        name: '[path][name].[ext]'
                    }
                }]
            },
            {
                test: /\.(sc|c)ss$/,
                use: [
                    // "style-loader",
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../' // path to director where assets folder is located
                        }
                    },
                    "css-loader",
                    "sass-loader"
                ]
            }
        ]
    },
    plugins: [
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: "css/[name].css",
                chunkFilename: "css/[id].css"
            }),
            new HtmlWebpackPlugin({
                template: "./src/index.pug",
                filename: "index.html"
            })
            // new HtmlWebpackPlugin({
            //     template: "./src/home.html.ejs",
            //     filename: "./home.html"
            // })
        ]
        // We join our htmlPlugin array to the end
        // of our webpack plugins array.
        // .concat(htmlPlugins)
}