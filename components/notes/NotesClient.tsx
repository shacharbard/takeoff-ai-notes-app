"use client";

import { createNoteAction, getNotesByUserIdAction } from "@/actions/notes-actions";
import { Button } from "@/components/ui/button";
import { SelectNote } from "@/db/schema";
import { useResizable } from "@/hooks/useResizable";
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
  const { width: sidebarWidth, startResizing } = useResizable(150, 150, 300); // Adjusted initial and min width
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const handleNoteUpdate = async (updatedNote: SelectNote) => {
    setNotes(prevNotes => [...prevNotes.filter(note => note.id !== updatedNote.id), updatedNote]);
    setSelectedNote(undefined);
    await refreshNotes();
  };

  const handleNoteSelect = (note: SelectNote) => {
    setSelectedNote(note);
    setIsSidebarVisible(false); // Hide sidebar on mobile when a note is selected
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
      setIsSidebarVisible(false); // Hide sidebar on mobile when creating a new note
    }
  };

  const refreshNotes = async () => {
    if (!userId) return;
    const result = await getNotesByUserIdAction(userId);
    if (result.status === "success" && result.data) {
      setNotes(result.data);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="flex h-screen">
      <div className={`md:block ${isSidebarVisible ? 'block' : 'hidden'}`} style={{ width: `${sidebarWidth}px` }}>
        <NotesSidebar 
          notes={notes} 
          selectedNoteId={selectedNote?.id}
          onNoteSelect={handleNoteSelect}
          onNotesChange={handleNotesChange}
          width={sidebarWidth}
          onResizeStart={startResizing}
        />
      </div>
      <div className="flex-1 flex flex-col h-full bg-black text-white">
        <div className="p-4 flex justify-between items-center">
          <Button onClick={toggleSidebar} className="md:hidden bg-[#1F2937] hover:bg-gray-800">
            {isSidebarVisible ? 'Hide Notes' : 'Show Notes'}
          </Button>
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