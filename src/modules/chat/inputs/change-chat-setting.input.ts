import { Field, InputType } from "@nestjs/graphql";
import z from "zod";

const changeChatSettingsInputSchema = z.object({
  isChatEnabled: z.boolean(),
  isChatFollowersOnly: z.boolean(),
  isChatPremiumFollowersOnly: z.boolean(),
})

export type TChangeChatSettingsInput = z.infer<typeof changeChatSettingsInputSchema>

@InputType()
export class ChangeChatSettingsInput {
  @Field(() => Boolean)
  isChatEnabled: TChangeChatSettingsInput['isChatEnabled']

  @Field(() => Boolean)
  isChatFollowersOnly: TChangeChatSettingsInput['isChatFollowersOnly']

  @Field(() => Boolean)
  isChatPremiumFollowersOnly: TChangeChatSettingsInput['isChatPremiumFollowersOnly']
}