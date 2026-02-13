const express = require("express")
const path = require("path")
const app = express()
const staticRoutes = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")

const baseController = require("./controllers/baseController")

const session = require("express-session")
const pool = require('./database/')
const accountRoute = require("./routes/accountRoute"); 


const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
// Middleware para leer datos de formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




/* ***********************
 * Middleware
 * ************************/
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})


app.use(cookieParser())

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



app.use("/account", accountRoute);

// 🔹 Server
const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`)
})
