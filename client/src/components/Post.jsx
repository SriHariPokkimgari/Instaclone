import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "./ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";

const Post = ({ data }) => {
  return (
    <div className="my-8 w-full max-w-sm mx-auto ">
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src="" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>username</h1>
        </div>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <MoreHorizontal className="cursor-pointer" />
            </DialogTrigger>
            <DialogContent>
              <DialogDescription className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  className="cursor-pointer w-fit font-bold text-[#ED4956]"
                >
                  Unfollow
                </Button>
                <Button variant="ghost" className="cursor-pointer w-fit">
                  Save to favourites
                </Button>
                <Button variant="ghost" className="cursor-pointer w-fit ">
                  Delete
                </Button>
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Post;
