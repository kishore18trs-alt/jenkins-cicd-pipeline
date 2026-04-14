// built-in module, no extra packages need
const http = require('http'); 

// Read PORT from environment variable, default to 3000 if not set
const PORT = process.env.PORT || 3000;



// Create an HTTP server that responds with a JSON object
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        status: 'ok',
        message: 'Hello from my CI/CD pipeline!',
        timestamp: new Date().toISOString()
    }));
});

// Start the server
server.listen(PORT, '0.0.0.0', () => {
    console.log(`App running on port ${PORT}`);
});

module.exports = server;