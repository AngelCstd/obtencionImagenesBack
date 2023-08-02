require("dotenv").config();
const { BlobServiceClient } = require("@azure/storage-blob");
//Obtengo la contraseña de acceso
const storageAccountConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
console.error(storageAccountConnectionString)
//Creo una conexion con el cliente de blob y con mi access key
const blobServiceClient = BlobServiceClient.fromConnectionString(storageAccountConnectionString);
//***************************************** */
const multer = require("multer"),
    { PassThrough } = require('stream'),
    memoryStorage = multer.memoryStorage(),
    uploadStrategy = multer({ storage: memoryStorage }).single('imagen')

const express = require("express"),
    bodyParser = require("body-parser"),
    app = express(),
    port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', uploadStrategy ,async function (req, res, next) {
    try {
        res.send(await main(req))
        res.end()
    } catch (error) {
        console.error(error)
    }    
});
app.get('/', async function(req, res){
    try{
        res.send("ya estoy")
        res.end()
    }catch(err){
        console.error(err)
    }
});

app.use((err, req, res, next)=>{
    const statuscode = err.statuscode || 500;
})

app.listen(port, () => {
    console.log('server iniciado paps')
})


// Creamos conexion con el cliente del container que queremos acceder
async function main(req) {
  const containerName = "elianphotos";
  const containerClient = blobServiceClient.getContainerClient(containerName);

  return await cargaBlob(req, containerClient)
}

async function cargaBlob(req, containerClient) {
    //Creamos el blob con el nombre aleatorio y subimos el stream con el nombre creado y el file
    const blobName = `${Math.random().toString().replace(/0\./, '').substring(0, 3)}-${req.file.originalname}`,
        blockBlobClient = containerClient.getBlockBlobClient(blobName),
        streamLength = req.file.buffer.length,
        stream = new PassThrough();
    stream.end(req.file.buffer);

    try {
        await blockBlobClient.uploadStream(stream, streamLength);
    } catch (error) {
        console.error(error)
    }
    return `https://elian29.blob.core.windows.net/elianphotos/${blobName}`
}
