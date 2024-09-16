"use server";

import { db } from "@/db/db";
import { createNote, deleteNote, getNoteById, getNotesByUserId } from "@/db/queries/notes-queries";
import { InsertNote, notesTable } from "@/db/schema/notes-schema";
import { ActionState } from "@/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createNoteAction(data: InsertNote): Promise<ActionState> {
  try {
    const newNote = await createNote(data);
    revalidatePath("/notes");
    return {
      status: "success",
      message: "Note created successfully",
      data: newNote,
    };
  } catch (error) {
    console.error("Error creating note:", error);
    return {
      status: "error",
      message: "Failed to create note",
    };
  }
}

export async function getNoteByIdAction(id: string): Promise<ActionState> {
  try {
    const note = await getNoteById(id);
    if (!note) {
      return { status: "error", message: "Note not found" };
    }
    return { status: "success", message: "Note retrieved successfully", data: note };
  } catch (error) {
    return { status: "error", message: "Failed to get note" };
  }
}

export async function getNotesByUserIdAction(userId: string): Promise<ActionState> {
  try {
    const notes = await getNotesByUserId(userId);
    return { status: "success", message: "Notes retrieved successfully", data: notes };
  } catch (error) {
    return { status: "error", message: "Failed to get notes" };
  }
}

export async function updateNoteAction(id: string, note: Partial<InsertNote>): Promise<ActionState> {
  try {
    const updatedNote = await db
      .update(notesTable)
      .set({ ...note, updatedAt: new Date() })
      .where(eq(notesTable.id, id))
      .returning()
      .execute();
    revalidatePath("/notes");
    return { status: "success", message: "Note updated successfully", data: updatedNote[0] };
  } catch (error) {
    console.error("Failed to update note:", error);
    return { status: "error", message: "Failed to update note" };
  }
}

export async function deleteNoteAction(id: string): Promise<ActionState> {
  try {
    await deleteNote(id);
    revalidatePath("/notes");
    return { status: "success", message: "Note deleted successfully" };
  } catch (error) {
    return { status: "error", message: "Failed to delete note" };
  }
}