const invModel = require("../models/inventory-model")
const { get } = require("../routes/static")
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

// Build Inventory Management view
async function buildManagementView(req, res, next) {
  try {
    let nav = await utilities.getNav()


    // espacio solicitado en la instrucción
    const classificationSelect = await utilities.buildClassificationList()

    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
      errors: null
    })
  } catch (error) {
    next(error)
  }
}


invCont.getInventoryJSON = async function(req, res, next) {
  try {
    const classification_id = req.params.classification_id
    const data = await invModel.getInventoryByClassificationId(classification_id)
    res.json(data)
  } catch (error) {
    next(error)
  }
}



/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
    // Obtener el ID del inventario desde la URL y convertirlo a entero
    const inv_id = parseInt(req.params.inv_id);

    // Construir la navegación del sitio
    let nav = await utilities.getNav();

    // Obtener los datos completos del inventario desde el modelo
    const itemData = await invModel.getInventoryById(inv_id);

    // Construir la lista de clasificaciones con la selección actual
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id);

    // Crear variable con el nombre del vehículo para el título
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

    // Renderizar la vista "edit-inventory.ejs" y pasar todos los datos necesarios
    res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null, // para errores de validación, si los hubiera
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id
    });
};







/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body

    const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    )

    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model
      req.flash("notice", `The ${itemName} was successfully updated.`)
      res.redirect("/inv/")
    } else {
      const classificationSelect = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the update failed.")
      res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
      })
    }
  } catch (error) {
    next(error)
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
  addInventory,         // <-- agregar
  buildManagementView,
  inventoryJSON: invCont.getInventoryJSON ,
  getInventoryJSON: invCont.getInventoryJSON,
  editInventoryView: invCont.editInventoryView,
  updateInventory: invCont.updateInventory
}

