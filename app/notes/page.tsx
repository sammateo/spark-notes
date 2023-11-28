"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdEdit, MdOutlineOpenInFull } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { toast } from "react-toastify";
import Notecard from "@/components/notes/card/Notecard";

export default function Page() {
  const [notes, setNotes] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();
  const [user, setUser] = useState<any | null>(null);

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  };
  useEffect(() => {
    const getData = async () => {
      const { data, error } = await supabase
        .from("notes")
        .select(`*, note_users(email), comments(comment)`)
        .eq("deleted", false);
      if (error) {
        console.log("Error");
        console.log(error);
        toast.error("Error fetching notes.");
        setLoading(false);

        return;
      }
      console.log(data);
      setNotes(data);
      setLoading(false);
    };
    getUser();

    getData();
  }, []);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading notes...
      </div>
    );
  }
  return (
    <div className="w-[90vw] max-w-[600px] mx-auto flex flex-col justify-center">
      <div className="mb-10 mt-3 border-b border-foreground flex justify-between items-center">
        <h2 className="text-2xl">Notes</h2>

        <Link href={"/newnote"}>
          <IoMdAdd className="text-3xl" />
        </Link>
      </div>
      {notes ? (
        <div className="flex flex-col-reverse">
          {notes.map((note) => (
            <Notecard key={note.id} note={note} user={user} />
          ))}
        </div>
      ) : (
        <div className="w-full flex justify-center items-center  ">
          <p className="px-4 py-2 rounded">No notes</p>
        </div>
      )}
    </div>
  );
}
