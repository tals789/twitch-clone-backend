import { Field, InputType } from "@nestjs/graphql";
import z from "zod";

const socialLinkSchema = z.object({
  title: z.string().trim(),
  url: z.string().trim(),
})

export type TSocialLinkInput = z.infer<typeof socialLinkSchema>

@InputType()
export class SocialLinkInput {
  @Field(() => String)
  title: TSocialLinkInput['title']

  @Field(() => String)
  url: TSocialLinkInput['url']
}

const socialLinkOrderSchema = z.object({
  id: z.string().trim(),
  position: z.number()
})

export type TSocialLinkOrderInput = z.infer<typeof socialLinkOrderSchema>

@InputType()
export class SocialLinkOrderInput {
  @Field(() => String)
  id: TSocialLinkOrderInput['id']

  @Field(() => Number)
  position: TSocialLinkOrderInput['position']
}