import { Field, InputType } from "@nestjs/graphql";
import z from "zod";

const resetPasswordSchema = z.object({
  email: z.email().trim()
})

export type TResetPasswordInput = z.infer<typeof resetPasswordSchema>

@InputType()
export class ResetPasswordInput {
  @Field(() => String)
  email!: TResetPasswordInput['email']
}