import { Models } from "node-appwrite";
import React from "react";

declare type FileType = "document" | "image" | "video" | "audio" | "other";

declare interface ActionType {
  label: string;
  icon: string;
  value: string;
}

declare interface SearchParamProps {
  params?: Promise<SegmentParams>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

declare interface UploadFileProps {
  file: File;
  ownerId: string;
  accountId: string;
  path: string;
}

declare interface GetFilesProps {
  types: FileType[];
  searchText?: string;
  sort?: string;
  limit?: string;
}

declare interface RenameFileProps {
  fieldId: string;
  name: string;
  extension: string;
  path: string;
}

declare interface UpdateFileusersProps {
  fieldId: string;
  emails: string[];
  path: string;
}

declare interface DeleteFileProps {
  fieldId: string;
  bucketFieldId: string;
  path: string;
}

declare interface FileUploaderProps {
  ownerId: string;
  accountId: string;
  className?: string;
}

declare interface MobileNavigationProps {
  ownerId: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}

declare interface SidebarProps {
  fullName: string;
  avatar: string;
  email: string;
}

declare interface ThumbnailProps {
  type: string;
  extension: string;
  url: string;
  className?: string;
  imageClassName?: string;
}

declare interface ShareInputProps {
  file: Models.Document;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (email: string) => void;
}

interface FileSpaceInfo {
  size: number;
  latestDate: string | Date | number; // Escolha o tipo exato que o Appwrite retorna para a data
}

declare interface TotalSpaceProps {
  document: FileSpaceInfo;
  image: FileSpaceInfo;
  video: FileSpaceInfo;
  audio: FileSpaceInfo;
  other: FileSpaceInfo;
}

interface FileOwner {
  name: string;
  email: string;
  $id: string;
  fullName: string;
}

declare interface FileDocument extends Models.Document {
  name: string;
  url: string;
  type: string;
  size: number;
  extension: string;
  owner: FileOwner;
  bucketFileId: string;
  users: string[];
}
