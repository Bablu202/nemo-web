import { IconType } from "react-icons/lib";

const Footer = () => {
  return (
    <footer className="bg-custom-pri dark:bg-custom-sec p-2.5 mt-5 w-full pb-20 lg:pb-0">
      <section className="max-w-6xl m-auto">
        <div className="flex flex-col text-white text-center mx-5 lg:flex lg:flex-row lg:justify-between">
          <div className="flex flex-col">
            <h3 className="text-base sm:text-xl lg:text-2xl">
              Follow us for more events & things...
            </h3>
            <p className="">&copy; 2024.All rights are Reserved</p>
          </div>

          <div className="flex justify-center text-center gap-2">
            {footerContent.map((item: FooterContent) => (
              <a key={item.id} href={item.url} className="mx-2">
                {item.isText ? (
                  <span className="text-lg">{item.title}</span>
                ) : (
                  <div
                    className="mt-2  text-2xl lg:text-2xl cursor-pointer 
                  hover:border-none hover:text-custom-sec 
                  hover:transform hover:-translate-y-1 transition duration-300"
                  >
                    {item.logo && <item.logo />}
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;

import { PiInstagramLogo } from "react-icons/pi";
import { PiFacebookLogo } from "react-icons/pi";
import { PiTwitterLogoLight } from "react-icons/pi";
import { PiTwitchLogo } from "react-icons/pi";
import { PiDiscordLogoLight } from "react-icons/pi";
import { PiTelegramLogoLight } from "react-icons/pi";
export interface FooterContent {
  id: string;
  logo: IconType;
  title: string;
  url: string;
  isText: boolean;
}
export const footerContent: FooterContent[] = [
  { id: "1", logo: PiInstagramLogo, title: "", url: "", isText: false },
  { id: "2", logo: PiTelegramLogoLight, title: "", url: "", isText: false },
  { id: "3", logo: PiFacebookLogo, title: "", url: "", isText: false },
  { id: "4", logo: PiTwitterLogoLight, title: "", url: "", isText: false },
  { id: "5", logo: PiTwitchLogo, title: "", url: "", isText: false },
  { id: "6", logo: PiDiscordLogoLight, title: "", url: "", isText: false },
];
