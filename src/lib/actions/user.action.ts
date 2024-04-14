import User from "@/database/user.modal";
import { connectToDatabase } from "../mongoose";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.modal";

export const getUserById = async (params: any) => {
  // eslint-disable-next-line no-useless-catch
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });
    console.log("user ---->>>>", user);
    return user;
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
};

export const createUser = async (params: any) => {
  // eslint-disable-next-line no-useless-catch
  try {
    connectToDatabase();

    const { clerkId, name, username, email, picture } = params;

    const user = await User.create({
      clerkId,
      name,
      username,
      email,
      picture,
    });

    return user;
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
};

export const updateUser = async (params: any) => {
  // eslint-disable-next-line no-useless-catch
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;

    const user = await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });
    revalidatePath(path);
    return user;
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
};

export const deleteUser = async (params: any) => {
  // eslint-disable-next-line no-useless-catch
  try {
    connectToDatabase();

    const { clerkId } = params;

    const user: any = User.findOneAndDelete({ clerkId });
    if (!user) throw new Error("User not found");

    // Delete user from database, and questions and comments etc

    // const userQuestionIds = await Question.find({ author: user._id }).distinct(
    //   "_id"
    // );

    // Delete user questions
    await Question.deleteMany({ author: user?._id });

    // TODO: Delete user answers,comments, etc

    return user;
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
};
