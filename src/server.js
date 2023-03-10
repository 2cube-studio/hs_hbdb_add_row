import express from 'express';
import dotenv from 'dotenv';

import tableRouter from './routes/table.routes.js'
import rowRouter from './routes/row.routes.js';

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended: true}));



const PORT = process.env.PORT || process.env.APP_PORT || 1000;

app.use(`/api/table`, tableRouter);
app.use(`/api/row`, rowRouter);

// http://localhost:1000/api/row/create  //using this url get data from zvoove api and insert into hs-db


var server = app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}!`));
server.timeout = 100000;

export default app;
