const express = require("express")
const app = express()

// Serve static files from public folder
app.use(express.static("public"))

const port = 3000

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`)
})




