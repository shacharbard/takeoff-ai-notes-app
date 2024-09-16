"use client";

import { createNoteAction, updateNoteAction } from "@/actions/notes-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast"; // Updated import
import { SelectNote } from "@/db/schema/notes-schema";
import { useEffect, useState } from "react";

type NoteContentProps = {
  selectedNote: SelectNote;
  onNoteUpdate: (updatedNote: SelectNote) => void;
};

export default function NoteContent({ selectedNote, onNoteUpdate }: NoteContentProps) {
  const [note, setNote] = useState(selectedNote);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast(); // Use the hook

  useEffect(() => {
    setNote(selectedNote);
  }, [selectedNote]);

  const handleSaveNote = async () => {
    setIsSaving(true);
    try {
      let result;
      if (note.id) {
        // Existing note
        result = await updateNoteAction(note.id, { title: note.title, content: note.content });
      } else {
        // New note
        result = await createNoteAction({ title: note.title, content: note.content, userId: note.userId });
      }

      if (result.status === "success" && result.data) {
        onNoteUpdate(result.data);
        toast({
          title: "Note saved",
          description: "Your note has been successfully saved.",
        });
        // Clear the note title and content
        setNote(prevNote => ({
          ...prevNote,
          title: '',
          content: ''
        }));
      } else {
        throw new Error(result.message || "Failed to save note");
      }
    } catch (error) {
      console.error("Error saving note:", error);
      toast({
        title: "Error",
        description: "Failed to save note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-[500px] mx-auto flex-grow flex flex-col">
        <Input
          type="text"
          value={note.title}
          onChange={e => setNote({ ...note, title: e.target.value })}
          className="mb-4 text-xl font-bold bg-gray-800 border-gray-700 text-white"
          placeholder="Note title"
        />
        <Textarea
          value={note.content}
          onChange={e => setNote({ ...note, content: e.target.value })}
          className="h-[500px] w-full resize-none bg-gray-800 border-gray-700 text-white overflow-auto mb-4"
          placeholder="Note content"
        />
        <Button 
          onClick={handleSaveNote} 
          disabled={isSaving} 
          className="bg-[#1F2937] hover:bg-gray-800 px-8 py-2 self-center"
        >
          {isSaving ? "Saving..." : "Save Note"}
        </Button>
      </div>
    </div>
  );
}