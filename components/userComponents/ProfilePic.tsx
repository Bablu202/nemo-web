import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { HiOutlineUser } from "react-icons/hi2";
import classNames from "classnames";

interface ProfilePicProps {
  src?: string;
  onUpload: () => void;
  onDelete: () => Promise<void>;
  uploading?: boolean;
}

const ProfilePic: FC<ProfilePicProps> = ({
  src,
  onUpload,
  onDelete,
  uploading,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowButtons(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showButtons]);

  const handleIconClick = () => {
    setShowButtons(true);
    setTimeout(() => {
      setShowButtons(false);
    }, 5000); // Show buttons for 3 seconds
  };

  return (
    <div
      className={classNames(
        "relative flex items-center justify-center bg-gray-100/10 rounded-lg overflow-hidden transition-all duration-300",
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
          style={{ cursor: "pointer" }} // Change cursor to pointer on image
          key={src} // Ensures image re-render if the src changes
        />
      ) : (
        <HiOutlineUser className=" text-custom-pri dark:text-color-orange text-9xl" />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        {!uploading && showButtons && (
          <>
            {src && (
              <button
                onClick={onDelete}
                className="absolute bottom-2 right-2 p-0.5 lg:px-3 lg:py-1 btn-dark-light shadow-lg"
              >
                Remove Image
              </button>
            )}
            <button
              onClick={onUpload}
              className="absolute bottom-2 left-2 p-0.5 lg:px-3 lg:py-1 btn-dark-light   shadow-lg"
            >
              Change Edit
            </button>
          </>
        )}
        {uploading && (
          <div className="text-custom-pri text-xl">Uploading...</div>
        )}
        {!showButtons && !isScrolled && (
          <div className="absolute top-2 right-2 bg-custom-sec/30 backdrop-blur-lg p-1 rounded-full">
            <HiOutlineUser
              size={24}
              className={classNames("text-white dark:text-color-orange ", {
                "opacity-100 cursor-pointer": !showButtons,
                "opacity-0": showButtons,
                "transition-opacity duration-300": true,
              })}
              onClick={handleIconClick}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePic;
