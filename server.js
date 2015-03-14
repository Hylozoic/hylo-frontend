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

var staticPathList = [
  '',
  '/app',
  '/help',
  '/about',
  '/about/team',
  '/about/careers',
  '/about/contact',
  '/policies/terms-of-service'
];

var appPathPrefixes = [
  /^\/c\//,
  /^\/h\//,
  /^\/u\//,
  /^\/settings/,
  /^\/edit-profile/,
  /^\/create\/community/
];

module.exports = function(opts) {

  var upstream = opts.upstream.split(':'),
    upstreamHost = upstream[0],
    upstreamPort = parseInt(upstream[1] || '80'),
    nodeUpstream = opts.nodeUpstream.split(':'),
    nodeUpstreamHost = nodeUpstream[0],
    nodeUpstreamPort = parseInt(nodeUpstream[1] || '80');

  var server = http.createServer(function(req, res) {

    var u = url.parse(req.url),
      originalUrl = req.url,
      target = '';

    var log = function(target) {
      opts.log.writeln('%s %s %s %s', req.connection.remoteAddress, req.method, originalUrl, target);
    };

    u.pathname = u.pathname.replace(/\/$/, '');

    // static pages
    if (_.contains(staticPathList, u.pathname)) {
      u.pathname = util.format('/dev%s/index.html', u.pathname);
      req.url = url.format(u);
      target = '→ ' + u.pathname;
    }

    // alternate paths to Angular base page
    if (_.any(appPathPrefixes, u.pathname.match.bind(u.pathname))) {
      u.pathname = '/dev/app/index.html';
      req.url = url.format(u);
      target = '→ ' + u.pathname;
    }

    // pages and API endpoints in node app
    if (req.url.match(/^\/(noo|admin)/)) {
      proxy(req, res, nodeUpstreamHost, nodeUpstreamPort);
      log('→ Node');
      return;
    }

    fileServer.serve(req, res, function(err, result) {
      if (err && err.status === 404) {
        req.url = originalUrl;
        proxy(req, res, upstreamHost, upstreamPort);
        log('→ Play');
      } else {
        log(target);
      }
    });

  }).listen(opts.port);

  opts.log.writeln(
    'listening on port ' + opts.port + ', proxying ' + upstreamHost + ':' + upstreamPort +
    ' and ' + nodeUpstreamHost + ':' + nodeUpstreamPort
  );
};