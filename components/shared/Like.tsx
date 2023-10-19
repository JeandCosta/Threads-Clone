"use client";
import Image from "next/image";
import { updateLikedBy } from "../../lib/actions/thread.actions";
import { useEffect, useState } from "react";

type LikeProps = {
  isLiked: boolean;
  threadId: string;
  currentUser: string;
  initialLikeCount: number;
};

const Like: React.FC<LikeProps> = ({
  isLiked,
  threadId,
  currentUser,
  initialLikeCount,
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const handleLike = async () => {
    try {
      const { updateIsLiked, updateLikeCount } = await updateLikedBy(
        threadId,
        currentUser
      );
      setLiked(updateIsLiked);
      setLikeCount(updateLikeCount);
    } catch (error) {
      console.error("Failed to update liked status:", error);
    }
  };

  return (
    <div className="relative">
      <button onClick={handleLike}>
        <Image
          src={liked ? "/assets/heart-filled.svg" : "/assets/heart-gray.svg"}
          alt="heart"
          width={24}
          height={24}
          className="cursor-pointer object-contain"
        />
      </button>
      {likeCount > 0 && (
        <p
          id="updatedLikeCount"
          className="text-subtle-medium text-gray-1 absolute w-11"
        >
          {likeCount} Like{likeCount !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
};

export default Like;
