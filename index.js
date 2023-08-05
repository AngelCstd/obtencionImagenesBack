const multer = require("multer"),
    upload = multer();
const express = require("express"),
    bodyParser = require("body-parser"),
    app = express(),
    port = process.env.PORT || 3001;
const cors = require("cors");
const {main} = require("./azure.js")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.post('/', upload.single('image') , async function (req, res, next) {
    try {
        res.send(await main(req))
        //
        res.end()
    } catch (error) {
        console.error(error)
    }    
});
app.get('/', async function(req, res){
    try{
        console.log(req)
        console.log("*****************************************")
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



