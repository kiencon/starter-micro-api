const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {
  commentDB,
} = require('./db');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const port = 3001;

const staticFile = express.static(path.resolve(__dirname, './public'));
app.use(staticFile);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, apiKey"
  );

  if ("OPTIONS" == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.post('/comment', async (req, res) => {
  try {
    await commentDB.insert(req.body);
    return res.status(201).json({});
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'internal server error'
    });
  }
});

app.get('/comment/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    console.log(slug);
    const comments = await commentDB.view('comments', 'slug', {
      limit: 30,
      include_docs: true,
      startkey: slug,
      endkey: slug + '\\uffff',
    }).then(({ rows }) => {
      return rows.map(e => e.doc);
    });
    return res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'internal server error'
    });
  }
});
