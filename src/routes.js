//express é uma bilbioteca para criar o servidor
const express = require('express');
//é uma parte do express que cria as rotas
const routes = express.Router();

const views = __dirname + "/views/"

const Profile = {
    data: {
        name: "Rayana Prata",
        avatar: "https://media-exp1.licdn.com/dms/image/C4E03AQFcl-25IiQC5A/profile-displayphoto-shrink_200_200/0/1607122339556?e=1623888000&v=beta&t=5E77z_Y3NJ0Rysd68fDywH8mN63NBpan4HNOJ5zqzw8",
        "monthly-budget": 2500,
        "days-per-week": "5",
        "hour-per-day": "8",
        "vacation-per-year": 2,
        "value-hour": 75
    },

    controllers: {
        index(req, res) {
            return res.render(views + "profile", { profile: Profile.data })
        },

        update(req, res) {
            //req.body para pegar os dados
            const data = req.body

            //definir quantas semanas tem num ano: 52
            const weeksPerYear = 52

            //remover as semanas de férias do ano, para pegar quantas semanas tem em 1 mês
            const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12

            //quantas horas por semana estou trabalhando
            const weeksTotalHours = data["hours-per-day"] * data["days-per-week"]

            //total de horas trabalhadas no mês
            const monthlyTotalHours = weeksTotalHours * weeksPerMonth

            //definindo o valor da horas
            const valueHour = data["value-hour"] = data["monthly-budget"] / monthlyTotalHours

            Profile.data = {
                ...Profile.data,
                ...req.body,
                "value-hour": valueHour
            }

            return res.redirect('/profile')
        }
    }
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
                    budget: Job.services.calculateBudget(job, Profile.data["value-hour"])
                }
            })

            return res.render(views + "index", { jobs: updatedJobs })
        },
        create(req, res) {
            return res.render(views + "job")
        },
        save(req, res) {
            //referência req.body = { name: 'sdfgsfdg', 'daily-hours': '5', 'total-hours': '45' }
            const lastId = Job.data[Job.data.length - 1]?.id || 0;

            Job.data.push({
                id: lastId + 1,
                name: req.body.name,
                'daily-hours': req.body["daily-hours"],
                "total-hours": req.body["total-hours"],
                createdAt: Date.now() //atribuindo data de hoje
            })
            return res.redirect('/')
        },
        show(req, res) {
            const jobId = req.params.id

            const job = Job.data.find(job => Number(job.id) === Number(jobId))

            if (!job) {
                return res.send("Job not found!")
            }

            job.budget = Job.services.calculateBudget(job, Profile.data["value-hour"])

            return res.render(views + "job-edit", { job })
        },
        update(req, res) {
            const jobId = req.params.id

            const job = Job.data.find(job => Number(job.id) === Number(jobId))

            if (!job) {
                return res.send("Job not found!")
            }

            const updatedJob = {
                ...job,
                name: req.body.name,
                "total-hours": req.body["total-hours"],
                "daily-hours": req.body["daily-hours"],
            }

            Job.data = Job.data.map(job => {
                if (Number(job.id) === Number(jobId)) {
                    job = updatedJob
                }

                return job
            })

            res.redirect('/job/' + jobId)
        },
        delete(req, res) {
            const jobId = req.params.id

            Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId))

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
        },
        calculateBudget: (job, valueHour) => valueHour * job["total-hours"]
    }
}

//para selecionar várias palavras de uma vez só é só selecionar apalavra dar Ctrl + Shit + L e ele substitui todas as palavras
// alt e clicar em outras linhas tbm seleciona várias

//req, res
routes.get('/', Job.controllers.index)
routes.get('/job', Job.controllers.create)
routes.post('/job', Job.controllers.save)
routes.get('/job/:id', Job.controllers.show)
routes.post('/job/:id', Job.controllers.update)
routes.post('/job/delete/:id', Job.controllers.delete)
routes.get('/profile', Profile.controllers.index)
routes.post('/profile', Profile.controllers.update)
module.exports = routes;