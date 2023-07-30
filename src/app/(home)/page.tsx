import Nav from "@/components/nav";
import HomePosts from "@/components/thread/homePosts";
import { buttonVariants } from "@/components/ui/button";
import { db } from "@/db";
import { threads, users } from "@/db/schema";
import { cn } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { desc, eq, sql } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function Page() {
  const user = await currentUser();

  if (!user)
    return (
      <>
        <div className="h-16 w-16 bg-cover">
          <Image
            src={"/assets/threads.svg"}
            alt="Threads logo"
            width={64}
            height={64}
            className="min-h-full invert min-w-full object-cover"
          />
        </div>
        <div className="gradient mt-4 mb-12 text-4xl font-bold">Threads</div>

        <Link
          href="/sign-up"
          className={cn(buttonVariants({ variant: "outline" }), "w-full px-6")}
        >
          Sign Up
        </Link>
        <Link
          href="/sign-in"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full px-6 mt-2"
          )}
        >
          Sign In
        </Link>
      </>
    );

  const getUser = await db
    .select({
      clerkId: users.clerkId,
      isOnboarded: users.onboarded,
      name: users.name,
      image: users.image,
      username: users.username,
    })
    .from(users)
    .where(eq(users.clerkId, user.id));

  if (!getUser[0]?.isOnboarded) {
    redirect("/onboarding");
  }

  const posts = await db.query.threads.findMany({
    with: {
      likes: true,
      author: true,
      replies: {
        with: {
          author: true,
        },
      },
    },
    orderBy: [desc(threads.createdAt)],
    where: sql`${threads.parentId} IS NULL`,
  });

  return (
    <>
      <Nav
        create={{
          id: getUser[0].clerkId,
          name: getUser[0].name!,
          image: getUser[0].image!,
        }}
        username={getUser[0].username!}
      />
      <div className="flex items-center justify-center w-full py-5">
        <div className="h-9 w-9 bg-cover">
          <Image
            src={"/assets/threads.svg"}
            width={64}
            height={64}
            alt="Threads logo"
            className="min-h-full invert min-w-full object-cover"
          />
        </div>
      </div>

      <HomePosts posts={posts} />
    </>
  );
}
