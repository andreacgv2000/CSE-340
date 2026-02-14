// routes/accountRoute.js

const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const accountsController = require("../controllers/accountsController");
const regValidate = require("../utilities/account-validation");


// GET route para la vista de login (My Account)
router.get("/login", accountsController.buildLogin);

// Ruta GET para la vista de registro
router.get("/register", accountsController.buildRegister);

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),  // reglas de validación
  regValidate.checkRegData,         // revisar errores
  utilities.handleErrors(accountsController.registerAccount) // controlador
);





// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountsController.accountLogin)
)


// GET route para la vista Account (después del login)
router.get("/",utilities.checkLogin, utilities.handleErrors(accountsController.buildAccount));



// ======================
// UPDATE ACCOUNT INFO
// ======================

// Deliver update account view
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountsController.buildUpdateAccount)
);

// Process account update
router.post(
  "/update",
  utilities.checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountsController.updateAccount)
);

router.post(
  "/update-password",
  utilities.checkLogin,
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountsController.updatePassword)
);


// ======================
// LOGOUT
// ======================

router.get(
  "/logout",
  utilities.handleErrors(accountsController.logout)
);


// Exportar el router
module.exports = router;
