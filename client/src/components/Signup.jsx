import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "../axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("user/signup", formData);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={handleSignup}
        className="shadow-lg rounded-lg flex flex-col gap-5 p-8"
      >
        <div className="my-4">
          <h2 className="text-center font-bold text-xl ">logo</h2>
          <p className="text-sm text-center ">
            Create your account and start your adventure
          </p>
        </div>
        <div>
          <Label className="font-medium">Username</Label>
          <Input
            value={formData.username}
            className="focus-visible:ring-transparent my-2"
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />
        </div>
        <div>
          <Label className="font-medium">Email</Label>
          <Input
            type="email"
            value={formData.email}
            className="focus-visible:ring-transparent my-2"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>
        <div>
          <Label className="font-medium">Password</Label>
          <Input
            type="password"
            value={formData.password}
            className="focus-visible:ring-transparent my-2"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </div>
        <Button>Singup</Button>
      </form>
    </div>
  );
};

export default Signup;
