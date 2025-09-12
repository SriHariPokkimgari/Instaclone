import {
  Bell,
  Home,
  MessageCircle,
  Move,
  Search,
  SquarePlay,
  SquarePlus,
  User,
} from "lucide-react";
import React from "react";

const LeftSidebar = () => {
  const sideBar = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <Move />, text: "Explore" },
    { icon: <SquarePlay />, text: "Reels" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Bell />, text: "Notifications" },
    { icon: <SquarePlus />, text: "Create" },
    { icon: <User />, text: "Profile" },
  ];

  return (
    <div>
      {sideBar.map((item) => (
        <div className="flex m-4 gap-5 w-[200px] hover:bg-gray-300">
          {item.icon}
          {item.text}
        </div>
      ))}
    </div>
  );
};

export default LeftSidebar;
