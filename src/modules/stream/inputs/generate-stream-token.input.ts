import { Field, InputType } from "@nestjs/graphql";
import z from "zod";

const generateStreamTokenSchema = z.object({
  userId: z.string().trim(),
  channelId: z.string().trim()
})

export type TGenerateStreamTokenInput = z.infer<typeof generateStreamTokenSchema>

@InputType()
export class GenerateStreamTokenInput {
  @Field(() => String)
  userId: TGenerateStreamTokenInput['userId']

  @Field(() => String)
  channelId: TGenerateStreamTokenInput['channelId']
}