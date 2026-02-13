'use strict'

// Obtener el select de clasificaciones
const classificationList = document.querySelector("#classificationList")

// Escuchar cuando cambie la clasificación
classificationList.addEventListener("change", async function () {

  const classification_id = classificationList.value
  console.log(`classification_id is: ${classification_id}`)

  const url = `/inv/getInventory/${classification_id}`

  try {
    const response = await fetch(url)

    if (response.ok) {
      const inventoryData = await response.json()
      console.log(inventoryData)
      buildInventoryList(inventoryData)
    } else {
      throw Error("Network response was not OK")
    }

  } catch (error) {
    console.error("There was a problem: ", error.message)
  }
})


// Construir la tabla HTML con los datos del inventario
function buildInventoryList(data) {

  let inventoryDisplay = document.getElementById("inventoryDisplay")

  // Crear encabezados de tabla
  let dataTable = '<thead>'
  dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'
  dataTable += '</thead>'

  // Crear cuerpo de la tabla
  dataTable += '<tbody>'

  // Iterar sobre cada vehículo y crear fila
  data.forEach(function (element) {
    console.log(element.inv_id + ", " + element.inv_model)
    dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`
    dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`
    dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`
  })

  dataTable += '</tbody>'

  // Inyectar la tabla en el DOM
  inventoryDisplay.innerHTML = dataTable
}
