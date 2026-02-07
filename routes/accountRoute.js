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


// Exportar el router
module.exports = router;
