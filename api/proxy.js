const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (req, res) => {
  let target = "https://search.yahoo.co.jp/";//your website url
  //   if (
  //     req.url.startsWith("/api") ||
  //     req.url.startsWith("/auth") ||
  //     req.url.startsWith("/banner") ||
  //     req.url.startsWith("/CollegeTask")
  //   ) {
  //     target = "http://106.15.2.32:6969";
  //   }

  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      // rewrite request path `/backend`
      //  /backend/user/login => http://google.com/user/login
      //   "^/backend/": "/",
    },
        selfHandleResponse: true,
    onProxyRes (proxyRes, req, res) {
        const bodyChunks = [];
        proxyRes.on('data', (chunk) => {
            bodyChunks.push(chunk);
        });
        proxyRes.on('end', () => {
            const body = Buffer.concat(bodyChunks);

            // forwarding source status
            res.status(proxyRes.statusCode);

            // forwarding source headers
            Object.keys(proxyRes.headers).forEach((key) => {
                res.append(key, proxyRes.headers[key]);
            });

            // modifying html content
            if (proxyRes.headers['content-type'] && proxyRes.headers['content-type'].includes('text/html')) {
                let html = body.toString();

                // do whatever you want
                html = html.replace('search.yahoo.co.jp', 'y1.michx.cf');

                res.send(new Buffer.from(html));
            } else {
                res.send(body);
            }

            res.end();
        });
    },
  })(req, res);
};
