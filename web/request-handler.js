var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelper = require('./http-helpers');
// require more modules/folders here!

var paths = {
  '/': archive.paths.siteAssets + '/index.html',
  '/styles.css': archive.paths.siteAssets + '/styles.css',
  '/loading.html': archive.paths.siteAssets + '/loading.html'
};

var actions = {
  'GET': function (request, response) {
    // send a response back
    if (paths[request.url]) {
      httpHelper.buildResponse(response, paths[request.url]); 
    } else {
      httpHelper.buildResponse(response, null, function() {}, 404);
    }
  },
  'POST': function(request, response) {
    // Add data to server
    httpHelper.getData(request, function(data) {
      archive.isUrlInList(data, function(isThere) {
        if (!isThere) {
          archive.addUrlToList(data);
        }
      });
    });
    // And send response back
  },
  'OPTIONS': function(request, response) {
    // sends an A-OK response back
  }
};

exports.handleRequest = function (req, res) {
  console.log('Request:', req.method, 'URL:', req.url);
  if (actions[req.method]) {
    actions[req.method](req, res);
  } else {
    // send response with 404 status
    httpHelper.buildResponse(res, null, function() {}, 404);
  }
};
