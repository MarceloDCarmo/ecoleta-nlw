const express = require("express")
const server = express()

//pegar o banco de dados
const db = require("./database/db")

//configurar pasta publica
server.use(express.static("public"))

//habilitar o uso do req.body
server.use(express.urlencoded({extended: true}))

//utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})


//configurar caminhos
//pagina inicial
server.get("/", (req, res) => {
    return res.render("index.html", {
        title: "Seu marketplace de coleta de resíduo"
    })
})
//pagina cadastro de ponto de coleta
server.get("/create-point", (req, res) => {
    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
    // inserção de dados no banco de dados
    const query = `INSERT INTO places (
        name,
        image, 
        adress, 
        adress2, 
        state, 
        city, 
        items
    ) VALUES (?,?,?,?,?,?,?);` 

    const values = [
        req.body.name,
        req.body.image,
        req.body.adress,
        req.body.adress2,
        req.body.state,
        req.body.city,
        req.body.items, 
    ]

    function afterInsertData(err){
        if(err){
            return console.log(err)
            //criar um modal de erro
        }

        console.log("Cadastrado com sucesso")
        console.log(this)
        return res.render("create-point.html", {saved: true})
    }

    db.run(query, values, afterInsertData)  
})

//pagina resultado de pesquisa
server.get("/search", (req, res) => {

    const search = req.query.search

    if(search == ""){
        //pesquisa vazia
        return res.render("search-results.html", {total: 0})
    }

    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
    if(err){
        return console.log(err)
    }

    const total = rows.length

    // mostrar pagina HTML com dados do banco de dados

    return res.render("search-results.html", {places: rows, total: total})
    })
})

//ligar o servidor
server.listen(3000)