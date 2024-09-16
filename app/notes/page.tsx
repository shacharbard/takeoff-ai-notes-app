import { getNotesByUserIdAction } from "@/actions/notes-actions";
import NotesClient from "@/components/notes/NotesClient";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function NotesPage() {
	const { userId } = auth();
	if (!userId) return redirect("/login");

	const notesResult = await getNotesByUserIdAction(userId);
	if (notesResult.status === "error") {
		return <div>Error loading notes</div>;
	}

	return <NotesClient initialNotes={notesResult.data} />;
}
