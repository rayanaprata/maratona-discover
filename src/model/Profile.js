let data = {
    name: "Rayana Prata",
    avatar: "https://media-exp1.licdn.com/dms/image/C4E03AQFcl-25IiQC5A/profile-displayphoto-shrink_200_200/0/1607122339556?e=1623888000&v=beta&t=5E77z_Y3NJ0Rysd68fDywH8mN63NBpan4HNOJ5zqzw8",
    "monthly-budget": 2500,
    "days-per-week": "5",
    "hour-per-day": "8",
    "vacation-per-year": 2,
    "value-hour": 75
};

module.exports = {
    get(){
        return data;
    },

    update(newData){
        data = newData;
    }
}