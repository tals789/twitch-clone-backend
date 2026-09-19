import { Field, InputType } from "@nestjs/graphql"
import { z } from 'zod'

const usernameFormat = /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/

const changeProfileInfoSchema = z.object({
  username: z.string().trim().regex(usernameFormat, { error: 'Неверный формат для никнейма' }),
  displayName: z.string().trim(),
  bio: z.string().trim().max(300).optional()
})

export type TChangeProfileInfoInput = z.infer<typeof changeProfileInfoSchema>

@InputType()
export class ChangeProfileInfoInput {
  @Field(() => String)
  username!: TChangeProfileInfoInput['username']

  @Field(() => String)
  displayName!: TChangeProfileInfoInput['displayName']

  @Field(() => String)
  bio?: TChangeProfileInfoInput['bio']
}