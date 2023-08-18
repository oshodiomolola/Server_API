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

   } else if (req.url.startsWith('/items/') && req.method === 'GET') {
getOneItem(req, res)

   } else if (req.url ==='/items' && req.method === 'PUT') {
   updateItems(req, res)

   } else if (req.url ==='/items' && req.method === 'DELETE') {
    deleteItem(req, res)
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

function getOneItem(req, res) {
  const id = req.url.split('/')[2]
  fs.readFile(itemsDbPath, 'utf-8', (err, data)=> {
    if (err) {
      console.log(err)
      res.writeHead(404)
      res.end('An error occured')
    }
   const jsonObject = JSON.parse(data)
   const jsonIndex = jsonObject.findIndex(el => el.id === id * 1)
   console.log(jsonIndex)

   const obj = jsonObject[jsonIndex]
   console.log(obj)

   res.writeHead(200)
   res.end(JSON.stringify(obj))
  })
}

function updateItems(req, res) {
  const body = []

 req.on("data", (chunk)=> {
  body.push(chunk)
 })

 req.on("end", ()=> {
  const parsedItem = Buffer.concat(body).toString()
  const updateDetials = JSON.parse(parsedItem)
const itemId = updateDetials.id

  fs.readFile(itemsDbPath, 'utf-8', (err, items)=> {
    if (err) {
      console.log(err)
      res.writeHead(404)
      res.end('An error occured')
    }
    res.writeHead(200)

   const jsonObject = JSON.parse(items)
   const jsonIndex = jsonObject.findIndex(item => item.id === itemId)
   console.log(jsonIndex)

   const obj = jsonObject[jsonIndex]
  

  if (jsonIndex === -1) {
    res.writeHead(404)
    res.end("Item with specified id not found")
    return
  }
const updatedItems = {...jsonObject[jsonIndex], ...updateDetials}

jsonObject[jsonIndex] = updatedItems

fs.writeFile(itemsDbPath, JSON.stringify(jsonObject), (err)=> {
  if (err) {
    console.log(err)
    res.writeHead(500)
    res.end(JSON.stringify({
      message: 'Internal Server Error. Could Not Save Book To Database'
    }));
  }
  res.writeHead(200)
  res.end("Update successful!");
})
  })
 })
}

function deleteItem(req, res) {
  const body = []

 req.on("data", (chunk)=> {
  body.push(chunk)
 })

 req.on("end", ()=> {
  const parsedItem = Buffer.concat(body).toString()
  const updateDetials = JSON.parse(parsedItem)
const itemId = updateDetials.id

  fs.readFile(itemsDbPath, 'utf-8', (err, items)=> {
    if (err) {
      console.log(err)
      res.writeHead(404)
      res.end('An error occured')
    }
   

   const jsonObject = JSON.parse(items)

   const jsonIndex = jsonObject.findIndex(item => item.id === itemId)
   

  //  const obj = jsonObject[jsonIndex]
  

  if (jsonIndex === -1) {
    res.writeHead(404)
    res.end("Item with specified id not found")
    return
  }


jsonObject.splice(jsonIndex, 1)

fs.writeFile(itemsDbPath, JSON.stringify(jsonObject), (err)=> {
  if (err) {
    console.log(err)
    res.writeHead(500)
    res.end(JSON.stringify({
      message: 'Internal Server Error. Could Not Save Book To Database'
    }));
  }
  res.writeHead(200)
  res.end("Deletion Successful!");
})
  })
 })
}


const server = http.createServer(requestHandler)

server.listen(PORT, HOST_NAME, () => {
  itemsDb = JSON.parse(fs.readFileSync(itemsDbPath, 'utf-8'));
  console.log(`Server is listening on ${HOST_NAME}:${PORT}`)
})
