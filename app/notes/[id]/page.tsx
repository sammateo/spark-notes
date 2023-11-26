"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
function NoteDetails({ params }: any) {
  const id = params?.id;
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const commentRef = useRef<HTMLInputElement>(null);
  const [note, setNote] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any | null>(null);
  const [comments, setComments] = useState<any[] | null>(null);

  const supabase = createClient();
  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  };

  const getComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select(`*, note_users(email)`)
      .eq("deleted", false)
      .eq("note_id", id);
    setComments(data);
    setLoading(false);
  };
  const getNote = async () => {
    const { data } = await supabase
      .from("notes")
      .select(`*, note_users(email)`)
      .eq("id", id)
      .eq("deleted", false)
      .limit(1)
      .single();
    setNote(data);
    setLoading(false);
  };
  const saveNote = async () => {
    let { data, error } = await supabase.rpc("update_note", {
      p_id: id,
      p_note: noteRef.current?.value,
      p_title: titleRef.current?.value,
    });

    if (error) {
      console.log("Error");
      console.log(error);
      toast.error("Error saving note.");
      return;
    }
    toast.success("Saved!");
  };
  const deleteNote = async () => {
    const { data, error } = await supabase
      .from("notes")
      .update({ deleted: true })
      .eq("id", id)
      .select();
    if (error) {
      console.log("Error");
      console.log(error);
      toast.error("Error deleting note.");
      return;
    }
    setNote(data);
    toast.success("Note Deleted!");
    router.push("/notes");
  };

  const insertComment = async () => {
    const { data, error } = await supabase
      .from("comments")
      .insert({ comment: commentRef.current?.value, note_id: id })
      .select();

    if (error) {
      console.log("Error");
      console.log(error);
      toast.error("Error saving note.");
      return;
    }
    getComments();
    toast.success("Comment saved");
  };
  useEffect(() => {
    getUser();
    getNote();
    getComments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading note...
      </div>
    );
  }
  return (
    <div>
      {note && user ? (
        <div className="w-[90vw] mx-auto">
          <Link
            className="bg-btn-background py-2 px-5 rounded my-3 block w-fit"
            href={"/notes"}
          >
            {" "}
            {"<- "}Back to Notes
          </Link>
          <div className="mb-5 mt-2">
            <input
              defaultValue={note.title}
              ref={titleRef}
              placeholder="Title"
              className="text-foreground bg-background outline-none border-b border-foreground px-1 py-2 w-full text-xl"
            ></input>
            <p className=" text-xs">{note.note_users.email}</p>
            <p className=" text-xs">
              {new Intl.DateTimeFormat("en-US", {
                dateStyle: "short",
                timeStyle: "short",
              })
                .format(new Date(note.created_at))
                .toString()}
            </p>
          </div>

          <textarea
            defaultValue={note.note}
            ref={noteRef}
            placeholder="Note"
            className="text-foreground bg-background outline-none border-x border-y border-foreground p-2 resize-none w-full h-[40vh]"
          ></textarea>

          {/* allow editing an deleting for author */}
          {user.id == note.author_id && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  saveNote();
                }}
                className="bg-btn-background text-success px-5 py-1 text-xl rounded"
              >
                Save
              </button>
              <button
                onClick={() => {
                  deleteNote();
                }}
                className="bg-btn-background text-danger px-5 py-1 text-xl rounded"
              >
                Delete
              </button>
            </div>
          )}

          <div className=" flex justify-start items-center gap-5 flex-wrap w-full">
            <input
              ref={commentRef}
              placeholder="Write your comment here"
              className="text-foreground bg-background border-b-2 border-green-500 outline-none py-1 px-1 w-[70vw]"
            ></input>
            <button
              className=" bg-btn-background px-5 py-2"
              onClick={() => {
                insertComment();
              }}
            >
              Post
            </button>
          </div>
          <div>
            <p>Comments: </p>
            <div className="flex flex-col-reverse gap-2 my-2">
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex justify-between items-center gap-3 flex-wrap border px-3 py-1 rounded-md"
                  >
                    <p>{comment.comment}</p>
                    <div>
                      <p className="text-xs">
                        {comment.note_users && comment.note_users.email}
                      </p>
                      <p className=" text-xs">
                        {new Intl.DateTimeFormat("en-US", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })
                          .format(new Date(comment.created_at))
                          .toString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="">
                  <p className="text-center">No comments</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5 w-full h-screen justify-center items-center">
          <p>Note not found</p>
          <Link href="/notes"> {"<-"} Back to Notes</Link>
        </div>
      )}
    </div>
  );
}

export default NoteDetails;
