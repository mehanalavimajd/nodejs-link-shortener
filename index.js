const express = require("express")
const app = express()
const process = require("process")
const fs = require("fs")
// use dotenv to read .env file and get the PORT
require("dotenv").config()
const port = process.env.PORT


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// load html and css in public folder
app.use(express.static("public"))
app.get("/", (req, res) => { res.sendFile("index.html") })
app.post("/", (req, res) => {
    let newJson=JSON.parse(fs.readFileSync("./db.json"))
    const {origUrl} = req.body;
    let isInJson=false;
    // check if url isn't in json
    newJson.links.forEach(element => {
        if (element.url===origUrl) {
            res.send(`<h1>Your shorted link is http://localhost:${port}/${element.id}</h1>`)
        }
    });
    // make the short id and put it in db.json
    let id = Math.random() * 10000000;
    id=Math.floor(id)
    // push to json


    newJson.links.push({
        id:id,
        url:origUrl
    })
    fs.writeFileSync("./db.json",JSON.stringify(newJson))
    res.send(`<h1>Your short url is: http://localhost:${port}/${id}</h1>`)
})
app.get("/:id",(req,res)=>{
    // redirect
    const id=req.params.id
    let newJson=JSON.parse(fs.readFileSync("./db.json"))
    let link=newJson.links.find(link=>link.id==id)
    if(link){
        res.redirect(link.url)
    }
    else{
        res.send("no link found")
    }
})
app.listen(port, () => console.log(`app listening on port ${port}!`))