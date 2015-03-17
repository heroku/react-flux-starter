# react-flux-starter

An application template for a single page webapp backed by Express that uses React with a Flux architecture with support for Actions, Stores, message dispatching, and real-time updates.

Uses Bootstrap and LESS for CSS, Browserify for Javascript bundling, ES6 syntax via Traceur, and Gulp for managing all the front-end asset build and packaging.

To use:

Clone this repository the execute the following commands:


1. `npm install`
1. `./node_modules/gulp/bin/gulp.js bootstrap`
1. `./node_modules/gulp/bin/gulp.js build`
1. `npm start`
1. Goto http://localhost:3000 in your browser

If you want to develop further and make modifications:


1. In one console window run `./node_modules/gulp/bin/gulp.js`.  This will run Gulp in "watch" mode and automatially rebuild your frontend assets on change.
1. In a second console window run `npm start`.  If you're going to modify the Express code use nodemon (`nodemon ./bin/www`) which will automatically reload Express after you make a change.

Enjoy!!
