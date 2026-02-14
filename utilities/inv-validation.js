const { body, validationResult } = require('express-validator')
const validate = {}

validate.classificationRules = () => {
  return [
    body('classification_name')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Classification name is required.')
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage('No spaces or special characters allowed.')
  ]
}

validate.checkClassificationData = async (req, res, next) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await require('./index').getNav()
    res.render('inventory/add-classification', {
      errors,
      title: 'Add Classification',
      nav,
      classification_name: req.body.classification_name
    })
    return
  }
  next()
}



/* ******************************
 *  Validation rules for inventory
 * **************************** */
validate.newInventoryRules = () => {
  return [
    body('inv_make').trim().notEmpty().withMessage('Make is required.'),
    body('inv_model').trim().notEmpty().withMessage('Model is required.'),
    body('inv_year').isInt({ min: 1900 }).withMessage('Year must be valid.'),
    body('inv_price').isFloat({ min: 0 }).withMessage('Price must be positive.'),
    body('inv_miles').isInt({ min: 0 }).withMessage('Miles must be positive.'),
    body('inv_color').trim().notEmpty().withMessage('Color is required.'),
    body('classification_id').isInt({ min: 1 }).withMessage('Classification is required.')
  ]
}

/* ******************************
 *  Middleware to check inventory data (Add)
 * **************************** */
validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await require('./index').getNav()
    const classificationList = await require('./index').buildClassificationList(req.body.classification_id)
    res.render('inventory/add-inventory', {
      title: 'Add Vehicle',
      nav,
      classificationList,
      errors: errors.array().map(err => err.msg),
      ...req.body
    })
    return
  }
  next()
}

/* ******************************
 *  Middleware to check inventory data (Update)
 * **************************** */
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await require('./index').getNav()
    const classificationList = await require('./index').buildClassificationList(req.body.classification_id)
    res.render('inventory/edit-inventory', {
      title: `Edit ${req.body.inv_make} ${req.body.inv_model}`,
      nav,
      classificationSelect: classificationList,
      errors: errors.array().map(err => err.msg),
      ...req.body
    })
    return
  }
  next()
}




module.exports = validate
