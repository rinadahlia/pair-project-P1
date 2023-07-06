const express = require('express')
const app = express()
const session = require('express-session')
const port = 6969
const route = require('./routes/route')

// const multer = require('multer')
// const upload = multer({ dest: 'assets/' })

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'cuitter',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        sameSite: true
    }
}))

app.use(route)

// app.get('/', (req, res) => {
//     res.send('Welcome to CUITTER')
// })

app.listen(port, () => {
    console.log(`CUITTER app listening on port ${port}`)
})