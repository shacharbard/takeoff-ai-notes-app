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
  width: number;
  onResizeStart: () => void;
};

export default function NotesSidebar({ 
  notes, 
  selectedNoteId, 
  onNoteSelect, 
  onNotesChange, 
  width,
  onResizeStart
}: NotesSidebarProps) {
  const handleDeleteNote = async (id: string) => {
    const result = await deleteNoteAction(id);
    if (result.status === "success") {
      onNotesChange(notes.filter(note => note.id !== id));
    }
  };

  const truncateContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  // Sort notes by creation date, most recent first
  const sortedNotes = [...notes].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div 
      className="bg-gray-900 p-2 flex flex-col h-full relative" 
      style={{ width: `${width}px` }}
    >
      <h2 className="text-lg font-bold mb-2 text-white">Your Notes</h2>
      <ScrollArea className="flex-1">
        <ul className="space-y-2">
          {sortedNotes.map(note => (
            <li key={note.id} 
                className={`bg-gray-800 rounded-lg p-1 cursor-pointer hover:bg-gray-700 transition-colors w-[120px] h-[120px] flex flex-col ${
                  note.id === selectedNoteId ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => onNoteSelect(note)}
            >
              <h3 className="text-xs font-semibold text-white mb-1 truncate">{note.title}</h3>
              <p className="text-gray-400 text-xs flex-grow overflow-hidden">
                {truncateContent(note.content, 25)}
              </p>
              <div className="flex justify-end mt-auto space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onNoteSelect(note);
                  }} 
                  className="h-6 w-6 p-0 text-gray-400 hover:text-blue-500"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNote(note.id);
                  }} 
                  className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
      <div 
        className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-gray-700 hover:bg-gray-600"
        onMouseDown={onResizeStart}
      />
    </div>
  );
}