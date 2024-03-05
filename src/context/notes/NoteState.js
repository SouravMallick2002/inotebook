import React, { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";

  const notesInitial = [];

  const [notes, setNotes] = useState(notesInitial);

  // Get all notes
  const getNotes = async () => {
    // API call REQUIRED
    const response = await fetch(`${host}/api/notes/fetchnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem("token")
      },
    });
    const json = await response.json();
    setNotes(json);
  };

  // Add note
  const addNote = async (title, description, tag) => {
    try {
      // API call REQUIRED
      const response = await fetch(`${host}/api/notes/addnotes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token":
            localStorage.getItem("token")
        },
        body: JSON.stringify({ title, description, tag }),
      });

      if (!response.ok) {
        throw new Error("Failed to add note");
      }

      const data = await response.json();

      const note = {
        _id: data._id,
        user: data.user,
        title: title,
        description: description,
        tag: tag,
        date: data.date,
        __v: data.__v,
      };

      setNotes((prevNotes) => [...prevNotes, note]);
    } catch (error) {
      console.error("Error adding note:", error);
      // Handle error, e.g., show a notification to the user
    }
  };

  // Delete note

  const deleteNote = async (id) => {
    // API call REQUIRED

    // API call REQUIRED
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem("token")
      },
    });
    const json = await response.json();
    console.log(json);
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };

  // Update note
  const editNote = async (id, title, description, tag) => {
    // API call REQUIRED
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem("token")
      },
      body: JSON.stringify({ title, description, tag }),
    });
    await response.json();

    let newNotes = JSON.parse(JSON.stringify(notes));
    // Logic to edit in client
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
    
  };

  // Providing the state and update function to the context
  return (
    <NoteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, getNotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
