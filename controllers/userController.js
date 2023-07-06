const { Account, Post, User } = require('../models')
const bcrypt = require('bcrypt')

// const multer = require('multer')
// const upload = multer({ dest: 'assets/' })

class UserController {

    static landingPage(req, res) {
        res.render('landing-page')
    }

    static showFormRegist(req, res) {
        res.render('form-register')
    }

    static postFormRegistUser(req, res) {
        const { username, email, password, confirmPassword, role } = req.body
        // console.log(req.body)
        if (password === confirmPassword) {
            bcrypt.hash(password, 10)
                .then((hashedPassword) => {
                    return Account.create({ username, email, password: hashedPassword, role })
                })
                .then((data) => {
                    res.redirect('/login?msg=Register Success!')
                })
                .catch((err) => {
                    res.send(err)
                })
        } else {
            res.send({ error: 'Password and confirm password is not match!' })
        }
    }

    static showFormLogin(req, res){
        res.render('form-login')
    }

    static postFormLogin(req, res){
        const {username, password} = req.body
        let dataAccount
        Account.findOne({
            where: {
                username
            }
        })
        .then((data) => {
            if(!data){
                res.redirect('/login?msg=username and password wrong!')
            }
            dataAccount = data
            return bcrypt.compare(password, data.password)
        })
        .then((validPassword) => {
            if(!validPassword){
                res.redirect('/login?msg=username and password wrong!')
            }
            req.session.accountId = dataAccount.id
            res.redirect('/home')
        })
        
    }

    static home(req, res){
        if(req.session.accountId){
        Post.findAll({
            include: Account
        })
        .then((data) => {
            // res.send(data)
            res.render('home', {data})
        })
        .catch((err) => {
            res.send(err)
        })
        }
    }

    static postHome(req, res){
        const {content} = req.body
        Post.create({content})
        .then((data) => {
            res.redirect('/home')
        })
        .catch((err) => {
            res.send(err)
        })
    }

    static showFormAddProfile(req, res){
        res.render('form-profile')
    }

    static postFormAddProfile(req, res){
        const {firstName, lastName, dateOfBirth, address, bio} = req.body
        User.create({ firstName, lastName, dateOfBirth, address, bio })
        .then((data) => {
            res.redirect('/home/profile')
        })
        .catch((err) => {
            res.send(err )
        })
    }

    // static postPhoto(req, res){
    //     upload.single('profileImage')
    //     console.log(req.body)
    //     console.log(req.file)
    // }

    static logout(req, res){
        req.session.destroy()
        res.redirect('/login')
    }
}

module.exports = UserController