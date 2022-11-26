import React, { useState, useContext, useEffect } from "react";
import DropdownButton from "./DropdownButton";
import { useNavigate } from "react-router-dom";
import { Outlet } from 'react-router';

import { AuthContext } from "../contexts/AuthContext";

import Button from "./Button";

const NavBar = () => {

  const { auth } = useContext(AuthContext);

  let Links = [
    { name: "HOME", link: "/" },
    { name: "PORTFOLIO A", link: "/portfolio/a" },
    { name: "PORTFOLIO B", link: "/portfolio/b" },
    // { name: "ABOUT", link: "/about" },
    // { name: "DISEASE DETECTION", link: "/detect" },
    // { name: "SHARE", link: "/share" },
  ];

  let [open, setOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        setOpen(false);
      }
    })
  })

  return (
    <>
    <div className="shadow-md w-full top-0 sticky bg-gradient-to-l from-teal-100 via-violet-100 to-lime-200 select-none">
      <div className="md:flex items-center justify-between bg-opacity-75 py-4 md:px-10 px-7 select-none">
        <div
          className="font-bold text-2xl cursor-pointer flex items-center font-[Poppins] 
      text-gray-800"
        >
          <span className="text-3xl text-yellow-800 mr-1 pt-2">
          <ion-icon name="cash-outline"></ion-icon>
          </span>
          Site
        </div>

        <div
          onClick={() => setOpen(!open)}
          className="text-3xl absolute right-8 top-6 cursor-pointer md:hidden"
        >
          <ion-icon name={open ? "close" : "menu"}></ion-icon>
        </div>

        <ul
          className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${
            open ? "top-20 bg-white" : "top-[-490px]"
          } overflow-y-auto`}
        >
          {Links.map((link) => (
            <li
              key={link.name}
              className="md:ml-8 text-l md:my-0 my-7 font-sans"
            >
              <a
                href={link.link}
                className="text-gray-800 hover:text-black duration-500"
              >
                {link.name}
              </a>
            </li>
          ))}
          <li className="md:ml-8 text-xl md:my-0 my-7">
            {
              !(auth?.user !== undefined) ? (
                <Button onClick={() => navigate("/login")} text="Login" />
              ) :
              (
                <DropdownButton />
              )
            }
          </li>
        </ul>
      </div>
    </div>
    <Outlet />
    </>
  );
};

export default NavBar;