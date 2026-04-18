-- AlterTable
ALTER TABLE "sources" ADD COLUMN     "config" JSONB NOT NULL DEFAULT '{}';
