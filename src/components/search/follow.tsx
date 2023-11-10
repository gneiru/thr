"use client";

import { useTransition } from "react";
import { Button } from "../ui/button";
import { followUser, unfollowUser } from "@/lib/actions/userActions";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

export default function FollowButton({
  isFollowing,
  name,
  followerId,
  followingId,
}: {
  isFollowing: boolean;
  name: string;
  followerId: string;
  followingId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        startTransition(async () => {
          if (isFollowing) {
            await unfollowUser(followerId, followingId, pathname);
          } else {
            await followUser(followerId, followingId, pathname);
          }
          toast.success(`${isFollowing ? "Unfollowed" : "Followed"} ${name}`);
        });
      }}
      variant="outline"
      size="sm"
      className="w-24"
    >
      {isPending ? (
        <Loader2 className="animate-spin w-4 h-4" />
      ) : isFollowing ? (
        "Following"
      ) : (
        "Follow"
      )}
    </Button>
  );
}
