import Link from "next/link";
import React from "react";
import { MdEdit, MdOutlineOpenInFull } from "react-icons/md";
import { FaComment } from "react-icons/fa";
function Notecard({ note, user }: any) {
  return (
    // <div className="my-2 border border-foreground p-2 rounded  bg-btn-background">
    <div className="my-2 p-2 rounded  bg-btn-background">
      <div className="flex justify-between items-center px-1">
        <p className="text-xl font-medium">{note.title}</p>
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
      <div className="text-foreground outline-none border-x border-y border-gray-600 shadow-slate-800 p-2 overflow-hidden resize-none w-full h-20 rounded">
        <pre className="">{note.note}</pre>
      </div>
      <div className="flex gap-5 mt-2 items-center flex-wrap justify-around">
        <p className="text-xs">
          {note.note_users && note.note_users.username
            ? note.note_users.username
            : note.note_users.email}
        </p>
        <p className="text-xs">
          {new Intl.DateTimeFormat("en-US", {
            dateStyle: "short",
            timeStyle: "short",
          })
            .format(new Date(note.created_at))
            .toString()}
        </p>
        <div className="text-xs flex items-center gap-1">
          <FaComment /> <p>{note.comments && note.comments.length}</p>
        </div>
      </div>
    </div>
  );
}

export default Notecard;
