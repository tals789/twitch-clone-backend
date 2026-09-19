import { Field, InputType } from "@nestjs/graphql";
import z from "zod";

const filtersInputSchema = z.object({
  take: z.number().optional(),
  skip: z.number().optional(),
  searchTerm: z.string().optional(),
})

export type TFiltersInput = z.infer<typeof filtersInputSchema>

@InputType()
export class FiltersInput {
  @Field(() => Number, { nullable: true })
  take?: TFiltersInput['take']

  @Field(() => Number, { nullable: true })
  skip?: TFiltersInput['skip']

  @Field(() => String, { nullable: true })
  searchTerm?: TFiltersInput['searchTerm']
}