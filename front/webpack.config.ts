import * as path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import dotenv from 'dotenv';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { Configuration as WebpackConfiguration, DefinePlugin } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

dotenv.config();

const config: Configuration = {
  mode: 'development',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    hot: true,
    port: 3001,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/, // .css 확장자를 가진 모든 파일에 적용
        use: ['style-loader', 'css-loader'], // css-loader를 적용한 후 style-loader 적용
      },
      {
        test: /\.svg$/, // .svg 확장자를 가진 모든 파일에 적용
        type: 'asset/resource', // 파일을 별도의 파일로 내보내고 URL을 제공
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'), // '@/': './src/' 경로에 대한 별칭 설정
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new DefinePlugin({
      'process.env.MAP_API_KEY': JSON.stringify(process.env.MAP_API_KEY),
      'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(
        process.env.NEXT_PUBLIC_API_URL,
      ),
      'process.env.WEATHER_API': JSON.stringify(process.env.WEATHER_API),
    }),
  ],
};

export default config;
