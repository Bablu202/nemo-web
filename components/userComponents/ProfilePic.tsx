// components/ProfilePic.tsx
import Image from "next/image";
import { FC } from "react";

interface ProfilePicProps {
  src?: string;
  onUpload?: () => void;
  onDelete?: () => void;
  uploading?: boolean;
}

const ProfilePic: FC<ProfilePicProps> = ({
  src,
  onUpload,
  onDelete,
  uploading,
}) => {
  return (
    <div className="relative flex items-center justify-center bg-gray-100 rounded-full overflow-hidden w-20 h-20">
      {src ? (
        <Image
          src={src}
          alt="Profile Picture"
          width={80}
          height={80}
          className="object-cover w-full h-full"
          loader={({ src }) => src}
        />
      ) : (
        <div className="text-gray-500 text-xl">No Image</div>
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        {onUpload && !src && (
          <button
            onClick={onUpload}
            className="bg-blue-500/95 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Upload
          </button>
        )}
        {src && (
          <button
            onClick={onDelete}
            disabled={uploading}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePic;
