import { Field, InputType } from "@nestjs/graphql";
import z from "zod";

const enableTOTPSchema = z.object({
  secret: z.string().trim(),
  pin: z.string().trim().min(6).max(6),
})

export type TEnableTOTPInput = z.infer<typeof enableTOTPSchema>

@InputType()
export class EnableTOTPInput {
  @Field(() => String)
  secret!: TEnableTOTPInput['secret']

  @Field(() => String)
  pin!: TEnableTOTPInput['pin']
}