const pool = require("../database/")


/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}
 


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}



/* ***************************
 *  Get inventory item by inventory id (DETAIL)
 * ************************** */
async function getInventoryByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * 
       FROM public.inventory 
       WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryByInvId error " + error)
  }
}




/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = 'INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *'
    const values = [classification_name]
    const result = await pool.query(sql, values)
    // retorna true si se insertó correctamente
    return result.rowCount > 0
  } catch (error) {
    console.error("addClassification error: ", error)
    return false
  }
}



async function addInventory(vehicleData) {
  try {
    const sql = `INSERT INTO public.inventory 
      (inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id, inv_image, inv_thumbnail)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`
    const values = [
      vehicleData.inv_make,
      vehicleData.inv_model,
      vehicleData.inv_year,
      vehicleData.inv_description,
      vehicleData.inv_price,
      vehicleData.inv_miles,
      vehicleData.inv_color,
      vehicleData.classification_id,
      vehicleData.inv_image,
      vehicleData.inv_thumbnail
    ]
    const result = await pool.query(sql, values)
    return result.rowCount > 0
  } catch (error) {
    console.error('addInventory error: ', error)
    return false
  }
}


module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryByInvId,
  addClassification,
  addInventory
}
