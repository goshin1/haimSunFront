const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/sign', // '/api'로 시작하는 모든 요청을 프록시 처리
    createProxyMiddleware({
      target: 'https://heimsunback-production.up.railway.app',
      changeOrigin: true, // 백엔드 서버 도메인으로 Origin 헤더 변경
      secure: true, // HTTPS를 사용하는 경우 true
      
    })
  );

  app.use(
    '/login', // '/auth'로 시작하는 요청도 별도로 프록시 처리 가능
    createProxyMiddleware({
      target: 'https://heimsunback-production.up.railway.app',
      changeOrigin: true,
      secure: true
    })
  );

  app.use(
    '/duplicate', // '/api'로 시작하는 모든 요청을 프록시 처리
    createProxyMiddleware({
      target: 'https://heimsunback-production.up.railway.app',
      changeOrigin: true, // 백엔드 서버 도메인으로 Origin 헤더 변경
      secure: true, // HTTPS를 사용하는 경우 true
      
    })
  );

  app.use(
    '/farm', // '/api'로 시작하는 모든 요청을 프록시 처리
    createProxyMiddleware({
      target: 'https://heimsunback-production.up.railway.app',
      changeOrigin: true, // 백엔드 서버 도메인으로 Origin 헤더 변경
      secure: true, // HTTPS를 사용하는 경우 true
      
    })
  );
};
