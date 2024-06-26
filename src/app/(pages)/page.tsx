import { auth } from "@/auth";
import { Post } from "@/components/thread/server";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { Loader2 } from "lucide-react";
import { Fragment, Suspense } from "react";

export default function Home() {
  return (
    <main className="h-full">
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center">
            <Loader2 className="size-6 animate-spin" />
          </div>
        }
      >
        <Posts />
      </Suspense>
    </main>
  );
}

async function Posts() {
  const session = await auth();
  if (!session) throw new Error("User not found");
  const likedPosts = await db.query.likes
    .findMany({
      where: (table, { eq }) => eq(table.userId, session.user.id),
    })
    .then((p) => p.map((p) => p.postId));

  const posts = await db.query.posts.findMany({
    where: (table, { isNull }) => isNull(table.parentId),
    orderBy: (table, { desc }) => desc(table.createdAt),
    limit: 100,
    with: {
      likes: true,
      replies: true,
      user: true,
    },
  });
  return (
    <div className="space-y-2" key={Math.random()}>
      {posts.map((post) => (
        <Fragment key={post.id}>
          <Post
            key={post.id}
            post={post}
            isLiked={likedPosts.some((p) => p === post.id)}
            avatarProps={{
              src: post.user?.image ?? "",
              alt: post.user?.username || "@anonymous",
              fallback: post.user?.username.at(0) || "G",
            }}
          />
          <Separator />
        </Fragment>
      ))}
    </div>
  );
}
