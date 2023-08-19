"use client";

import Image from "next/image";
import { type Session } from "next-auth";
import React from "react";
import Avatar from "react-avatar";

type UserAvatarProperties = {
  user: Session["user"];
};

export const UserAvatar: React.FC<UserAvatarProperties> = ({ user }) => {
  if (user.image === undefined || user.image === null)
    return <Avatar size="32" name={user.name ?? "user"} round={true} />;
  return (
    <Image
      src={user.image.toString() ?? ""}
      width={32}
      height={32}
      alt={user.name ?? "user"}
      className="rounded-full"
    />
  );
};
