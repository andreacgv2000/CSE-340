const express = require("express")
const path = require("path")
const app = express()
const staticRoutes = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")

const baseController = require("./controllers/baseController")

// 🔹 View engine
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// 🔹 Static files (CSS, images, JS)
app.use(express.static(path.join(__dirname, "public")))

// 🔹 Routes
app.use(staticRoutes)

// Inventory routes 
app.use("/inv", inventoryRoute)

// 🔹 Home route
app.get("/", baseController.buildHome)

// 🔹 Server
const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`)
})
