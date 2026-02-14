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


// Management view (Inventory Management)
router.get('/', utilities.handleErrors(invController.buildManagementView))

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to display the Edit Inventory View
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
);


// Route to handle inventory update
router.post("/update/", 
  invValidate.newInventoryRules(),  // tus reglas de validación
  invValidate.checkUpdateData,      // middleware de validación para editar
  invController.updateInventory
)


module.exports = router;
