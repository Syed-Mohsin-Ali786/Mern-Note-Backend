import verifyToken from "../middleware/verifyToken.js";
import Note from "../models/Notes.js";

import express from "express";
const notesRoutes = express.Router();

notesRoutes.post("/", verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;

     // Input validation
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }
    const newNote = new Note({ title, content, userId: req.user.id });
    await newNote.save();
    res.status(200).json(newNote);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// Get all notes
notesRoutes.get("/", verifyToken, async (req, res) => {
  console.log(verifyToken);
  
  try {
    const notes = await Note.find({ userId: req.user.id });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// Get Note through Id
notesRoutes.get("/:id", verifyToken, async (req, res) => {
  try {
    const note = await Note.findById({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a note
notesRoutes.put("/:id", verifyToken, async (req, res) => {
  try {
    const updated = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Note not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete all notes for authenticated user
notesRoutes.delete("/", verifyToken, async (req, res) => {
  try {
    await Note.deleteMany({ userId: req.user.id });
    res.status(200).json({ message: "All your notes have been deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dynamic Delete
notesRoutes.delete("/:id",verifyToken, async (req, res) => {
  try {
    const deleted=await Note.findOneAndDelete({_id:req.params.id,userId:req.user.id});
    if(!deleted) return res.status(404).json({error:"Note not found"})
    
    res.status(200).json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default notesRoutes;
