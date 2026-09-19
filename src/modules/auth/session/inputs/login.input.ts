import { Field, InputType } from "@nestjs/graphql";
import z from "zod";

const loginInputSchema = z.object({
  login: z.string().trim(),
  password: z.string().trim().min(8, { error: 'Пароль должен быть не менее 8 символов' }),
  pin: z.string().trim().min(6).max(6).optional()
})

export type TLoginInput = z.infer<typeof loginInputSchema>

@InputType()
export class LoginInput {
  @Field(() => String)
  login!: TLoginInput['login']

  @Field(() => String)
  password!: TLoginInput['password']

  @Field(() => String, { nullable: true })
  pin?: TLoginInput['pin']
}