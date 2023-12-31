import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Index() {
  const cookieStore = cookies();

  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className=" w-full min-h-[40vh] max-h-screen flex items-center justify-center">
        {user ? (
          <Link
            href={"/notes"}
            className="bg-btn-background hover:bg-btn-background-hover transition-all duration-300 px-5 py-2 rounded"
          >
            To Notes
          </Link>
        ) : (
          <Link
            href={"/login"}
            className="bg-btn-background hover:bg-btn-background-hover transition-all duration-300 px-5 py-2 rounded"
          >
            To Login
          </Link>
        )}
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>Happy notetaking!</p>
      </footer>
    </div>
  );
}
