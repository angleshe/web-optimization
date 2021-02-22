/// <reference path="./type.d.ts" />
import { Configuration } from 'webpack';
import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
// import CopyWebpackPlugin from 'copy-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import SpritesmithPlugin from 'webpack-spritesmith';

export default (): Configuration => {
  return {
    mode: 'development',
    // entry: path.resolve(__dirname, './index.ts'),
    entry: {
      index: path.resolve(__dirname, './index.ts'),
      childPage: path.resolve(__dirname, './child.ts')
    },
    output: {
      publicPath: '',
      path: path.resolve(__dirname, './dist'),
      // contenthash 是根据内容生成hash值，当代码内容修改时 contenthash也会随着改变
      filename: '[name].[contenthash].js'
    },
    cache: true,
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
        },
        // 处理图片资源
        // 主要依赖 url-loader和file-loader
        // url-loader: 把小于边界值的图标以base 64写进载体资源中
        // file-loader: 把大于边界值的图标复制到目标路径中
        {
          test: /\.(png|jpg|gif)$/i,
          exclude: path.resolve(__dirname, './src/images/sprite.png'),
          use: [
            {
              loader: 'url-loader',
              options: {
                // 设置边界值
                limit: 8192,
                esModule: false,
                
              },
            },
          ],
        },
        // 移动雪碧图
        // 如有用其他loader处理图片时(如url-loader)，应该把雪碧图排除
        {
          test: path.resolve(__dirname, './src/images/sprite.png'),
          use: [
            {
              loader: 'file-loader',
              options: {
                esModule: false
              },
            },
          ],
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        minify: true,
        inject: 'body',
        hash: true,
        chunks: ['common', 'index'],
        filename: 'index.html'
      }),
      new HtmlWebpackPlugin({
        template: './child.html',
        minify: true,
        inject: 'body',
        hash: true,
        chunks: ['common', 'childPage'],
        filename: 'child.html'
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css'
      }),
      new CleanWebpackPlugin(),
      // 压缩图片
      new ImageMinimizerPlugin({
        minimizerOptions: {
          plugins: [
            ['gifsicle', { interlaced: true }],

            ['jpegtran', { 
              quality: 0,
              progressive: true
            }],
            ['optipng', { optimizationLevel: 5 }],
            [
              'svgo',
              {
                plugins: [
                  {
                    removeViewBox: false,
                  },
                ],
              },
            ],
          ],
        },
      }),
      // 打包gzip
      new CompressionPlugin({
        // 压缩级别
        compressionOptions: { level: 5 },
        // 压缩起始大小
        threshold: 10240,
        // 压缩文件类型
        test: /\.(js|css|jpg)$/
      }),
      // 雪碧图生成插件
      new SpritesmithPlugin({
        // 雪碧图资源文件
        src: {
          cwd: './src/images/',
          glob: '*_sprite.png'
        },
        // 生成目标文件
        target: {
          image: './src/images/sprite.png',
          css: './src/style/mixins/_sprite.scss'
        },
        apiOptions: {
          cssImageRef: '../images/sprite.png'
        },
        spritesmithOptions: {
          algorithm: 'top-down'
        }
      })
    ],
    resolve: {
      extensions: ['.ts', '.js', '.json'],
      alias: {
        '@': path.resolve(__dirname, './src'),
        script: path.resolve(__dirname, './src/script'),
        style: path.resolve(__dirname, './src/style'),
        images: path.resolve(__dirname, './src/images')
      }
    },
    devtool: false,
    optimization: {
      // 是否启动js代码压缩
      // 默认 当mode为development 关闭压缩；当mode为production 则开启压缩
      minimize: true,
      minimizer: [
        // 压缩js插件 webpack5+ 自带
        new TerserPlugin({
          // 删除注释
          terserOptions: {
            format: {
              comments: false
            }
          },
          extractComments: false
        }),
        // 压缩css插件
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              'default',
              // 删除所有注释
              {
                discardComments: { removeAll: true }
              }
            ]
          }
        }),
      ],
      // 代码分割
      splitChunks: {
        // 最小分割大小
        minSize: 0,
        cacheGroups: {
          default: {
            // 文件名
            name: 'common',
            chunks: 'initial',
            // 引用次数
            minChunks: 2
          }
        }
      }
    }
  };
};
