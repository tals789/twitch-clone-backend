import { Field, InputType } from "@nestjs/graphql";
import z from "zod";

const verificationInput = z.object({
  token: z.uuidv4()
})

export type TVerificationInput = z.infer<typeof verificationInput>

@InputType()
export class VerificationInput {
  @Field(() => String)
  token!: TVerificationInput['token']
}