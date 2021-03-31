const mysql = require("mysql");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

exports.weekList =  async (req, res) => {
    await db.query('SELECT SUM(amount) AS weeksteps, users.name FROM steps INNER JOIN users ON steps.userid = users.id WHERE day >= ( CURDATE() - INTERVAL 7 DAY ) GROUP BY userid ORDER BY SUM(amount) DESC LIMIT 10', (error, results) => {
        if (error) {
            throw error;
        }

        console.log("steps:");
        results=JSON.parse(JSON.stringify(results))
        console.log(results);
        
        return res.send({
            data: results
        });
    });
}

exports.monthList = () => {
    db.query('SELECT * FROM `steps` WHERE `day` >= ( CURDATE() - INTERVAL 30 DAY )`');
}