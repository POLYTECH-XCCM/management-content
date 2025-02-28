import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <div className="w-full sticky top-0 flex items-center justify-between px-4 py-2 bg-white dark:bg-black h-24 shadow-md">
      <div className="flex justify-start items-center">
        <h1 className="font-extrabold text-7xl px-6">
          XCCM
        </h1>
        <div className="relative h-full flex items-center justify-start px-4">
          <div className="w-1 h-16 bg-gradient-to-b from-amber-900 via-amber-700 to-amber-500"></div>
          <p className="text-3xl ml-4">Module de Composition de Contenus</p>
        </div>
      </div>
      <div className="flex items-center">
        <Link href="/">
        <button className="mr-4 px-4 py-2 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 transition duration-200">
          Se Déconnecter
        </button>

        </Link>
        <div className="h-20 w-20">
          <Image src="/images/LOGO-POLYTECHNIQUE-01-scaled.jpg" width={100} height={100} alt="logo ENSPY" />
        </div>
      </div>
    </div>
  );
};

export default Header;