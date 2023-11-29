import { createClient } from "@/utils/supabase/server";
import { headers, cookies } from "next/headers";
import { MdAccountCircle } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";
import Username from "@/components/account/Username";
import { redirect } from "next/navigation";
async function page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: accountInfo } = await supabase
    .from("note_users")
    .select()
    .eq("deleted", false)
    .eq("id", user?.id)
    .single();
  const { data: notesCount } = await supabase
    .from("notes")
    .select("count")
    .eq("deleted", false)
    .eq("author_id", user?.id)
    .single();
  const { data: commentsCount } = await supabase
    .from("comments")
    .select("count")
    .eq("deleted", false)
    .eq("author_id", user?.id)
    .single();
  const signOut = async () => {
    "use server";

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    await supabase.auth.signOut();
    return redirect("/login");
  };
  return (
    <div>
      {accountInfo ? (
        <div className="w-full flex flex-col justify-center items-center gap-5">
          <MdAccountCircle style={{ fontSize: "100px" }} />
          <Username accountInfo={accountInfo} />

          <p>{accountInfo.email}</p>
          <p>
            {notesCount?.count}{" "}
            {Number(notesCount?.count) === 1 ? "note" : "notes"}
          </p>
          <p>
            {commentsCount?.count}{" "}
            {Number(commentsCount?.count) === 1 ? "comment" : "comments"}
          </p>
          <form action={signOut}>
            <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
              Logout
            </button>
          </form>
        </div>
      ) : (
        <div> Loading...</div>
      )}
    </div>
  );
}

export default page;
