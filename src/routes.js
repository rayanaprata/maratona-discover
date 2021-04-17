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
    "vacation-per-year": 2,
    "value-hour": 75
}

const Job = {
    data: [
        {
            id: 1,
            name: "Pizzaria Guloso",
            'daily-hours': 2,
            "total-hours": 60,
            createdAt: Date.now()
        },
        {
            id: 2,
            name: "OneTwo Project",
            'daily-hours': 3,
            "total-hours": 47,
            createdAt: Date.now()
        }
    ],
    controllers: {
        index(req, res) {
            const updatedJobs = Job.data.map((job) => {
                //ajustes no jobs
                const remaining = Job.services.remainingDays(job)
                // if ternário :)
                const status = remaining <= 0 ? 'done' : 'progress'

                return {
                    //pegando tdo que tem dentro do job e colocando lá dentro
                    ...job,
                    remaining,
                    status,
                    budget: profile["value-hour"] * job["total-hours"]
                }
            })

            return res.render(views + "index", { jobs: updatedJobs })
        },
        create(req, res) {
            return res.render(views + "job")
        },
        save(req, res) {
            //referência req.body = { name: 'sdfgsfdg', 'daily-hours': '5', 'total-hours': '45' }
            const lastId = Job.data[Job.data.length - 1]?.id || 1;

            jobs.push({
                id: lastId + 1,
                name: req.body.name,
                'daily-hours': req.body["daily-hours"],
                "total-hours": req.body["total-hours"],
                createdAt: Date.now() //atribuindo data de hoje
            })
            return res.redirect('/')
        }
    },
    services: {
        remainingDays(job) {
            //cálculo de tempo restante
            const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed()
            const createdDate = new Date(job.createdAt)
            const dueDay = createdDate.getDate() + Number(remainingDays)
            const dueDateInMs = createdDate.setDate(dueDay)

            const timeDiffInMs = dueDateInMs - Date.now()
            //transformar millisegundos em dias
            const dayInMs = 1000 * 60 * 60 * 24
            const dayDiff = Math.floor(timeDiffInMs / dayInMs)

            //restam x dias (diferença de dias)
            return dayDiff
        }
    }
}

//para selecionar várias palavras de uma vez só é só selecionar apalavra dar Ctrl + Shit + L e ele substitui todas as palavras
// alt e clicar em outras linhas tbm seleciona várias

//req, res
routes.get('/', Job.controllers.index)
routes.get('/job', Job.controllers.create)
routes.post('/job', Job.controllers.save)
routes.get('/job/edit', (req, res) => res.render(views + "job-edit"))
routes.get('/profile', (req, res) => res.render(views + "profile", { profile: profile }))

module.exports = routes;