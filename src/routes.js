//express é uma bilbioteca para criar o servidor
const express = require('express');
//é uma parte do express que cria as rotas
const routes = express.Router();

const ProfileController = require('./controllers/ProfileController')

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

            return res.render("index", { jobs: updatedJobs })
        },
        create(req, res) {
            return res.render("job")
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

            return res.render("job-edit", { job })
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
routes.get('/profile', ProfileController.index)
routes.post('/profile', ProfileController.update)

module.exports = routes;