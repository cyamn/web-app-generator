"use client";

import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { default as ProjectAvatar } from "boring-avatars";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import React from "react";

import { UserAvatar } from "./user/avatar";

type HeaderProperties = {
  item: React.ReactNode;
  user?: Session["user"];
  tabs?: React.ReactNode;
  project?: string;
};

export const Header: React.FC<HeaderProperties> = ({
  item,
  user,
  tabs,
  project = null,
}) => {
  const [show, setShow] = React.useState(false);
  return (
    <div className="flex h-11 w-full justify-center border-b border-slate-300 bg-white">
      {project !== null && (
        <a href="/projects">
          <ProjectAvatar
            size={44}
            name={project}
            square={true}
            variant="bauhaus"
            colors={["#3b82f6", "#473f47", "#FFFFFF", "#68a4fd", "#E4EFFF"]}
          />
        </a>
      )}
      <div className="grid w-full grid-cols-4 gap-4 py-1 text-slate-700">
        <div className="pl-3 pt-1">{item}</div>
        <div className="col-span-2">
          {tabs !== undefined && tabs}
          {tabs === undefined && <div></div>}
        </div>
        <div className="relative inline-block text-right">
          {user && <User user={user} show={show} setShow={setShow} />}
          {!user && <UserSkeleton />}
          {show && (
            <div
              className="absolute right-0 z-10 mr-2 mt-2 w-56 origin-top-right divide-y divide-slate-50 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
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

type UserProperties = {
  user: Session["user"];
  show: boolean;
  setShow: (show: boolean) => void;
};

export const User: React.FC<UserProperties> = ({ user, show, setShow }) => {
  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}
      >
        <div className="flex flex-row-reverse justify-center p-1 text-black">
          <UserAvatar user={user} />
          <div className="px-2">{user.name}</div>
        </div>
      </button>
    </div>
  );
};
export const UserSkeleton: React.FC = () => {
  return (
    <div>
      <button>
        <div className="flex flex-row-reverse p-1 text-xl text-white">
          {/* Skeleton loader */}
          <div className="h-8 w-8 animate-pulse rounded-full bg-gray-300" />
        </div>
      </button>
    </div>
  );
};
