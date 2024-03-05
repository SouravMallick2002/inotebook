const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// ROUTE 1: Get all the notes using -> GET "/api/notes/fetchnotes". Requires authentication
router.get("/fetchnotes", fetchuser, async (req, res) => {
  try {
    // Fetch all notes belonging to the authenticated user
    const notes = await Notes.find({ user: req.user.id });

    // Return the notes as a JSON response
    res.json(notes);
  } catch (error) {
    // Handle any errors that occur during the request
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// ROUTE 2: Add notes using -> GET "/api/notes/addnotes". Requires authentication

router.post(
  "/addnotes",
  fetchuser,
  [
    // Validate the request body to ensure the title and description are valid
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body(
      "description",
      "Enter a valid description with at least five characters"
    ).isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // Return bad request and error message for errors in validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Create a new note with the provided title, description, tag, and user ID
      const notes = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      // Save the new note to the database
      const saveNotes = await notes.save();

      // Return the newly created note as a JSON response
      res.json(saveNotes);
    } catch (error) {
      // Handle any errors that occur during the request
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// ROUTE 3: Update existing notes using -> PUT "/api/notes/updatenote". Requires authentication
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;

  try {
    // Create a new note object with the updated title, description, and tag
    const newNotes = {};
    if (title) {
      newNotes.title = title;
    }
    if (description) {
      newNotes.description = description;
    }
    if (tag) {
      newNotes.tag = tag;
    }

    // Find the note to be updated by its ID
    let notes = await Notes.findById(req.params.id);
    if (!notes) {
      // If the note is not found, return a 404 error
      return res.status(404).send("Not Found");
    }
    // Check if the authenticated user owns the note
    if (notes.user.toString() !== req.user.id) {
      // If the user does not own the note, return a 404 error
      return res.status(404).send("Not Found");
    }

    // Update the note with the new information and return the updated note
    notes = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNotes },
      { new: true }
    );
    res.json({ notes });
  } catch (error) {
    // Handle any errors that occur during the request
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// ROUTE 4: Delete existing notes using -> DELETE "/api/notes/deletenote". Requires authentication
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    // Find the note to be deleted by its ID
    let notes = await Notes.findById(req.params.id);
    if (!notes) {
      // If the note is not found, return a 404 error
      return res.status(404).send("Not Found");
    }
    // Check if the authenticated user owns the note
    if (notes.user.toString() !== req.user.id) {
      // If the user does not own the note, return a 404 error
      return res.status(404).send("Not Found");
    }

    // Delete the note
    notes = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note Deleted successfully", notes: notes });
  } catch (error) {
    // Handle any errors that occur during the request
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
