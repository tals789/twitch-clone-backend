import { Field, InputType } from "@nestjs/graphql"
import { z } from 'zod'

const usernameFormat = /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/

const createUserSchema = z.object({
  email: z.email().trim(),
  password: z.string().trim().min(8, { error: 'Пароль должен быть не менее 8 символов' }),
  username: z.string().trim().regex(usernameFormat, { error: 'Неверный формат для никнейма' }),
})

export type TCreateUserInput = z.infer<typeof createUserSchema>

@InputType()
export class CreateUserInput {
  @Field(() => String)
  username!: TCreateUserInput['username']

  @Field(() => String)
  email!: TCreateUserInput['email']

  @Field(() => String)
  password!: TCreateUserInput['password']
}