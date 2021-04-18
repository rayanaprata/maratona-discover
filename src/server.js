const express = require("express")
const server = express()
const routes = require("./routes")
const path = require("path")

//uasndo o template engine
server.set('view engine', 'ejs')

//mudar a localização da pasta views
server.set('views', path.join(__dirname, 'views'))

//hailitar arquivos statics
server.use(express.static("public"))

//usar o req.body
server.use(express.urlencoded({extended: true}))

// routes
server.use(routes)

//funcionalidade listen que vai ligar o servidor ;)
server.listen(3000, () => console.log('rodando'))