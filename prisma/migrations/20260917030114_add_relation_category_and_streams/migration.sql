-- DropForeignKey
ALTER TABLE "streams" DROP CONSTRAINT "streams_category_id_fkey";

-- AlterTable
ALTER TABLE "streams" ALTER COLUMN "category_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "streams" ADD CONSTRAINT "streams_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
