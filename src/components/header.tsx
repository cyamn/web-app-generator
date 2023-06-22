import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import React from "react";

type HeaderProperties = {
  item: React.ReactNode;
  user: Session["user"];
  tabs?: React.ReactNode;
};

export const Header: React.FC<HeaderProperties> = ({ item, user, tabs }) => {
  const [show, setShow] = React.useState(false);
  return (
    <div className="flex h-11 w-full justify-center bg-slate-800 py-1">
      <div className="grid w-full grid-cols-3 gap-4 text-slate-50">
        <div className="pl-3 pt-1 text-xl">{item}</div>
        {tabs !== undefined && tabs}
        {tabs === undefined && <div></div>}

        <div className="relative inline-block text-right">
          <div>
            <button
              onClick={() => {
                setShow(!show);
              }}
            >
              <div className="flex flex-row-reverse p-1 text-xl text-white">
                <Image
                  src={user.image?.toString() ?? ""}
                  width={32}
                  height={32}
                  alt={user.name ?? "user"}
                  className="rounded-full"
                />
                <div className="px-2">{user.name}</div>
              </div>
            </button>
          </div>
          {show && (
            <div
              className="absolute right-0 z-10 mr-2 mt-2 w-56 origin-top-right divide-y divide-slate-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              <div className="py-1" role="none">
                <button
                  onClick={() => void signOut()}
                  className="block px-4 py-2 text-sm text-slate-700"
                  id="menu-item-0"
                >
                  <FontAwesomeIcon className="pr-2" icon={faRightFromBracket} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
