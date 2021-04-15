//express é uma bilbioteca para criar o servidor
const express = require('express');
//é uma parte do express que cria as rotas
const routes = express.Router();

const views = __dirname + "/views/"

const profile = {
    name: "Rayana Prata",
    avatar: "https://media-exp1.licdn.com/dms/image/C4E03AQFcl-25IiQC5A/profile-displayphoto-shrink_200_200/0/1607122339556?e=1623888000&v=beta&t=5E77z_Y3NJ0Rysd68fDywH8mN63NBpan4HNOJ5zqzw8",
    "monthly-budget": 2500,
    "days-per-week": "5",
    "hour-per-day": "8",
    "vacation-per-year": 2
}

//para selecionar várias palavras de uma vez só é só selecionar apalavra dar Ctrl + Shit + L e ele substitui todas as palavras
// alt e clicar em outras linhas tbm seleciona várias

//req, res
routes.get('/', (req, res) => res.render(views + "index"))
routes.get('/job', (req, res) => res.render(views + "job"))
routes.post('/job', (req, res) => {
    consol.log(req.body)
})
routes.get('/job/edit', (req, res) => res.render(views + "job-edit"))
routes.get('/profile', (req, res) => res.render(views + "profile", { profile: profile}))

module.exports = routes;