import { Field, InputType } from "@nestjs/graphql";
import z from "zod";

const createPlanInputSchema = z.object({
  title: z.string().trim(),
  description: z.string().trim().optional(),
  price: z.number(),
})

export type TCreatePlanInput = z.infer<typeof createPlanInputSchema>

@InputType()
export class CreatePlanInput {
  @Field(() => String)
  title: TCreatePlanInput['title']

  @Field(() => String, { nullable: true })
  description?: TCreatePlanInput['description']

  @Field(() => Number)
  price: TCreatePlanInput['price']
}