module.exports = {
    index(req, res) {
        return res.render("profile", { profile: Profile.data })
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