import { Field, InputType } from "@nestjs/graphql";
import z from "zod";

const sendMessageInputSchema = z.object({
  text: z.string().trim(),
  streamId: z.string().trim(),
})

export type TSendMessageInput = z.infer<typeof sendMessageInputSchema>

@InputType()
export class SendMessageInput {
  @Field(() => String)
  text: TSendMessageInput['text']

  @Field(() => String)
  streamId: TSendMessageInput['streamId']
}