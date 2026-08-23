import Card from "@/components/Card";
import Sort from "@/components/Sort";
import { getFiles } from "@/lib/actions/file.actions";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { FileDocument, SearchParamProps } from "@/types";
import React from "react";

const page = async ({ params }: SearchParamProps) => {
  const type = ((await params)?.type as string) || "";

  const files = await getFiles();

  const currentUser = await getCurrentUser();

  return (
    <div className="page-conatiner">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>

        <div className="total-size-section">
          <p className="body-1">
            Total: <span className="h5">0 MB</span>
          </p>

          <div className="sort-container">
            <p className="body-1 hidden text-light-200 sm:block">Sort by:</p>
            <Sort />
          </div>
        </div>
      </section>

      {/* Render the files */}
      {files.total > 0 ? (
        <section className="file-list mt-6 grid grid-cols-1 gap-6 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] items-start justify-start w-full">
          {files.documents.map((file: FileDocument) => {
            return (
              <Card key={file.$id} file={file} currentUser={currentUser} />
            );
          })}
        </section>
      ) : (
        <div className="flex flex-col flex-1 items-center justify-center w-full my-auto pb-20">
          <p className="empty-list text-center text-light-200 body-1">
            No files uploaded
          </p>
        </div>
      )}
    </div>
  );
};

export default page;
