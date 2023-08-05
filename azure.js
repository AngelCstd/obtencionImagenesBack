//Inicio de cliente de azure
require("dotenv").config();
const { PassThrough } = require('stream');
const { BlobServiceClient } = require("@azure/storage-blob");
const storageAccountConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const blobServiceClient = BlobServiceClient.fromConnectionString(storageAccountConnectionString);

// Creamos conexion con el cliente del container que queremos acceder
async function main(req) {
    const containerName = "elianphotos";
    const containerClient = blobServiceClient.getContainerClient(containerName);

    return await cargaBlob(req, containerClient);
}

//Creamos el blob con el nombre aleatorio y subimos el stream con el nombre creado y el file
async function cargaBlob(req, containerClient) {
    const blobName = `${Math.random()
            .toString()
            .replace(/0\./, "")
            .substring(0, 3)}-${req.file.originalname}`,
        blockBlobClient = containerClient.getBlockBlobClient(blobName),
        streamLength = req.file.buffer.length,
        stream = new PassThrough();
    stream.end(req.file.buffer);

    try {
        await blockBlobClient.uploadStream(stream, streamLength);
    } catch (error) {
        console.error(error);
    }
    return {
        url: `https://elian29.blob.core.windows.net/elianphotos/${blobName}`,
    };
}

module.exports = {
    main
}