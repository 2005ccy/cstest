const express = require('express');
const app = express();
const path = require('path');
const proxy = require('http-proxy-middleware');
const config = require('../common/config/configServer.js')

app.use(['/api/oauth/token', '/api/user/logout'], proxy({
    target: config.sso,
    changeOrigin: true,
    protocolRewrite: config.sso.split(':')[0]
}));

app.use('/v2/**', proxy({
    target: config.step,
    changeOrigin: true,
    protocolRewrite: config.step.split(':')[0]
}));

app.use('/stepapi/v3/**', proxy({
    target: config.work,
    changeOrigin: true,
    protocolRewrite: config.work.split(':')[0]
}));

//加载静态地址
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(function(req, res) {
    console.log('use' + req.originalUrl);
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

app.listen(8080, function() {
    console.log('Server listening on http://localhost:8080, Ctrl+C to stop')
});
