const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001

app.use(express.static('build'));

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build/index.html'), function(err) {
      if (err) {
        res.status(500).send(err)
      }
    })
  })

app.listen(PORT, console.log("Listening on port" + PORT));
// //"start": "react-scripts start",