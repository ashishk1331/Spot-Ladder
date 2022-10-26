const express = require('express');

const app = express();
const PORT = process.env.port || 8080;

app.use(express.static('src'))

app.listen(PORT, () =>{
	console.log(`Running on port https://localhost:${PORT}`)
})