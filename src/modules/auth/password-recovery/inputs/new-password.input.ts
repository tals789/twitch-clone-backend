import { Field, InputType } from "@nestjs/graphql";
import z from "zod";

const newPasswordSchema = z.object({
  password: z.string().trim().min(8),
  passwordRepeat: z.string().trim().min(8),
  token: z.uuidv4()
}).refine(data => data.password === data.passwordRepeat, { error: 'Пароли не совпадают' })

export type TNewPasswordInput = z.infer<typeof newPasswordSchema>

@InputType()
export class NewPasswordInput {
  @Field(() => String)
  password!: TNewPasswordInput['password']

  @Field(() => String)
  passwordRepeat!: TNewPasswordInput['passwordRepeat']

  @Field(() => String)
  token!: TNewPasswordInput['token']
}