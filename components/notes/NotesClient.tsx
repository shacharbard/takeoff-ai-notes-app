"use client";

import { createNoteAction, getNotesByUserIdAction } from "@/actions/notes-actions";
import { Button } from "@/components/ui/button";
import { SelectNote } from "@/db/schema";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import NoteContent from "./NoteContent";
import NotesSidebar from "./NotesSidebar";

type NotesClientProps = {
  initialNotes: SelectNote[];
};

export default function NotesClient({ initialNotes }: NotesClientProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [selectedNote, setSelectedNote] = useState<SelectNote | undefined>(notes[0]);
  const { userId } = useAuth();

  const handleNoteUpdate = async (updatedNote: SelectNote) => {
    setNotes(prevNotes => [...prevNotes.filter(note => note.id !== updatedNote.id), updatedNote]);
    setSelectedNote(undefined); // Clear the selected note after saving
    await refreshNotes();
  };

  const handleNoteSelect = (note: SelectNote) => {
    setSelectedNote(note);
  };

  const handleNotesChange = (newNotes: SelectNote[]) => {
    setNotes(newNotes);
    setSelectedNote(newNotes.length > 0 ? newNotes[0] : undefined);
  };

  const handleCreateNote = async () => {
    if (!userId) return;
    const result = await createNoteAction({ title: "New Note", content: "", userId });
    if (result.status === "success" && result.data) {
      await refreshNotes();
      setSelectedNote(result.data);
    }
  };

  const refreshNotes = async () => {
    if (!userId) return;
    const result = await getNotesByUserIdAction(userId);
    if (result.status === "success" && result.data) {
      setNotes(result.data);
    }
  };

  return (
    <div className="flex h-screen">
      <NotesSidebar 
        notes={notes} 
        selectedNoteId={selectedNote?.id}
        onNoteSelect={handleNoteSelect}
        onNotesChange={handleNotesChange}
        className="w-80 border-r border-gray-700 bg-gray-900"
      />
      <div className="flex-1 flex flex-col h-full bg-black text-white">
        <div className="p-4">
          <Button onClick={handleCreateNote} className="bg-[#1F2937] hover:bg-gray-800">
            Create New Note
          </Button>
        </div>
        <div className="flex-1 overflow-hidden">
          <NoteContent 
            selectedNote={selectedNote || { 
              id: '', 
              title: '', 
              content: '', 
              userId: userId || '', 
              createdAt: new Date(), 
              updatedAt: new Date() 
            }} 
            onNoteUpdate={handleNoteUpdate} 
          />
        </div>
      </div>
    </div>
  );
}