import { Field, InputType } from "@nestjs/graphql";
import z from "zod";

const deactivateAccountSchema = z.object({
  email: z.email().trim(),
  password: z.string().trim().min(8, { error: 'Пароль должен быть не менее 8 символов' }),
  pin: z.string().trim().min(6).max(6).optional()
})

export type TDeactivateAccountInput = z.infer<typeof deactivateAccountSchema>

@InputType()
export class DeactivateAccountInput {
  @Field(() => String)
  email!: TDeactivateAccountInput['email']

  @Field(() => String)
  password!: TDeactivateAccountInput['password']

  @Field(() => String, { nullable: true })
  pin?: TDeactivateAccountInput['pin']
}