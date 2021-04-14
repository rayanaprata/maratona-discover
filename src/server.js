const express = require("express")
const server = express()
const routes = require("./routes")

server.set('view engine', 'ejs')

//hailitar arquivos statics
server.use(express.static("public"))

// routes
server.use(routes)

//funcionalidade listen que vai ligar o servidor ;)
server.listen(3000, () => console.log('rodando'))