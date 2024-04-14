import Question from "@/components/forms/questions";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import React from "react";

async function Index() {
  // const { userId } = auth();
  const userId = "ABC123";
  console.log("user id -->", userId);
  const mongoUser = await getUserById({ userId });
  console.log("mongo user -->", mongoUser);

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900 mb-4">Ask a question</h1>
      <Question mongoUserId={JSON.stringify(mongoUser?._id)} />
    </div>
  );
}

export default Index;
