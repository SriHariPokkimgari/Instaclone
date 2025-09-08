import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";
import { Input } from "./ui/input";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-100">
      <form>
        <div>
          <h2>logo</h2>
          <p>signup for login... </p>
        </div>
        <div>
          <Label>username</Label>
          <Input
            placeholder="username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
          <Label>email</Label>
          <Input
            type="email"
            placeholder="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <Label>password</Label>
          <Input
            type="password"
            placeholder="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
      </form>
    </div>
  );
};

export default Signup;
