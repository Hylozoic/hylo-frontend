var http = require('http'),
  static = require('node-static'),
  fileServer = new static.Server('./dist'),
  _ = require('lodash'),
  url = require('url'),
  util = require('util');

var proxy = function(req, res, upstream, port) {
  req.headers.host = upstream;
  var preq = http.request({
    host: upstream,
    port: port,
    path: req.url,
    headers: req.headers,
    method: req.method
  });

  preq.addListener('response', function (pres) {
    pres.addListener('data', function(chunk) {
      res.write(chunk, 'binary');
    });
    pres.addListener('end', function() {
      res.end();
    });
    res.writeHead(pres.statusCode, pres.headers);
  });

  req.addListener('data', function(chunk) {
    preq.write(chunk, 'binary');
  });

  req.addListener('end', function() {
    preq.end();
  });
};

var staticPages = [
  '',
  '/app',
  '/faq',
  '/about',
  '/about/team',
  '/about/careers',
  '/about/contact',
];

module.exports = function(opts) {

  var upstream = opts.upstream.split(':'),
    upstreamHost = upstream[0],
    upstreamPort = parseInt(upstream[1] || '80');

  var server = http.createServer(function(req, res) {

    var u = url.parse(req.url),
      originalUrl = req.url,
      changePathname = function(value) {
        u.pathname = value;
        req.url = url.format(u);
      },
      log = function(resolution) {
        opts.log.writeln('%s %s %s %s', req.connection.remoteAddress, req.method, originalUrl, resolution);
      };

    // remove leading slash
    u.pathname = u.pathname.replace(/\/$/, '');

    // Node API
    if (_.any(['/noo', '/admin'], function(p) { return _.startsWith(u.pathname, p); })) {
      proxy(req, res, upstreamHost, upstreamPort);
      log('→ Node');
      return;
    }

    // static pages
    if (_.contains(staticPages, u.pathname)) {
      changePathname(util.format('/dev%s/index.html', u.pathname));
    }

    // all local assets
    fileServer.serve(req, res, function(err, result) {
      if (err && err.status === 404) {
        // assume it's an Angular route
        changePathname('/dev/app/index.html');
        fileServer.serve(req, res);
        log('→ ' + u.pathname);
      } else {
        log('');
      }
    });

  }).listen(opts.port);

  opts.log.writeln(util.format('listening on port %s, proxying %s:%s', opts.port, upstreamHost, upstreamPort));
};