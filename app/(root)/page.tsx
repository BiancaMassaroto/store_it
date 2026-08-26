import Thumbnail from "@/components/Thumbnail";
import { getFiles } from "@/lib/actions/file.actions";
import { getFileTypesParams } from "@/lib/utils";
import { FileDocument, FileType, SearchParamProps } from "@/types";

export default async function Home({ searchParams, params }: SearchParamProps) {
  const type = ((await params)?.type as string) || "";
  const searchText = ((await searchParams)?.query as string) || "";
  const sort = ((await searchParams)?.sort as string) || "";

  const types = getFileTypesParams(type) as FileType[];

  const files = await getFiles({ types, searchText, sort });

  return (
    <div className="main-content flex flex-col xl:flex-row gap-6 items-start">
      <div className="flex items-center justify-center p-6 shadow bg-red rounded-2xl text-white w-full xl:max-w-[380px]">
        <div className="relative flex items-center justify-center shrink-0">
          <svg
            width={160}
            height={160}
            className="-rotate-90 sm:w-[180px] sm:h-[180px] lg:w-[200px] lg:h-[200px]"
          >
            <circle
              cx={100}
              cy={100}
              r={80}
              fill="transparent"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={12}
            />
            <circle
              cx={100}
              cy={100}
              r={80}
              fill="transparent"
              stroke="white"
              strokeWidth={12}
              strokeDasharray={502}
              strokeDashoffset={200}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-lg font-bold text-white sm:text-xl">
            18%
          </span>
        </div>

        <div className="pl-6">
          <div className="flex flex-col">
            <h2 className="text-lg lg:text-xl capitalize font-semibold leading-tight">
              Available Storage
            </h2>
            <p className="text-light-300 text-xs lg:text-sm mt-1">
              39.6MB / 2GB
            </p>
          </div>
        </div>
      </div>

      <div>
        <h1>hiiiii</h1>
      </div>

      <div className="flex flex-col p-6 shadow bg-white rounded-2xl flex-1 w-full items-stretch">
        <h2 className="text-xl font-bold text-neutral-800 lg:text-2xl">
          Recent files uploaded
        </h2>

        {files && files.total > 0 ? (
          <section className="mt-6 flex flex-col gap-4 w-full items-stretch">
            {files.documents.map((file: FileDocument) => {
              return (
                <div
                  key={file.$id}
                  className="flex items-center justify-between gap-4 w-full p-4 bg-white rounded-xl shadow-sm border border-neutral-100 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className="!size-20"
                      imageClassName="!size-11"
                    />

                    <p className="font-semibold text-neutral-800 break-words whitespace-normal flex-1 text-sm sm:text-base">
                      {file.name}
                    </p>
                  </div>

                  <div className="text-right text-xs sm:text-sm text-neutral-500 shrink-0 ml-4">
                    <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
              );
            })}
          </section>
        ) : (
          <div className="flex flex-col flex-1 items-center justify-center w-full py-20">
            <p className="text-center text-neutral-400 body-1">
              No files uploaded
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
