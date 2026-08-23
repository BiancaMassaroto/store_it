import { FileDocument } from "@/types";
import Link from "next/link";
import React from "react";
import Thumbnail from "./Thumbnail";
import { convertFileSize } from "@/lib/utils";
import FormattedDateTime from "./FormattedDateTime";
import { appwriteConfig } from "@/lib/appwrite/config";
import ActionDropdown from "./ActionDropdown";

interface CardProps {
  file: FileDocument;
  currentUser?: {
    $id: string;
    fullName: string;
    email: string;
  } | null;
}

const Card = ({ file, currentUser }: CardProps) => {
  const ownerId =
    typeof file?.owner === "string" ? file.owner : file?.owner?.$id;

  const embeddedName =
    typeof file?.owner === "object"
      ? file?.owner?.fullName || file?.owner?.name
      : null;

  const ownerName =
    ownerId === currentUser?.$id
      ? currentUser?.fullName
      : embeddedName || "Shared User";

  return (
    <Link
      href={`${file?.url}&project=${appwriteConfig.projectId}`}
      target="_blank"
      className="file-card flex flex-col gap-4 p-5 bg-white border border-light-300 rounded-2xl shadow-sm hover:shadow-md transition-all w-full max-w-[300px] min-w-[260px] justify-between h-[200px]"
    >
      <div className="flex justify-between items-start w-full">
        <Thumbnail
          type={file.type}
          extension={file.extension}
          url={file.url}
          className="!size-20"
          imageClassName="!size-11"
        />

        <div className="flex flex-col items-end justify-between">
          <ActionDropdown />
          <p className="body-1">{convertFileSize(file.size)}</p>
        </div>
      </div>

      <div className="file-card-details flex flex-col gap-1 w-full mt-auto">
        <p className="font-semibold text-dark-100 line-clamp-1 w-full">
          {file.name}
        </p>
        <FormattedDateTime
          date={file.$createdAt}
          className="body-2 text-light-100"
        />

        <p className="caption line-clamp-1 text-light-200 mt-0.5 font-medium">
          By: {ownerName}
        </p>
      </div>
    </Link>
  );
};

export default Card;
