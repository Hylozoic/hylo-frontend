var http = require('http'),
  static = require('node-static'),
  fileServer = new static.Server('./dist'),
  _ = require('lodash'),
  url = require('url'),
  util = require('util');

module.exports = function(opts) {

  http.createServer(function(req, res) {

    var u = url.parse(req.url),
      originalUrl = req.url,
      changePathname = function(value) {
        u.pathname = value;
        req.url = url.format(u);
      },
      log = function(resolution) {
        opts.log.writeln('%s %s %s', req.method, originalUrl, resolution);
      };

    // remove trailing slash
    u.pathname = u.pathname.replace(/\/$/, '');

    if (_.startsWith(u.pathname, '/assets/dev/ui')) {
      // Angular templates
      changePathname(u.pathname.replace(/^\/assets\/dev\/ui/, '/ui'));

    } else if (_.startsWith(u.pathname, '/assets')) {
      // other static assets
      changePathname(u.pathname.replace(/^\/assets/, ''));
    }

    // all local assets
    fileServer.serve(req, res, function(err, result) {
      if (err && err.status === 404) {
        res.statusCode = 404;
        res.end('404 Not Found');
        log('→ Not Found');
      } else {
        log('→ OK');
      }
    });

  }).listen(opts.port);

  opts.log.writeln('listening on port ' + opts.port);
};