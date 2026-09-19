import { Field, InputType } from "@nestjs/graphql";
import z from "zod";

const changeStreamInfoInputSchema = z.object({
  title: z.string().trim(),
  categoryId: z.string().trim()
})

export type TChangeStreamInfoInput = z.infer<typeof changeStreamInfoInputSchema>

@InputType()
export class ChangeStreamInfoInput {
  @Field(() => String)
  title: TChangeStreamInfoInput['title']

  @Field(() => String)
  categoryId: TChangeStreamInfoInput['categoryId']
}