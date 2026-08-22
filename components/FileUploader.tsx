"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "./Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";
import { useToastManager } from "./ui/toast";
import { uploadFile } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader = ({ ownerId, accountId, className }: Props) => {
  const path = usePathname();
  const { add } = useToastManager();
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);

      const uploadPromises = acceptedFiles.map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prevFiles) =>
            prevFiles.filter((f) => f.name !== file.name),
          );

          return add({
            description: (
              <p className="body-2 text-white bg-red-500 p-4 rounded-lg error-toast">
                <span className="font-semibold">{file.name}</span> is too large.
                Max file size is 50MB
              </p>
            ),
          });
        }

        return uploadFile({ file, ownerId, accountId, path }).then(
          (uploadFile) => {
            if (uploadFile) {
              setFiles((prevFiles) =>
                prevFiles.filter((f) => f.name !== file.name),
              );
            }
          },
        );
      });

      await Promise.all(uploadPromises);
    },
    [add, ownerId, accountId, path],
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    fileName: string,
  ) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  return (
    // Container flexível que garante empilhamento vertical correto dos blocos
    <div className="cursor-pointer max-w-fit self-end">
      <div
        {...getRootProps()}
        className="cursor-pointer inline-block max-w-fit"
      >
        <input {...getInputProps()} />
        <Button type="button" className={cn("uploader-button", className)}>
          <Image
            src="/assets/icons/upload.svg"
            alt="upload"
            width={24}
            height={24}
          />
          <p className="text-white font-semibold">Upload</p>
        </Button>
      </div>

      {files.length > 0 && (
        <div className="w-full block clear-both">
          <ul className="uploader-preview-list">
            <h4 className="h4 text-light-100 mb-3">Uploading</h4>

            {files.map((file, index) => {
              const { type, extension } = getFileType(file.name);

              return (
                <li
                  key={`${file.name}-${index}`}
                  className="uploader-preview-item flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Thumbnail
                      type={type}
                      extension={extension}
                      url={convertFileToUrl(file)}
                    />

                    <div className="preview-item-name flex flex-row items-center gap-2 max-w-[80%] break-all">
                      <span className="line-clamp-1">{file.name}</span>
                      <Image
                        src="/assets/icons/file-loader.gif"
                        alt="Loader"
                        width={80}
                        height={26}
                        className="inline-block object-contain"
                      />
                    </div>
                  </div>

                  <Image
                    src="/assets/icons/remove.svg"
                    width={24}
                    height={24}
                    alt="Remove"
                    className="cursor-pointer z-10"
                    onClick={(e) => handleRemoveFile(e, file.name)}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
