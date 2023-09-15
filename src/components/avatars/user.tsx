"use client";

import Image from "next/image";
import { type Session, User } from "next-auth";
import React from "react";
import { twMerge } from "tailwind-merge";

import { firstNCharsUpperCase } from "@/utils/name-to-first";
import { stringToHex } from "@/utils/name-to-hex";

type UserAvatarProperties = {
  user: Session["user"];
  size?: number;
  className?: string;
};

export const UserAvatar: React.FC<UserAvatarProperties> = ({
  user,
  size = 32,
  className,
}) => {
  if (user.image === undefined || user.image === null)
    return (
      <div
        className={
          className === undefined
            ? "rounded-full"
            : (twMerge("rounded-full"), className)
        }
        style={{
          width: size,
          height: size,
          backgroundColor: stringToHex(user.email ?? user.name ?? "user"),
          fontSize: size / 2.5,
          color: "white",
        }}
      >
        {/* center horizontally and vertically */}
        <span
          className="
        flex
        h-full
        w-full
        items-center
        justify-center
      "
        >
          {firstNCharsUpperCase(user.name ?? user.email ?? "User", 1)}
        </span>
      </div>
    );
  return (
    <Image
      src={user.image.toString() ?? ""}
      width={size}
      height={size}
      alt={user.name ?? "user"}
      className={(twMerge("rounded-full border border-slate-700"), className)}
    />
  );
};

type UsersStackProperties = {
  users: User[];
};

export const UsersStack: React.FC<UsersStackProperties> = ({ users }) => {
  return (
    <div className="flex w-24 flex-row items-center">
      {users.map((user, id) => (
        <UserAvatar
          key={id}
          className="-mr-2 rounded-full"
          user={user}
          size={32}
        />
      ))}
    </div>
  );
};
