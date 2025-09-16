import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Post = () => {
  return (
    <div>
      <div>
        <Avatar className="h-6 w-6">
          <AvatarImage src="" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h1>username</h1>
      </div>
    </div>
  );
};

export default Post;
