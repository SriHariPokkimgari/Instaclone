import React from "react";
import Signup from "./components/Signup";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from "./components/Login";
import { MainLayout } from "./components/MainLayout";
import Home from "./components/Home";
import Profile from "./components/Profile";
import LeftSidebar from "./components/LeftSidebar";

const App = () => {
  const browserRouter = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
      ],
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);
  return <RouterProvider router={browserRouter} />;
};

export default App;
