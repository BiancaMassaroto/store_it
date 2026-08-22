import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/toast";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { Toast } from "@base-ui/react";
import { redirect } from "next/navigation";
import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return redirect("/sign-in");

  return (
    <Toast.Provider>
      <main className="flex h-screen">
        <Sidebar {...currentUser} />

        <section className="flex h-full flex-1 flex-col">
          <MobileNavigation {...currentUser} />
          <Header userId={currentUser.$id} accountId={currentUser.accountId} />
          <div className="main-content">{children}</div>
        </section>

        <Toaster />
      </main>
    </Toast.Provider>
  );
};

export default layout;
