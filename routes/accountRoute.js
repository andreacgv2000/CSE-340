// routes/accountRoute.js

const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const accountsController = require("../controllers/accountsController");

// GET route para la vista de login (My Account)
router.get("/login", accountsController.buildLogin);

// Ruta GET para la vista de registro
router.get("/register", accountsController.buildRegister);

// Procesar registro de nuevo usuario
router.post("/register", utilities.handleErrors(accountsController.registerAccount));


// Exportar el router
module.exports = router;
