var http       = require('http');
var static     = require('node-static');
var fileServer = new static.Server('./dist');

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

module.exports = function(port, upstream, upstreamPort) {
  var server = http.createServer(function(req, res) {
    console.log(req.connection.remoteAddress + ' ' + req.method + ' ' + req.url);

    fileServer.serve(req, res, function(err, result) {
      if (err && err.status === 404) {
        proxy(req, res, upstream, upstreamPort);
      }
    });
  }).listen(port);

  console.log('listening on port ' + port + ', proxying ' + upstream + ':' + upstreamPort);
};