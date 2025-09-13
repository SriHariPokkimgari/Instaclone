import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const sideBarItems = [
  { icon: <Home />, text: "Home" },
  { icon: <Search />, text: "Search" },
  { icon: <TrendingUp />, text: "Explore" },
  { icon: <MessageCircle />, text: "Messages" },
  { icon: <Heart />, text: "Notifications" },
  { icon: <PlusSquare />, text: "Create" },
  {
    icon: (
      <Avatar className="h-6 w-6">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    text: "Profile",
  },
  { icon: <LogOut />, text: "Logout" },
];

const LeftSidebar = () => {
  const navigate = useNavigate();

  const loguotHandler = async () => {
    try {
      const res = await axios.get("/user/logout");
      console.log(res);
      toast(res?.data?.message);
      navigate("/login");
    } catch (error) {
      console.log(error);
      if (error?.message) {
        toast(error?.message);
      } else {
        toast(error?.response?.data?.data?.message);
      }
    }
  };

  const sideBarHandler = (item) => {
    if (item === "Logout") loguotHandler();
  };

  return (
    <div className="fixed left-0 right-0 border-r border-gray-300 w-[15%] h-screen">
      <div className="flex flex-col">
        <h1>LOGO</h1>
        <div>
          {sideBarItems.map((item, index) => {
            return (
              <div
                key={index}
                className="flex items-center gap-3 relative hover:bg-gray-100 p-3 rounded-lg cursor-pointer mt-3"
                onClick={() => sideBarHandler(item.text)}
              >
                {item.icon}
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
