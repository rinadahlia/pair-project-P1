const { Account, Post, User } = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const nodeMailer = require("nodemailer");

class UserController {
  // landing page
  static landingPage(req, res) {
    res.render("landing-page");
  }

  // register page
  static showFormRegist(req, res) {
    const errors = req.query.errMsg;
    if (errors) {
      // jika ada error, tampilkan error
      res.render("form-register", { errors: errors });
    } else {
      // jika tidak ada error, tampilkan null
      res.render("form-register", { errors: null });
    }
  }

  // register post
  static postFormRegistUser(req, res) {
    const { username, email, password, confirmPassword, role } = req.body;
    // check password and confirm password
    if (password !== confirmPassword) {
      return res.redirect(
        `/register?errMsg=Password and confirm password is not match!`
      );
    }
    // jika password dan confirm password sama => create account
    Account.create({ username, email, password, role })
      .then((data) => {
        // setup email
        const transporter = nodeMailer.createTransport({
          service: "gmail",
          auth: {
            user: "masdarff@gmail.com",
            pass: "ibkowcmffzasdugq",
          },
          host: "smtp.gmail.com",
          port: 587,
          secure: true,
        });
        // email options
        const mailOptions = {
          from: "CUITTER <masdarff@gmail.com>",
          to: email,
          subject: "Registrasi Akun",
          html: `<h1>Selamat Datang ${username}!</h1>
            <p>Anda telah berhasil terdaftar di Aplikasi CUITTER.</p>
            <p>Silahkan login dengan menggunakan ${username} dan password yang telah Anda buat</p>
            <p>Terima kasih!.</p>`,
        };
        // send email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            //   console.log(error);
          } else {
            console.log(`Email sent: ${info.response}`);
          }
        });
        // redirect ke halaman login setelah berhasil register
        res.redirect("/login");
      })
      .catch((err) => {
        // jika error validation, redirect ke halaman register
        if (err.name === "SequelizeValidationError") {
          const errors = err.errors.map((el) => el.message);
          res.redirect(`/register?errMsg=${errors}`);
        } else {
          // jika error lainnya, tampilkan error
          res.send(err);
        }
      });
  }

  // login page
  static showFormLogin(req, res) {
    const errors = req.query.errMsg;
    if (errors) {
      // jika ada error, tampilkan error
      res.render("form-login", { errors: errors });
    } else {
      // jika tidak ada error, tampilkan null
      res.render("form-login", { errors: null });
    }
  }

  // login post
  static postFormLogin(req, res) {
    const { username, password } = req.body;
    // check username and password
    if (!username || !password) {
      return res.redirect("/login?errMsg=username and password wrong!");
    }
    // jika username dan password ada, cek di database
    Account.findOne({
      where: {
        username,
      },
    })
      .then((data) => {
        // jika username tidak ada di database, redirect ke halaman login
        if (!data) {
          return res.redirect("/login?errMsg=username and password wrong!");
        }
        // jika username ada di database, cek password
        const validPassword = bcrypt.compareSync(password, data.password);
        // jika password tidak sesuai, redirect ke halaman login
        if (!validPassword) {
          return res.redirect("/login?errMsg=username and password wrong!");
        }
        // jika password sesuai, buat session
        req.session.account = {
          id: data.id,
          username: data.username,
          email: data.email,
          role: data.role,
        };
        // redirect ke halaman home
        res.redirect(`/home/${data.id}`);
      })
      .catch((err) => {
        // jika error lainnya, tampilkan error
        res.send(err);
      });
  }

  // home page
  static home(req, res) {
    const { id } = req.params;
    let dataUserAndAccount;
    // get data user dan account (eager loading)
    User.findOne({
      where: {
        AccountId: id,
      },
      include: {
        model: Account,
      },
    })
      .then((dataUser) => {
        // jika data user tidak ada, redirect ke halaman profile untuk melengkapi data terlebih dahulu
        if (!dataUser) {
          return res.redirect(`/home/${id}/profile`);
        }
        // jika data user sudah ada, get data posts
        dataUserAndAccount = dataUser.dataValues;
        // jika ada query sort, maka sort data posts berdasarkan createdAt
        if (req.query.sort === "ASC") {
          // menggunakan static method getAllPosts di model Post
          return Post.getAllPosts(req.query.sort);
        } else {
          // menggunakan static method getAllPosts di model Post
          return Post.getAllPosts("DESC");
        }
      })
      .then((dataPosts) => {
        // console.log(dataPosts[0].dataValues.Account.User);
        // render halaman home dengan mengirimkan data user&account, dan posts
        res.render("home", { dataUserAndAccount, dataPosts });
      })
      .catch((err) => {
        res.send(err);
      });
  }

  // create post
  static postHome(req, res) {
    const { id } = req.params;
    const { content } = req.body;
    Post.create({ content, AccountId: id })
      .then((data) => {
        res.redirect(`/home/${id}`);
      })
      .catch((err) => {
        res.send(err);
      });
  }

  // get profile page
  static showFormAddProfile(req, res) {
    const errors = req.query.errMsg;
    const { id } = req.params;
    Account.findByPk(id)
      .then((data) => {
        if (errors) {
          // jika ada error, tampilkan error
          res.render("form-profile", { data, errors: errors });
        } else {
          // jika tidak ada error, tampilkan null
          res.render("form-profile", { data, errors: null });
        }
      })
      .catch((err) => {
        res.send(err);
      });
  }

  // post profile
  static postFormAddProfile(req, res) {
    const { firstName, lastName, dateOfBirth, address, bio } = req.body;
    const { AccountId } = req.params;
    User.create({ firstName, lastName, dateOfBirth, address, bio, AccountId })
      .then((data) => {
        res.redirect(`/home/${AccountId}`);
      })
      .catch((err) => {
        // jika error validation, redirect ke halaman profile
        if (err.name === "SequelizeValidationError") {
          const errors = err.errors.map((el) => el.message);
          res.redirect(`/home/${AccountId}/profile?errMsg=${errors}`);
        } else {
          // jika error lainnya, tampilkan error
          res.send(err);
        }
      });
  }

  // get edit profile page
  static showFormEdit(req, res) {
    const errors = req.query.errMsg;
    const id = req.params.id;
    User.findOne({
      where: {
        AccountId: id,
      },
    })
      .then((data) => {
        // const date = new Date(data.dataValues.dateOfBirth);
        // const year = date.getFullYear();
        // const month = ('0' + (date.getMonth() + 1)).slice(-2);
        // const day = ('0' + date.getDate()).slice(-2);
        // data.dataValues.ISODate = `${year}-${month}-${day}`;
        // res.render('edit-profile', { data: data.dataValues })

        // get dateOfBirth dengan format ISODate menggunakan getter
        const newDate = data.ISODate;
        data.dataValues.dateOfBirth = newDate;

        // jika ada error, tampilkan error
        if (errors) {
          res.render("edit-profile", { data, errors: errors });
        } else {
          // jika tidak ada error, tampilkan null
          res.render("edit-profile", { data, errors: null });
        }
      })
      .catch((err) => {
        res.send(err);
      });
  }

  // post edit profile
  static postFormEdit(req, res) {
    const { firstName, lastName, dateOfBirth, address, bio } = req.body;
    User.update(
      { firstName, lastName, dateOfBirth, address, bio },
      {
        where: {
          AccountId: req.params.id,
        },
      }
    )
      .then((data) => {
        res.redirect(`/home/${req.params.id}`);
      })
      .catch((err) => {
        if (err.name === "SequelizeValidationError") {
          const errors = err.errors.map((el) => el.message);
          res.redirect(`/home/${req.params.id}/edit?errMsg=${errors}`);
        } else {
          res.send(err);
        }
      });
  }

  // static postPhoto(req, res){
  //     upload.single('profileImage')
  //     console.log(req.body)
  //     console.log(req.file)
  // }

  static deleteById(req, res) {
    const { AccountId, PostId } = req.params;
    Post.destroy({
      where: [
        {
          [Op.and]: [{ id: PostId }, { AccountId }],
        },
      ],
    })
      .then((data) => {
        res.redirect(`/home/${AccountId}`);
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static logout(req, res) {
    req.session.destroy();
    res.redirect("/login");
  }
}

module.exports = UserController;
