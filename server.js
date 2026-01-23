const express = require("express")
const path = require("path")
const app = express()
const staticRoutes = require("./routes/static")

// 🔹 View engine
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// 🔹 Static files (CSS, images, JS)
app.use(express.static(path.join(__dirname, "public")))

// 🔹 Routes
app.use(staticRoutes)

// 🔹 Home route
app.get("/", (req, res) => {
  res.render("index")
})

// 🔹 Server
const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`)
})
