const http = require('http');
const fs = require('fs');
const path = require('path');


const filePath = path.join(__dirname, "index.html");
console.log(filePath)

const PORT = 8000;
const HOSTNAME ='localHost';


function requestHandler(req, res) {
  if (req.url === '/index.html' && req.method === 'GET') {
    fs.readFile(filePath, 'utf-8', (err, data)=> {
      if(err) {console.log("err getting data")
      res.writeHead(404)
      res.end("error occured")
    } else {
      console.log("Read file")
      res.writeHead(200, {
        'Content-Type': 'text/html'
      })
      res.end(data)
    }
    })
  }
}

const server = http.createServer(requestHandler)
server.listen(PORT, HOSTNAME, ()=> {
console.log("Server is listening")
})