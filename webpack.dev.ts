import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import { webpackCommonConfig } from './webpack.common';
import path from 'path';

const devConfig: Configuration = merge<Configuration>(webpackCommonConfig, {
  mode: 'development',
  cache: true,
  devServer: {
    hot: true,
    open: true,
    before: (_app, server, compiler): void => {
      compiler.hooks.done.tap('done', () => {
        if (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (compiler as any).watchFileSystem.watcher.mtimes && Object.keys((compiler as any).watchFileSystem.watcher.mtimes).some(
            (name) => path.parse(name).ext === '.html'
          )
        ) {
          server.sockWrite(server.sockets, 'content-changed');
        }
      });
    },
    port: 6001
  }
});

export default devConfig;
