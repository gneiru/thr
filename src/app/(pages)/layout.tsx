import { auth } from "@/auth";
import { ThreadIcon } from "@/components/icons";
import { ActiveLink, ThreadFormInputs } from "@/components/interactive";
import { DialogProvider } from "@/components/providers/dialog";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { db } from "@/db";
import { Edit, Heart, Home, Search, User2 } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface StickyLayoutProps {
  children: React.ReactNode;
}

export default async function StickyLayout({ children }: StickyLayoutProps) {
  const session = await auth();
  if (!session) redirect("/signin");
  return (
    <div className="relative mx-auto flex h-screen max-w-[35rem] flex-col py-4">
      <ThreadIcon className="mx-auto size-9" />
      <main className="h-full flex-1 overflow-auto px-2">{children}</main>
      <nav
        className={
          "flex justify-around *:flex *:flex-1 *:justify-center *:py-2"
        }
      >
        <ActiveLink href="/" className="hover:bg-border">
          <Home className="size-6" />
        </ActiveLink>
        <ActiveLink href="/search">
          <Search className="size-6" />
        </ActiveLink>
        <Suspense fallback={<Edit className="size-6 opacity-75" />}>
          <CreateThread />
        </Suspense>
        <ActiveLink href={"#"}>
          <Heart className="size-6" />
        </ActiveLink>
        <ActiveLink href="/@me">
          <User2 className="size-6" />
        </ActiveLink>
      </nav>
    </div>
  );
}

async function CreateThread() {
  const session = await auth();
  if (!session) throw new Error("User not found");
  return (
    <>
      <DialogProvider>
        <DialogTrigger asChild>
          <div className="hover:bg-border">
            <Edit className="size-6 opacity-75" />
          </div>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] overflow-auto">
          <ThreadFormInputs user={session.user} />
        </DialogContent>
      </DialogProvider>
    </>
  );
}
