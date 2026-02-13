// controllers/accountController.js
const utilities = require('../utilities') // si necesitas funciones de utilidades
const jwt = require("jsonwebtoken")

const bcrypt = require("bcryptjs")


require("dotenv").config()




/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav()  // obtiene el nav
    res.render("accounts/login", {
      title: "Login",
      nav,
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("accounts/register", {
      title: "Register",
      nav,
      errors: null
    });
  } catch (error) {
    next(error);
  }
}

const accountModel = require("../models/account-model"); // importa el modelo

/* ****************************************
*  Procesar registro
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  let hashedPassword
  try {
    // Hashear la contraseña
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    throw new Error("Password hashing failed")
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword // 👈 guardamos el hash, no la contraseña real
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("accounts/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("accounts/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("accounts/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("accounts/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

async function buildAccount(req, res) {
  let nav = await utilities.getNav();
  res.render("accounts/account", {
    title: "My Account",
    nav,
  });
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccount};
