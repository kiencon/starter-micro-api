const Nano = require('nano');
const nano = Nano("https://");
const commentDB = nano.db.use("comments");


module.exports = {
  commentDB,
};
