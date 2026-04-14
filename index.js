const http = require('http');

const PORT = process.env.PORT || 3000;
//PORT is set by Jenkins when running in the pipeline, but defaults to 3000 for local testing

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        status: 'ok',
        message: 'Hello from my CI/CD pipeline!',
        timestamp: new Date().toISOString()
    }));
});

server.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});

module.exports = server;