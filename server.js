const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001

app.use(express.static('build'))
app.listen(PORT, console.log("Listening on port" + PORT));

// //"start": "react-scripts start",