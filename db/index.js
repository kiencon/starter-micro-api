const Nano = require('nano');
const nano = Nano(`https://${process.env.NANO_DB}`);
const commentDB = nano.db.use("comments");


module.exports = {
  commentDB,
};
