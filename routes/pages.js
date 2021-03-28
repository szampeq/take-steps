const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

router.get('/', authController.isLoggedIn, (req, res) => {
    res.render('index.hbs', {
        user: req.user
    });
});

router.get('/register', (req, res) => {
    res.render('register.hbs');
});

router.get('/login', (req, res) => {
    res.render('login.hbs');
});

router.get('/logout', authController.logout);

router.get('/profile', authController.isLoggedIn, (req, res) => {
    console.log(req.user);
    if (req.user) {
        res.render('profile.hbs', {
            user: req.user
        });
    } else {
        res.redirect('/login');
    }
})

module.exports = router;