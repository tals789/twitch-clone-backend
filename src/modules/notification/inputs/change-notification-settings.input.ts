import { Field, InputType } from "@nestjs/graphql";
import z from "zod";

const changeNotificationsSettingsInputSchema = z.object({
  siteNotifications: z.boolean(),
  telegramNotifications: z.boolean(),
})

export type TChangeNotificationsSettingsInput = z.infer<typeof changeNotificationsSettingsInputSchema>

@InputType()
export class ChangeNotificationsSettingsInput {
  @Field(() => Boolean)
  siteNotifications: TChangeNotificationsSettingsInput['siteNotifications']
 
  @Field(() => Boolean)
  telegramNotifications: TChangeNotificationsSettingsInput['telegramNotifications'] 
}