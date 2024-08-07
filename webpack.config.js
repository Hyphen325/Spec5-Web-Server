const path = require('path');

module.exports = {
  entry: './app.js', // Your main JavaScript file
  output: {
    filename: 'bundle.js', // The name of the output bundle
    path: path.resolve(__dirname, 'dist'), // The output directory
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Apply this rule to all JavaScript files
        exclude: /node_modules/, // Exclude the node_modules directory
        use: {
          loader: 'babel-loader', // Use babel-loader for transpiling
          options: {
            presets: ['@babel/preset-env'], // Use the preset-env to determine the necessary polyfills
          },
        },
      },
    ],
  },
};
