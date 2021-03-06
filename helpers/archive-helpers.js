var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public/'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  //open archives sites.txt 
  fs.readFile(exports.paths.list, 'utf-8', function(err, content) {
    var split = content.split('\n');
    callback(split);
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(content) {
    for (var i = 0; i < content.length; i++) {
      if (url === content[i]) {
        callback(true);
        return;
      }
    }
    callback(false);
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', 'utf-8', callback);
};

exports.isUrlArchived = function(url, callback) {
  fs.access(exports.paths.archivedSites + '/' + url, function(err) {
    if (err) {
      callback(false);
    } else {
      callback(true);
    }
  });
};

exports.downloadUrls = function(urls) {
  //take array of urls we assume array only include urls that don't exist
  //iterate through array
  for (var i = 0; i < urls.length; i++) {
    //for each item call http.get 
    http.get('http://' + urls[i], function(response) {
      var data = '';
      response.on('data', function(chunk) {
        data += chunk;
      });
      response.on('end', function() {
        //store returned data in archives/sites with file name as url
        fs.writeFile(exports.paths.archivedSites + '/' + response.socket._host, data, 'utf-8', function(err) {
          if (err) {
            throw err;
          }
        });
      });
    });
  }
};
