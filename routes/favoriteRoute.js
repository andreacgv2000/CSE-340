const express = require("express")
const router = express.Router()
const favController = require("../controllers/favoriteController")
const utilities = require("../utilities/")
const { body } = require("express-validator")

router.get("/", utilities.checkLogin, favController.buildFavorites)

router.post(
  "/add",
  utilities.checkLogin,
  body("inv_id").isInt().withMessage("Invalid vehicle ID"),
  favController.addFavorite
)

router.post(
  "/remove",
  utilities.checkLogin,
  body("inv_id").isInt().withMessage("Invalid vehicle ID"),
  favController.removeFavorite
)

module.exports = router
