"use server";

import Question from "@/database/question.modal";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.modal";
import User from "@/database/user.modal";
import { CreateQuestionParams } from "./shared.types";
import { revalidatePath } from "next/cache";

export async function createQuestion(params: CreateQuestionParams) {
  console.log("create question start @@@2");
  // eslint-disable-next-line no-useless-catch
  try {
    connectToDatabase();
    console.log("params received @@@ ", params);
    const { title, content, tags, author, path } = params;
    // Create the question
    console.log("tags --->", tags);
    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];
    console.log("tags -->", tags);
    // Create the tags or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );
      tagDocuments.push(existingTag);
    }
    console.log("tagDocuments --->", tagDocuments);
    await Question.findByIdAndUpdate(question._id, { tags: tagDocuments });

    revalidatePath(path);
  } catch (e) {
    throw e;
  }
}

export async function getQuestions() {
  // eslint-disable-next-line no-useless-catch
  try {
    connectToDatabase();
    return await Question.find()
      .populate("tags", { modal: Tag })
      .populate("author", { modal: User })
      .sort({ createdAt: -1 });
  } catch (e) {
    throw e;
  }
}
