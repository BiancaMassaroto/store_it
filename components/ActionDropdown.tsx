"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { ActionType, FileDocument } from "@/types";
import { actionsDropdownItems } from "@/constants";
import Link from "next/link";
import { constructDownloadUrl } from "@/lib/utils";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  deleteFile,
  renameFile,
  updateFileUsers,
} from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { FileDetails, ShareInput } from "./ActionsModalContent";

interface CurrentUserProps {
  $id: string;
  fullName: string;
  email: string;
  accountId?: string;
}

const ActionDropdown = ({
  file,
  currentUser,
}: {
  file: FileDocument;
  currentUser?: CurrentUserProps | null;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [name, setName] = useState(file.name);
  const [isLoading, setIsloading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);

  const path = usePathname();

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file.name);
    // setEmails([]);
  };

  const handleAction = async () => {
    if (!action) return;
    setIsloading(true);
    let success = false;

    const actions = {
      rename: () =>
        renameFile({
          fieldId: file.$id,
          name,
          extension: file.extension,
          path,
        }),
      share: () => updateFileUsers({ fieldId: file.$id, emails, path }),
      delete: () =>
        deleteFile({
          fieldId: file.$id,
          path,
          bucketFieldId: file.bucketFileId,
        }),
    };

    success = await actions[action.value as keyof typeof actions]();

    if (success) closeAllModals();

    setIsloading(false);
  };

  const handleRemoveUser = async (email: string) => {
    const updateEmails = emails.filter((e) => e !== email);

    const success = await updateFileUsers({
      fieldId: file.$id,
      emails: updateEmails,
      path,
    });

    if (success) setEmails(updateEmails);
    closeAllModals();
  };

  const renderDialogContent = () => {
    if (!action) return null;

    const { value, label } = action;

    return (
      <DialogContent className="shad-dialog button bg-white">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          {value === "rename" && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {value === "details" && (
            <FileDetails file={file} currentUser={currentUser} />
          )}
          {value === "share" && (
            <ShareInput
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUser}
            />
          )}
          {value === "delete" && (
            <p className="delete-confirmation">
              Are you sure you want to delete{` `}
              <span className="delete-file-name">{file.name}</span>?
            </p>
          )}
        </DialogHeader>
        {["rename", "delete", "share"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3">
            <Button onClick={closeAllModals} className="modal-cancel-button">
              Cancel
            </Button>
            <Button onClick={handleAction} className="modal-submit-button">
              <p className="capitalize">{value}</p>
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="animate-spin"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          className="cursor-pointer shad-n-focus"
        >
          <Image
            src="/assets/icons/dots.svg"
            alt="dots"
            width={30}
            height={30}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          onClick={(e) => e.stopPropagation()}
          className="bg-white opacity-100 shadow-md border border-light-300 rounded-xl z-50 min-w-[200px]"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="max-w-[200px] truncate">
              {file.name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {actionsDropdownItems.map((actionItems) => (
              <DropdownMenuItem
                key={actionItems.value}
                className="shad-dropdown-item"
                onClick={() => {
                  setAction(actionItems);

                  if (
                    ["rename", "share", "delete", "details"].includes(
                      actionItems.value,
                    )
                  ) {
                    setIsModalOpen(true);
                  }
                }}
              >
                {actionItems.value === "download" ? (
                  <Link
                    href={`${constructDownloadUrl(file.bucketFileId)}&project=${appwriteConfig.projectId}`}
                    download={file.name}
                    className="flex items-center gap-2"
                  >
                    <Image
                      src={actionItems.icon}
                      alt={actionItems.label}
                      width={30}
                      height={30}
                    />
                    {actionItems.label}
                  </Link>
                ) : (
                  <div className="flex items-center gap-2">
                    <Image
                      src={actionItems.icon}
                      alt={actionItems.label}
                      width={30}
                      height={30}
                    />
                    {actionItems.label}
                  </div>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialogContent()}
    </Dialog>
  );
};

export default ActionDropdown;
