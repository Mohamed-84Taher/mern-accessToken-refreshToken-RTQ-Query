const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const verifyJWT = require("../middleware/verifyJWt");

router.use(verifyJWT);

router
  .route("/")
  .get(noteController.getAllNotes)
  .post(noteController.createNewNote)
  .patch(noteController.updateNote)
  .delete(noteController.deleteNote);

module.exports = router;
