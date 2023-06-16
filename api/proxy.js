const { createProxyMiddleware , responseInterceptor} = require("http-proxy-middleware");

module.exports = (req, res) => {
  let target = "https://y1.michx.cf/";
  // 代理目标地址
  // 这里使用 backend 主要用于区分 vercel serverless 的 api 路径
  //   if (
  //     req.url.startsWith("/api") ||
  //     req.url.startsWith("/auth") ||
  //     req.url.startsWith("/banner") ||
  //     req.url.startsWith("/CollegeTask")
  //   ) {
  //     target = "http://106.15.2.32:6969";
  //   }

  // 创建代理对象并转发请求
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      // 通过路径重写，去除请求路径中的 `/backend`
      // 例如 /backend/user/login 将被转发到 http://backend-api.com/user/login
      //   "^/backend/": "/",
    },
    selfHandleResponse: true, // res.end() will be called internally by responseInterceptor()
    logger: console,
    /**
     * Intercept response and replace 'Hello' with 'Goodbye'
     **/
    on: {
      proxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
        const hostname = req.headers.host;
        const response = responseBuffer.toString('utf8'); // convert buffer to string
        let ct = proxyRes.headers['content-type'];
        //console.log(`ContentType= ${ct}`);
        // modifying html content
        if (proxyRes.headers['content-type'] && proxyRes.headers['content-type'].includes('text/html')) {
          console.log('begin replace host');  
          return response.replaceAll('search.yahoo.co.jp', hostname); // manipulate response and return the result
        }
        return response
    }),
  },
  })(req, res);
};
