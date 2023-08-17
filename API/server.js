const http = require('http');
const fs = require('fs');
const path = require('path');

const itemsDbPath = path.join(__dirname, "db", 'items.json');

const PORT = 2020;
const HOST_NAME = 'localhost';

function requestHandler(req,res) {
  if (req.url ==='/items' && req.method === 'POST') {
    createItem(req, res)

   } else if (req.url ==='/items' && req.method === 'GET') {
    getAllItems(req, res)

   } else if (req.url ==='/items' && req.method === 'PUT') {
    console.log("update item to item route")
   } else if (req.url ==='/items' && req.method === 'DELETE') {
    console.log("Delete item from item route")
   }
}

function createItem(req, res) {
 const body = []

 req.on("data", (chunk)=> {
  body.push(chunk)
 })

 req.on("end", ()=> {
  const parsedItem = Buffer.concat(body).toString()
  const newItem = JSON.parse(parsedItem)

  const lastItem = itemsDb[itemsDb.length - 1];
  const lastItemId = lastItem.id;
  newItem.id = lastItemId + 1;

  fs.readFile(itemsDbPath, 'utf-8', (err, data)=> {
    if (err) {
      console.log(err)
      res.writeHead(404)
      res.end('An error occured')
    }
    const oldItems = JSON.parse(data)
    const allItems = [...oldItems, newItem]
    console.log(allItems)

    fs.writeFile(itemsDbPath, JSON.stringify(allItems), (err)=> {
      if (err) {
        console.log(err)
        res.writeHead(404)
        res.end(JSON.stringify({
          message: 'Internal Server Error. Could Not Save Book To Database'
        }));
      }
      res.end(JSON.stringify(newItem));
    })
  })
 })
}

function getAllItems(req, res) {
  fs.readFile(itemsDbPath, 'utf-8', (err, data)=> {
    if (err) {
      console.log(err)
      res.writeHead(404)
      res.end('An error occured')
    }
    res.end(data)
  })
}


const server = http.createServer(requestHandler);

server.listen(PORT, HOST_NAME, () => {
  itemsDb = JSON.parse(fs.readFileSync(itemsDbPath, 'utf-8'));
  console.log(`Server is listening on ${HOST_NAME}:${PORT}`)
})