import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { HiOutlineUser } from "react-icons/hi2";
import classNames from "classnames";

interface ProfilePicProps {
  src?: string;
  onUpload: () => void;
  onDelete: () => void;
  uploading?: boolean;
}

const ProfilePic: FC<ProfilePicProps> = ({
  src,
  onUpload,
  onDelete,
  uploading,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={classNames(
        "relative flex items-center justify-center bg-gray-100/10  rounded-lg overflow-hidden transition-all duration-300",
        {
          "w-full h-40 ": !isScrolled,
          "w-16 h-16 rounded-full fixed top-4 right-4": isScrolled,
        }
      )}
    >
      {src ? (
        <Image
          src={src}
          alt="Profile Picture"
          width={96}
          height={96}
          className="object-cover w-full h-full"
        />
      ) : (
        <HiOutlineUser className="text-gray-500 text-9xl" />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        {!uploading && (
          <>
            {src && !isScrolled && (
              <button
                onClick={onDelete}
                className="absolute bottom-2 right-2 bg-custom-pri/80 text-white px-3 py-1 rounded-md shadow-md hover:bg-custom-pri focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-pri"
              >
                clear
              </button>
            )}
            {!isScrolled && (
              <button
                onClick={onUpload}
                className="absolute bottom-2 left-2 bg-custom-pri/80 text-white px-3 py-1 rounded-md shadow-md hover:bg-custom-pri focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-pri"
              >
                {src ? "Change" : "Upload"}
              </button>
            )}
          </>
        )}
        {uploading && (
          <div className="text-custom-pri text-xl">Uploading...</div>
        )}
      </div>
    </div>
  );
};

export default ProfilePic;
