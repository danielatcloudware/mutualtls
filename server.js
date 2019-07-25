const tls = require('tls');
const fs = require('fs');
const env = require('env-var');

const options = {
    key: fs.readFileSync('server-key.pem'),
    cert: fs.readFileSync('server-crt.pem'),
    ca: fs.readFileSync('ca-crt.pem'),
    requestCert: true,
    rejectUnauthorized: true
};

const server = tls.createServer(options, (socket) => {
    console.log('server connected',
        socket.authorized ? 'authorized' : 'unauthorized');

    socket.on('error', (error) => {
        console.log(error);
    });

    socket.write('welcome!\n');
    socket.setEncoding('utf8');
    socket.pipe(process.stdout);
    socket.pipe(socket);
});

const port = env.get("SERVER_PORT", "80").asString();
server.listen(port, () => {
    console.log(`server bound on port ${port}`);
});