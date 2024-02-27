const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const pointsRouter = require('./routes/points');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors()); 

app.use('/api/points', pointsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});