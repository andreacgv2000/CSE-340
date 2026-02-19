const favoriteModel = require("../models/favorite-model")
const utilities = require("../utilities/")
const { validationResult } = require("express-validator")

const favController = {}

favController.addFavorite = async function (req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash("error", "Invalid data.")
    return res.redirect("back")
  }

  try {
    const inv_id = parseInt(req.body.inv_id)
    const account_id = res.locals.accountData.account_id   // ✅ CAMBIO AQUÍ

    await favoriteModel.addFavorite(account_id, inv_id)

    req.flash("success", "Vehicle added to favorites.")
    res.redirect(`/inv/detail/${inv_id}`)   // ✅ volver al detalle
  } catch (error) {
    console.error(error)
    req.flash("error", "Could not add favorite.")
    res.redirect("back")
  }
}

favController.buildFavorites = async function (req, res, next) {
  try {
    const account_id = res.locals.accountData.account_id   // ✅ CAMBIO AQUÍ
    const data = await favoriteModel.getFavoritesByAccount(account_id)
    let nav = await utilities.getNav()

    res.render("favorites/index", {
      title: "My Favorites",
      nav,
      favorites: data.rows,
    })
  } catch (error) {
    console.error(error)
    res.status(500).render("errors/error", {
      message: "Unable to load favorites",
    })
  }
}

favController.removeFavorite = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id)
    const account_id = res.locals.accountData.account_id   // ✅ CAMBIO AQUÍ

    await favoriteModel.removeFavorite(account_id, inv_id)

    req.flash("success", "Favorite removed.")
    res.redirect(`/inv/detail/${inv_id}`)   // ✅ volver al detalle
  } catch (error) {
    console.error(error)
    req.flash("error", "Could not remove favorite.")
    res.redirect("back")
  }
}

module.exports = favController

