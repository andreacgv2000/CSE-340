'use strict'

// Seleccionamos el formulario de edición
const form = document.querySelector("#updateForm")

// Seleccionamos el botón de submit
const updateBtn = form.querySelector("button[type='submit']")

// Inicialmente, el botón está deshabilitado
updateBtn.setAttribute("disabled", true)

// Escuchamos cualquier cambio en el formulario
form.addEventListener("change", function () {
    // Cuando se detecta un cambio, habilitamos el botón
    updateBtn.removeAttribute("disabled")
})
