const webpack = require('webpack');
const { parsed: myEnv } = require('dotenv').config({
  path:'/Users/aminahjamil/Sites/aio/.env.local'
})

module.exports = {
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(myEnv));
    return config;
  },
  reactStrictMode: true,
}
