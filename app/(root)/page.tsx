import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import ThreadCard from "../../components/cards/ThreadCard";
import Pagination from "../../components/shared/Pagination";

import { fetchPosts } from "../../lib/actions/thread.actions";
import { fetchUser } from "../../lib/actions/user.actions";

async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) redirect("/onboarding");

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchPosts(
    searchParams.page ? +searchParams.page : 1,
    30
  );
  console.log(`userInfo?.onboarded: ${userInfo.onboarded}`);

  return (
    <>
      <div className="ml-auto flex items-center"></div>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {result.posts.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user.id}
                currentUserInfoId={userInfo._id.toString()}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
                likedByLength={post.likedBy.length}
                isLiked={post.likedBy.some(
                  (like: { _id: { toString: () => any } }) => {
                    return like._id.toString() === userInfo._id.toString();
                  }
                )}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path="/"
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </>
  );
}

export default Home;
