const e = require("express");
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
    let weekscore = 0, monthscore = 0, allscore = 0;
    const date = new Date();
    date.setHours(0,0,0);
    date.setUTCHours(0);
    const weekStamp = 7 * 24 * 60 * 60 * 1000;
    const monthStamp = 30 * 24 * 60 * 60 * 1000;


    await db.query('SELECT steps.id, day, amount FROM steps INNER JOIN users ON steps.userid = users.id WHERE users.id = ? ORDER BY day', userID, (error, results) => {
        if (error) {
            throw error;
        }
        console.log(date);
        results.forEach(element => {
            element.day.setHours(0, 0, 0);
            element.day.setUTCHours(0);
            console.log(element);
            if ((date - element.day) < weekStamp)
                weekscore += element.amount;
            if ((date - element.day) < monthStamp) {
                monthscore += element.amount;
            }
            allscore += element.amount;
        });
        userdata.push(results);

        return res.send({
            steps: userdata,
            weekscore: weekscore,
            monthscore: monthscore,
            allscore: allscore
        });
    });

}

exports.newStep = async (req, res) => {
    console.log("BODY", req.body);
    const date = new Date(req.body.date);
    date.setDate(date.getDate() + 1);
    
    console.log("date", date);

    const insertSteps = async (results) => {
        try{
            await db.query('INSERT INTO steps SET ?', {day: date, amount: req.body.steps, userid: req.params.userid},  (error, results) => {
                if (error) {
                    throw error;
                }
                res.redirect(req.get('referer'));
            });
        }catch(error) {
            console.log(error);
        }
    }

    try {
        await db.query('SELECT * FROM steps WHERE userid = ? && day = ?', [req.params.userid, date.toISOString().slice(0, 10)], (error, results) => {
            if (error) {
                throw error;
            }

            if (results.length > 0) {
                res.redirect(req.get('referer'));
            }
            else
               insertSteps(results);
        });

    } catch (error) {
        console.log(error);
    }


/*
    const date = new Date();
    date.setHours(0,0,0);
    date.setUTCHours(0);
    const userID = req.params.userid;
    const userRegisterDate = req.params.registerdate;

    await db.query('SELECT steps.id, day, amount FROM steps INNER JOIN users ON steps.userid = users.id WHERE users.id = ?', userID, (error, results) => {
        if (error) {
            throw error;
        }
    });
    console.log(req.params);
    console.log(userID);
    console.log(steps);
    console.log(date);*/

    /*
    await db.query('INSERT INTO steps (day, amount, userid) VALUES (? ? ?)', day, steps, userID,  (error, results) => {
        if (error) {
            throw error;
        }
    });*/
}