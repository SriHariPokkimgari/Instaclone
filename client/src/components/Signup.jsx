import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "../axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("user/signup", formData, {
        withCredentials: true,
      });
      console.log(res);
      toast.success(res?.data?.message);
      setFormData({
        username: "",
        email: "",
        password: "",
      });
      navigate("/login");
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.data) {
        toast.error("Username was already used.");
      } else {
        toast.error(error?.response?.data?.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center h-screen justify-center">
      <form
        onSubmit={handleSignup}
        className="shadow-lg rounded-lg w-[350px] flex flex-col gap-5 p-8"
      >
        <div className="my-4">
          <h2 className="text-center font-medium text-xl ">Sign up</h2>
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
        {isLoading ? (
          <Button>
            <Loader2 className="mt2 w-4 h-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button>Signup</Button>
        )}
        <span className="text-center">
          Already have an accoun{" "}
          <Link className="text-blue-500 underline" to="/login">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;
