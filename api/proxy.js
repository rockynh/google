const { createProxyMiddleware, responseInterceptor } = require("http-proxy-middleware");

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
    pathFilter: '/*'
    pathRewrite: {
      // rewrite request path `/backend`
      //  /backend/user/login => http://google.com/user/login
      //   "^/backend/": "/",
    },
  selfHandleResponse: true, // manually call res.end(); IMPORTANT: res.end() is called internally by responseInterceptor()
  on: {
    proxyRes: responseInterceptor(async (buffer, proxyRes, req, res) => {
      // log original response
      // console.log(`[DEBUG] original response:\n${buffer.toString('utf8')}`);
      const response = buffer.toString('utf8');
        // modifying html content
        if (proxyRes.headers['content-type'] && proxyRes.headers['content-type'].includes('text/html')) {
            

            // do whatever you want
            // html = response.replace('search.yahoo.co.jp', 'y1.michx.cf');
            return response.replaceAll('search.yahoo.co.jp', 'y1.michx.cf');
      
        } else {
          return response;
        }
    }),
  },

  })(req, res);
};
