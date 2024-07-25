// ProfilePic.tsx
import Image from "next/image";
import { FC } from "react";

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
  return (
    <div className="relative flex items-center justify-center bg-gray-100 rounded-full overflow-hidden w-24 h-24 shadow-md">
      {src ? (
        <Image
          src={src}
          alt="Profile Picture"
          width={96}
          height={96}
          className="object-cover w-full h-full"
          loader={({ src }) => src}
        />
      ) : (
        <div className="text-gray-500 text-xl">No Image</div>
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        {!uploading && (
          <>
            {src && (
              <button
                onClick={onDelete}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                &times;
              </button>
            )}
            <button
              onClick={onUpload}
              className={`${
                src ? "absolute bottom-2 left-2" : "bg-blue-500"
              } text-white px-3 py-1 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {src ? "Change" : "Upload"}
            </button>
          </>
        )}
        {uploading && <div className="text-blue-500 text-xl">Uploading...</div>}
      </div>
    </div>
  );
};

export default ProfilePic;
