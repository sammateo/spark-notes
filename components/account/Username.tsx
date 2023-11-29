"use client";
import { createClient } from "@/utils/supabase/client";
import { revalidatePath } from "next/cache";
import React, { useRef } from "react";
import { toast } from "react-toastify";

function Username({ accountInfo }: any) {
  const supabase = createClient();
  const usernameRef = useRef<HTMLInputElement>(null);
  const updateUsername = async (e: any) => {
    e.preventDefault();
    if (
      accountInfo.username &&
      accountInfo.username.trim() === usernameRef.current?.value.trim()
    ) {
      return;
    }
    if (
      usernameRef.current?.value.trim() == null ||
      usernameRef.current?.value.trim().length === 0
    ) {
      return;
    }
    const { data, error } = await supabase
      .from("note_users")
      .update({ username: usernameRef.current?.value })
      .eq("id", accountInfo.id)
      .select();
    if (error) {
      toast.error("error saving username");
      console.log(error);
      return;
    }
    toast.success("username successfully saved");
  };
  return (
    <div className="flex items-center gap-3">
      <form onSubmit={updateUsername}>
        <input
          readOnly={accountInfo.username}
          placeholder="username"
          ref={usernameRef}
          defaultValue={accountInfo.username}
          className="text-foreground bg-background outline-none border border-foreground px-1 py-2 text-center rounded-md"
        ></input>
      </form>
    </div>
  );
}

export default Username;
