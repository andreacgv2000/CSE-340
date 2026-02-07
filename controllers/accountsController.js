// controllers/accountController.js
const utilities = require('../utilities') // si necesitas funciones de utilidades

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
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("accounts/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("accounts/register", {
      title: "Registration",
      nav,
    });
  }
}

module.exports = { buildLogin, buildRegister, registerAccount };
