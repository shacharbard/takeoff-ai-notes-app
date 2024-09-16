"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { SelectNote } from "@/db/schema/notes-schema";

type ChatSidebarProps = {
  selectedNote?: SelectNote;
};

export default function ChatSidebar({ selectedNote, className }: ChatSidebarProps & { className?: string }) {
  return (
    <div className={`bg-gray-100 p-4 flex flex-col h-full ${className}`}>
      <h2 className="text-lg font-bold mb-4">Chat with AI</h2>
      <ScrollArea className="flex-1">
        {selectedNote ? (
          <div>
            <p className="text-sm text-gray-600 mb-2">Chatting about: {selectedNote.title}</p>
            {/* Add chat functionality here */}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Select a note to start chatting</p>
        )}
      </ScrollArea>
    </div>
  );
}