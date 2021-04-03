const mysql = require("mysql");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

exports.monthList =  async (req, res) => {
    await db.query('SELECT SUM(amount) AS monthsteps, users.name FROM steps INNER JOIN users ON steps.userid = users.id WHERE day >= ( CURDATE() - INTERVAL 30 DAY ) GROUP BY userid ORDER BY SUM(amount) DESC LIMIT 10', (error, results) => {
        if (error) {
            throw error;
        }
        
        return res.send({
            steps: results
        });
    });
}

exports.userData =  async (req, res) => {
    const userID = req.params.userid;
    let userdata = [];
    await db.query('SELECT SUM(amount) AS weeksteps FROM steps INNER JOIN users ON steps.userid = users.id WHERE users.id = ? && day >= ( CURDATE() - INTERVAL 7 DAY )', userID, (error, results) => {
        if (error) {
            throw error;
        }
        userdata.push(results);
    });
    await db.query('SELECT SUM(amount) AS monthsteps FROM steps INNER JOIN users ON steps.userid = users.id WHERE users.id = ? && day >= ( CURDATE() - INTERVAL 30 DAY )', userID, (error, results) => {
        if (error) {
            throw error;
        }
        userdata.push(results);
    });
    await db.query('SELECT SUM(amount) AS allsteps FROM steps INNER JOIN users ON steps.userid = users.id WHERE users.id = ?', userID, (error, results) => {
        if (error) {
            throw error;
        }
        userdata.push(results);
        return res.send({
            steps: userdata
        });
    });
}