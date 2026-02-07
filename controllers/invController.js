const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


invCont.buildByInvId = async function (req, res, next) {
  try {
    const inv_id = req.params.invId
    const vehicle = await invModel.getInventoryByInvId(inv_id)

    if (!vehicle) {
      return res.status(404).send("Vehículo no encontrado")
    }

    const nav = await utilities.getNav()
    const detailHTML = utilities.buildVehicleDetail(vehicle)

    res.render("./inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      detailHTML,
    })

  } catch (error) {
    next(error)
  }
}


invCont.triggerError = async function (req, res, next) {
  throw new Error("Intentional server error")
}


/* ***************************
 *  Build Add Classification view
 * ***************************/
async function buildAddClassification(req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render('inventory/add-classification', {
      title: 'Add Classification',
      nav,
      errors: null
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Process new classification
 * ***************************/
async function addClassification(req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash('notice', `Classification '${classification_name}' added successfully.`)
    res.render('inventory/management', { title: 'Inventory Management', nav })
  } else {
    req.flash('notice', `Failed to add classification '${classification_name}'.`)
    res.render('inventory/add-classification', { title: 'Add Classification', nav })
  }
}



// Entregar add-inventory view
async function buildAddInventory(req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()
    res.render('inventory/add-inventory', {
      title: 'Add Vehicle',
      nav,
      classificationList,
      errors: null,
      inv_make: '',
      inv_model: '',
      inv_year: '',
      inv_description: '',
      inv_price: '',
      inv_miles: '',
      inv_color: '',
      inv_image: '',
      inv_thumbnail: ''
    })
  } catch (error) {
    next(error)
  }
}

// Procesar nuevo inventario
async function addInventory(req, res) {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  
  const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id, inv_image, inv_thumbnail } = req.body

  const result = await invModel.addInventory({
    inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id, inv_image, inv_thumbnail
  })

  if (result) {
    req.flash('notice', `Vehicle '${inv_make} ${inv_model}' added successfully.`)
    res.render('inventory/management', { title: 'Inventory Management', nav })
  } else {
    req.flash('notice', `Failed to add vehicle '${inv_make} ${inv_model}'.`)
    res.render('inventory/add-inventory', {
      title: 'Add Vehicle',
      nav,
      classificationList,
      errors: ['Error adding vehicle. Please check inputs.'],
      inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id, inv_image, inv_thumbnail
    })
  }
}




/* ***************************
 *  Export everything en un solo objeto
 * ***************************/
module.exports = { 
  ...invCont,
  buildAddClassification,
  addClassification,
  buildAddInventory,   // <-- agregar
  addInventory         // <-- agregar
}

