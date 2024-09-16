"use client";

import { deleteNoteAction } from "@/actions/notes-actions";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SelectNote } from "@/db/schema/notes-schema";
import { Pencil, Trash } from "lucide-react";

type NotesSidebarProps = {
  notes: SelectNote[];
  selectedNoteId?: string;
  onNoteSelect: (note: SelectNote) => void;
  onNotesChange: (notes: SelectNote[]) => void;
  className?: string;
};

export default function NotesSidebar({ notes, selectedNoteId, onNoteSelect, onNotesChange, className }: NotesSidebarProps) {
  const handleDeleteNote = async (id: string) => {
    const result = await deleteNoteAction(id);
    if (result.status === "success") {
      onNotesChange(notes.filter(note => note.id !== id));
    }
  };

  return (
    <div className={`bg-gray-900 p-4 flex flex-col h-full ${className}`}>
      <h2 className="text-xl font-bold mb-4 text-white">Your Notes</h2>
      <ScrollArea className="flex-1">
        <ul className="space-y-2">
          {notes.map(note => (
            <li key={note.id} 
                className={`flex flex-col p-2 rounded cursor-pointer hover:bg-gray-800 ${
                  note.id === selectedNoteId ? 'bg-gray-800' : ''
                }`}
            >
              <div className="flex items-start justify-between w-full">
                <span 
                  className="text-gray-300 break-words w-full mr-2"
                  onClick={() => onNoteSelect(note)}
                >
                  {note.title}
                </span>
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onNoteSelect(note);
                    }} 
                    className="h-8 w-8 text-gray-500 hover:text-blue-500"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(note.id);
                    }} 
                    className="h-8 w-8 text-gray-500 hover:text-red-500"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}