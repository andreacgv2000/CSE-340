// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index") 
const invValidate = require('../utilities/inv-validation')

console.log("handleErrors:", utilities.handleErrors)
console.log("buildByInvId:", invController.buildByInvId)




// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// DETAIL (solo esta parte)
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInvId)
)



// Management view
router.get('/', async (req, res, next) => {
  try {
    let nav = await utilities.getNav()
    res.render('inventory/management', {
      title: 'Inventory Management',
      nav
    })
  } catch (error) {
    next(error)
  }
})




// Add new classification
router.get('/add-classification', invController.buildAddClassification)
router.post(
  '/add-classification',
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)


// Add Inventory
router.get('/add-inventory', invController.buildAddInventory)
router.post('/add-inventory', invController.addInventory)

module.exports = router;
