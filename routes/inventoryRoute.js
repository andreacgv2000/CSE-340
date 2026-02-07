// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index") 


console.log("handleErrors:", utilities.handleErrors)
console.log("buildByInvId:", invController.buildByInvId)




// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// DETAIL (solo esta parte)
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInvId)
)


module.exports = router;
