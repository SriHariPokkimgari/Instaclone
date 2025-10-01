import React from "react";
import Post from "./Post";

const Posts = () => {
  return (
    <div>
      <div className="flex flex-col gap-4 items-center ">
        {[1, 2, 3, 4].map((item, index) => (
          <Post key={index} data={item} />
        ))}
      </div>
    </div>
  );
};

export default Posts;
