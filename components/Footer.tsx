import { FiLinkedin, FiTwitter } from "react-icons/fi";

const Footer = () => {
  return (
    <div className="bg-gray-50 w-[98vw] h-40">
      <div className="flex flex-col p-10">
        <div className="">
          <h1 className="text-l font-semibold">Talk with founder</h1>
          <div className="flex items-center gap-2 mt-2">
            
            <a href="https://www.linkedin.com/in/harsh-sharma016" target="_blank"  className="border-1 h-8 w-8 flex items-center justify-center rounded-full hover:scale-105">
              <FiLinkedin/>
            </a>
            <a href="https://x.com/harsh444577" target="_blank"  className="border-1 h-8 w-8 flex items-center justify-center rounded-full hover:scale-105">
              <FiTwitter/>
            </a>
          </div>
        </div>
        <div className=""></div>
      </div>
    </div>
  );
};

export default Footer;
