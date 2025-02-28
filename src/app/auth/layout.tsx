import Image from "next/image";
//import { useTheme } from "next-themes";


const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  //const { theme } = useTheme();
  return (
      <div className = {`h-full flex-col flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-200 to-purple-300 `}>
        <Image
          className="pt-16 pb-16 "
          src="/images/logo.png"
          height={2}
          width={150}
          alt="logo"
        />
        {children}
      </div>
  );
};

export default AuthLayout;
