import { Field, InputType } from "@nestjs/graphql"
import { z } from 'zod'

const changePasswordSchema = z.object({
  oldPassword: z.string().trim().min(8),
  newPassword: z.string().trim().min(8),
})

export type TChangePasswordInput = z.infer<typeof changePasswordSchema>

@InputType()
export class ChangePasswordInput {
  @Field(() => String)
  oldPassword!: TChangePasswordInput['oldPassword']
  
  @Field(() => String)
  newPassword!: TChangePasswordInput['newPassword']
}