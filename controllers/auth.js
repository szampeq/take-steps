const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');

const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if ( !email || !password ) {
            return res.status(400).render('login.hbs', {
                message: 'Musisz podać email i hasło!'
            })
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            if (!results || !(await bcrypt.compare(password, results[0].password))) {
                console.log("typ: " + typeof(results));
                return res.status(401).render('login.hbs', {
                    message: 'Email lub hasło niepoprawne!'
                });
            } else {
                const id = results[0].id;

                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("token: " + token);
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/profile");
            }

        })

    } catch (error) {
        console.log(error);
    }
}

exports.register = (req, res) => {
    console.log(req.body);

    const { name, email, password, passwordConfirm } = req.body; 

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }
        
        if (results.length > 0) {
            return res.render('register.hbs', {
                message: 'Ten adres email jest już w użyciu!'
            })
        } else if ( password !== passwordConfirm ) {

            return res.render('register.hbs', {
                message: 'Hasła nie są jednakowe!'
            })        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword, registerdate: new Date()}, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render('register.hbs', {
                    message: 'Pomyślnie zarejestrowano!'
                });
            }
        })

    });
           
}

exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            // check token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt,
            process.env.JWT_SECRET
            );

            // check if user exists
            db.query('SELECT * FROM users WHERE id =?', [decoded.id], (error, result) => {
               // console.log(result);

                if (!result) {
                    return next();
                }

                req.user = result[0];
                console.log("user is")
                console.log(req.user);

                return next();

            });
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        next();
    }
}

exports.logout = async (req, res) => {
    res.clearCookie('jwt');
    res.status(200).redirect('/');
    localStorage.clear();
  }