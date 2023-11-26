"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
function page() {
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const supabase = createClient();
  const [user, setUser] = useState<any | null>(null);

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
    if (!user) {
      router.back();
    }
  };
  const insertNote = async () => {
    let { data, error } = await supabase.rpc("insert_note", {
      note: noteRef.current?.value,
      title: titleRef.current?.value,
    });
    if (error) {
      console.log("Error");
      console.log(error);
      toast.error("Error saving note.");
      return;
    }
    toast.success("New Note Created!");
    router.push("/notes");
  };

  useEffect(() => {
    getUser();
  }, []);
  return (
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
          ref={titleRef}
          placeholder="Title"
          className="text-foreground bg-background outline-none border-b border-foreground px-1 py-2 w-full"
        ></input>
      </div>

      <textarea
        ref={noteRef}
        placeholder="Note"
        className="text-foreground bg-background outline-none border-x border-y border-foreground p-2 resize-none w-full h-[60vh]"
      ></textarea>
      <div className="flex gap-2">
        <button
          onClick={() => {
            insertNote();
          }}
          className="bg-btn-background text-success px-5 py-1 text-xl rounded"
        >
          Save
        </button>
        <button
          onClick={() => {
            router.back();
          }}
          className="bg-btn-background text-danger px-5 py-1 text-xl rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default page;
