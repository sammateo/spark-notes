"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdEdit, MdOutlineOpenInFull } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { toast } from "react-toastify";

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
        .select(`*, note_users(email)`)
        .eq("deleted", false);
      if (error) {
        console.log("Error");
        console.log(error);
        toast.error("Error fetching notes.");
        setLoading(false);

        return;
      }
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
        notes.map((note) => (
          <div key={note.id} className="my-2 border border-foreground p-2">
            <div className="flex justify-between items-center px-1">
              <p className=" text-xl">{note.title}</p>
              <div className="flex gap-2">
                {user && user.id == note.author_id ? (
                  <Link href={`/notes/${note.id}`}>
                    <MdEdit className=" text-xl my-2" />
                  </Link>
                ) : (
                  <div>
                    <Link href={`/notes/${note.id}`}>
                      <MdOutlineOpenInFull className=" text-xl my-2" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <div className="text-foreground bg-background outline-none border-x border-y border-foreground p-2 overflow-hidden resize-none w-full h-20">
              <pre>{note.note}</pre>
            </div>
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
        ))
      ) : (
        <div className="w-full flex justify-center items-center  ">
          <p className="px-4 py-2 rounded">No notes</p>
        </div>
      )}
    </div>
  );
}
