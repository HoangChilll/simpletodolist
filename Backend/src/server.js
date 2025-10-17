const express = require('express');
const path = require('path');
const app = express();
const cors = require("cors");
const configViewEngine = require('./config/viewEngine');
const webRoutes = require('./routes/web');
const pool = require('./config/postgres-connection'); 
require('dotenv').config();

const port =  3000;
//config req.body
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
configViewEngine(app);
app.use('/', webRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
