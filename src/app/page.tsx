"use client"

import { LoginButton } from "@/components/auth/login-button";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Typewriter, Cursor } from "react-simple-typewriter";
import { useTheme } from "next-themes";

const App = () => {
  const { theme } = useTheme();

  return (
    <>
      <div className="">
        <Navbar />
        <main className = {` flex h-full flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${theme === 'dark' ? 'from-gray-800 to-gray-900' : 'from-sky-200 to-purple-300'} `}>
          <section className=" mb-32 flex h-full">
            <aside className=" h-full w-2/4 pl-16 mx-auto mt-16 ">
              <h1 className="text-5xl text-black-700 font-bold">
                <Typewriter typeSpeed={150} words={["Bienvenue dans XCCM", "Welcome to XCCM", "Bem-vindo ao XCCM", "Bine ai venit în XCCM", "Bienvenido a XCCM"]} loop={0} />
                <span><Cursor /></span>
              </h1>
              <div className="mt-16">
                <p className=" text-left text-gray-500  text-2xl font-bold">
                  XCCM (eXtended Content Composition Module) simplifie la compilation de contenus éducatifs en intégrant des fonctionnalités avancées d organisation et de segmentation. Faites de vos idées des supports pédagogiques percutants en quelques clics.
                </p>
              </div>

              <div className=" leading-2 mt-12  items-stretch justify-start">
                <div className="  flex flex-row gap-10">
                  <Button className=" capitalize w-40 h-12 bg-violet-900 rounded-sm ">
                    <Link
                      href="auth/login"
                      className="w-full font-medium text-white text-xl"
                    >
                      Commencer
                    </Link>
                  </Button>
                </div>
              </div>
            </aside>
            <aside className="h-full w-2/5  ">
              <div className=" mt-16">
                <Image
                  src="/images/img.svg"
                  height={350}
                  width={400}
                  alt="office scheme"
                />
              </div>
            </aside>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default App;
