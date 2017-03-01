var path = require('path');
var fs = require('fs');
var http = require('http');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  fs.readFile(asset, 'utf-8', function (err, html) {
    if (err) { throw err; }
    res.write(html);
    res.end();
    console.log('Sent!');
  });
};

exports.buildResponse = function(response, asset, callback, statusCode) {

  statusCode = statusCode || 200;
  response.writeHead(statusCode, exports.headers);

  if (asset) {
    exports.serveAssets(response, asset, callback);
  } else {
    response.end();
  }

};

// As you progress, keep thinking about what helper functions you can put here!
