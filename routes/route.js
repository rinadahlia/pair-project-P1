const express = require('express')
const UserController = require('../controllers/userController')
const route = express.Router()

const multer = require('multer')
const upload = multer({ dest: 'assets/' })

// landing page
route.get('/', UserController.landingPage)

//register get and post
route.get('/register', UserController.showFormRegist)
route.post('/register', UserController.postFormRegistUser)

//login get and post
route.get('/login', UserController.showFormLogin)
route.post('/login', UserController.postFormLogin)


// route.use(function(req, res, next){
//     console.log(req.session)
//     if(!req.session.accountId){
//         res.redirect('/login?msg=Access denied! Login first.')
//     } else {
//         next()
//     }
// })

route.get('/home', UserController.home)
route.post('/home', UserController.postHome)

route.get('/home/profile', UserController.showFormAddProfile)
route.post('/home/profile', UserController.postFormAddProfile)

route.get('/home/edit', UserController.showFormAddEdit)
route.post('/home/edit', UserController.postFormAddEdit)

// route.get('/home/delete', UserController.delete)

route.get('/logout', UserController.logout)


module.exports = route