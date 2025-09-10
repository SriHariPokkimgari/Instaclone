import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "../axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/user/login", formData);
      setUserData(res?.data?.data);
      setIsLoading(true);
      console.log(res);
    } catch (error) {
      console.log(error);
      setMessage(error?.response?.data?.message);
    } finally {
      console.log(userData);
      console.log(message);
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleLogin}
        className="shadow-lg w-[350px] flex flex-col gap-5 p-8"
      >
        <div>
          <h1 className="font-bold text-xl text-center">Logo</h1>
          <p className="text-sm text-center">Login for access</p>
        </div>
        <div>
          <Label className="font-medium">Email</Label>
          <Input
            type="email"
            value={formData.email}
            className="focus-visible:ring-transparent mt-2"
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
            className="focus-visible:ring-transparent mt-2"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </div>
        <Button>{isLoading ? "Login..." : "Login"}</Button>
        <div className="text-center">
          <p>
            Don't have an account?
            <a href="/signup" className="underline text-blue-500">
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
