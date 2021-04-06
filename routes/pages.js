const express = require('express');
const authController = require('../controllers/auth');
const stepsController = require('../controllers/steps');
const router = express.Router();

router.get('/', authController.isLoggedIn, (req, res) => {
    res.render('index.hbs', {
        user: req.user
    });
});

router.get('/register', authController.isLoggedIn, (req, res) => {
    if (req.user) {
        res.redirect('/profile');
    } else {
        res.render('register.hbs');
    }
});

router.get('/login', authController.isLoggedIn, (req, res) => {
    if (req.user) {
        res.redirect('profile');
    } else {
    res.render('login.hbs');
    }
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

router.get('/profile/userdata/:userid', stepsController.userData), (req, res) => {
    res.send(req.params);
};

router.post('/profile/userdata/steps/:userid', stepsController.newStep), (req, res) => {
    res.send(req.params);
};

router.get('/ranking', authController.isLoggedIn, (req, res) => {
    console.log(req.user);
    if (req.user) {
        res.render('ranking.hbs', {
            user: req.user,
        });
    } else {
        res.redirect('/login');
    }
})

router.get('/ranking/month', stepsController.monthList);

module.exports = router;