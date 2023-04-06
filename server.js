const http = require('http'),
    fs = require('fs'),
    url =require('url');

//request handler function
http.createServer((request, response) => {
    let addr = request.url,
    q = url.parse(addr, true),
    filePath='';

    fs.appendFile('log.text', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
        if (err){
            console.log('error');
        } else {
            console.log('added to log');
        }
        });

        if (q.pathname.includes('documentation')){
            filePath = (__dirname + '/documentation.html');
        } else {
                filePath = 'index.html'
            }

        fs.readFile(filePath, (err, data) => {
            if (err){
                throw err;
            }

        response.writeHead(200, {'Content-Type': 'text/html'
        });
        response.write(data);
        response.end();
        });
        
    }).listen(8080);
    console.log('test server running on port 8080');






//     response.writeHead(200, {'Content-Type': 'text/plain' //adds a header to the code along with the HTTP code 200 which means OK
//     });
//     response.end('Hello N0de!\n'); // ends response and sends little message
//     }).listen(8080); // listens for a response on port 8080; is standard port for HTTP requests

// console.log('Running on port 8080');