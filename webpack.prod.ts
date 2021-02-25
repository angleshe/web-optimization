import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import { webpackCommonConfig } from './webpack.common';

const prodConfig: Configuration = merge<Configuration>(webpackCommonConfig, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(),
    // 压缩图片
    new ImageMinimizerPlugin({
      minimizerOptions: {
        plugins: [
          ['gifsicle', { interlaced: true }],

          [
            'jpegtran',
            {
              quality: 0,
              progressive: true
            }
          ],
          ['optipng', { optimizationLevel: 5 }],
          [
            'svgo',
            {
              plugins: [
                {
                  removeViewBox: false
                }
              ]
            }
          ]
        ]
      }
    }),
    // 打包gzip
    new CompressionPlugin({
      // 压缩级别
      compressionOptions: { level: 5 },
      // 压缩起始大小
      threshold: 10240,
      // 压缩文件类型
      test: /\.(js|css|jpg)$/
    })
  ],
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
      })
    ],
    // 代码分割
    splitChunks: {
      // 最小分割大小
      // 注：这里为了效果设置成0，项目中根据实际情况设置
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
  },
  // 剥离本地第三方代码包
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  }
});

export default prodConfig;
