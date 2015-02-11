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
  '/app'
];

var appPathPrefixes = [
  /^$/,
  /^\/app/,
  /^\/c\//,
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
      originalUrl = req.url;

    u.pathname = u.pathname.replace(/\/$/, '');

    if (_.any(appPathPrefixes, u.pathname.match.bind(u.pathname))) {
      if (_.contains(staticPathList, u.pathname)) {
        u.pathname = util.format('/dev%s/index.html', u.pathname);
      } else {
        u.pathname = '/dev/app/index.html';
      }
      req.url = url.format(u);

      fileServer.serve(req, res, function(err, result) {
        opts.log.writeln(req.connection.remoteAddress + ' ' + req.method + ' ' + originalUrl + ' → ' + u.pathname);
      });
      return;
    }

    fileServer.serve(req, res, function(err, result) {
      if (err && err.status === 404) {
        if (req.url.match(/^\/(noo|admin)/)) {
          proxy(req, res, nodeUpstreamHost, nodeUpstreamPort);
          opts.log.writeln(req.connection.remoteAddress + ' ' + req.method + ' ' + originalUrl + ' → N');
        } else {
          proxy(req, res, upstreamHost, upstreamPort);
          opts.log.writeln(req.connection.remoteAddress + ' ' + req.method + ' ' + originalUrl + ' → P');
        }

      } else {
        opts.log.writeln(req.connection.remoteAddress + ' ' + req.method + ' ' + originalUrl);
      }
    });
  }).listen(opts.port);

  opts.log.writeln(
    'listening on port ' + opts.port + ', proxying ' + upstreamHost + ':' + upstreamPort +
    ' and ' + nodeUpstreamHost + ':' + nodeUpstreamPort
  );
};