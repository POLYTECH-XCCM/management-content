import React, { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "../ThemeToggle";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const Navbar = () => {
  const {theme} = useTheme();
  return (
    <nav className={`bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${theme === 'dark' ? 'from-gray-800 to-gray-900' : 'from-sky-200 to-purple-200'}`}>
      <div className="flex pt-2 justify-around ">
        <div>
          <Image
            className=" "
            src="/images/logo.png"
            height={2}
            width={150}
            alt="logo"
          />
        </div>

        <div>
          <ul className=" pt-2 flex font-medium text-gray-600 ">
            <li className=" pl-16 ">
              <a href="" className="text-xl pl-16 ">
                {" "}
                Welcome{" "}
              </a>
            </li>
            <li>
              <a href="#Footer" className="text-xl pl-16 ">
                {" "}
                About{" "}
              </a>
            </li>
            <li>
              <a href="#Footer" className="text-xl pl-16 ">
                {" "}
                Help{" "}
              </a>
            </li>
            <li>
              <a href="#Footer" className="text-xl pl-16 ">
                {" "}
                Contact{" "}
              </a>
            </li>
          </ul>
        </div>


        <div className="flex items-center">
          <div className=" pl-16 ">
            <Button className={`capitalize w-40 h-10 ${theme === 'dark' ? 'bg-blue' : 'bg-white'} rounded-md`}>
              <Link
                href="auth/register"
                className=" font-medium text-violet-900 text-xl"
              >
                Essayer XCCM
              </Link>
            </Button>
          </div>
          <div className=" pl-8  ">
            <Button className=" capitalize w-40 h-10 bg-violet-900 rounded-md ">
              <Link
                href="auth/login"
                className="font-medium w-full text-white text-xl"
              >
                Connexion
              </Link>
            </Button>
          </div>
          <div className=" pl-8 ">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
