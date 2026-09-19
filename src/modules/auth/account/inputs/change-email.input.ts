import { Field, InputType } from "@nestjs/graphql"
import { z } from 'zod'

const changeEmailSchema = z.object({
  email: z.email().trim(),
})

export type TChangeEmailInput = z.infer<typeof changeEmailSchema>

@InputType()
export class ChangeEmailInput {
  @Field(() => String)
  email!: TChangeEmailInput['email']
}