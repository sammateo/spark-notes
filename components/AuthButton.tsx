import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MdAccountCircle } from "react-icons/md";

export default async function AuthButton() {
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

  return user ? (
    <div className="flex items-center gap-4">
      <Link href={"/account"} className="flex items-center gap-2">
        <MdAccountCircle style={{ fontSize: "30px" }} />
        {accountInfo.username ? accountInfo.username : accountInfo.email}
      </Link>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  );
}
