require("dotenv").config()
const multer = require("multer"),
    upload = multer();
const express = require("express"),
    bodyParser = require("body-parser"),
    app = express(),
    port = process.env.PORT || 3001;
const cors = require("cors");
const {main} = require("./azure.js")

const { Client } = require("@notionhq/client")

async function fetchNotion(){
const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});
const databaseId = process.env.DATABASE_ID;
try {
    const response = await notion.databases.query({
    database_id: databaseId,
    });

    return response.results;
} catch (error) {
    console.error('Error fetching database data:', error);
}
}






app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

app.get('/', async function(req, res){
    try{
        res.send("ya estoy")
        res.end()
    }catch(err){
        console.error(err)
    }
});
app.post('/', upload.single('image') , async function (req, res, next) {
    try {
        res.send(await main(req))
        //
        res.end()
    } catch (error) {
        console.error(error)
    }    
});

app.get('/notion', async function(req, res){
    try{
        
        res.send(await fetchNotion())
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



