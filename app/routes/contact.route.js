const express = require("express");
const contacts = require("../controllers/contact.controller");
const verifyToken = require("../controllers/auth.controller");

const router = express.Router();
router.use(verifyToken.verifyToken);
router
  .route("/")
  .get(contacts.findAll)
  .post(contacts.create)
  .delete(contacts.deleteAll);

router.route("/favorite").get(contacts.findAllFavorite);

router
  .route("/:id")
  .get(contacts.findOne)
  .put(contacts.update)
  .delete(contacts.delete);

module.exports = router;
