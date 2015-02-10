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

module.exports = function(opts) {

  var upstream = opts.upstream.split(':'),
    upstreamHost = upstream[0],
    upstreamPort = parseInt(upstream[1] || '80'),
    nodeUpstream = opts.nodeUpstream.split(':'),
    nodeUpstreamHost = nodeUpstream[0],
    nodeUpstreamPort = parseInt(nodeUpstream[1] || '80');

  var server = http.createServer(function(req, res) {

    var u = url.parse(req.url);

    if (_.contains(['/', '/app'], u.pathname)) {
      u.pathname = u.pathname.replace(/\/$/, '');
      u.pathname = util.format('/dev%s/index.html', u.pathname);
      req.url = url.format(u);

      fileServer.serve(req, res, function(err, result) {
        opts.log.writeln(req.connection.remoteAddress + ' L ' + req.method + ' ' + req.url);
      });

      return;
    }

    fileServer.serve(req, res, function(err, result) {
      if (err && err.status === 404) {
        if (req.url.match(/^\/(noo|admin)/)) {
          proxy(req, res, nodeUpstreamHost, nodeUpstreamPort);
          opts.log.writeln(req.connection.remoteAddress + ' ↑n ' + req.method + ' ' + req.url);
        } else {
          proxy(req, res, upstreamHost, upstreamPort);
          opts.log.writeln(req.connection.remoteAddress + ' ↑p ' + req.method + ' ' + req.url);
        }

      } else {
        opts.log.writeln(req.connection.remoteAddress + ' ' + req.method + ' ' + req.url);
      }
    });
  }).listen(opts.port);

  opts.log.writeln(
    'listening on port ' + opts.port + ', proxying ' + upstreamHost + ':' + upstreamPort +
    ' and ' + nodeUpstreamHost + ':' + nodeUpstreamPort
  );
};