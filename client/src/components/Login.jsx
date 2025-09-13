import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "../axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("/user/login", formData, {
        withCredentials: true,
      });
      setUserData(res?.data?.data);
      navigate("/");
      toast.success(res?.data?.message);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
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
        {isLoading ? (
          <Button>
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            please wait
          </Button>
        ) : (
          <Button>Login</Button>
        )}

        <span className="text-center">
          Doesn't have an account{" "}
          <Link to="/signup" className="text-blue-500 underline">
            Signup
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
