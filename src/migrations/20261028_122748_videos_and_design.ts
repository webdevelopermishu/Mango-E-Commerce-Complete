import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_videos_orientation" AS ENUM('portrait', 'landscape');
  CREATE TYPE "public"."enum_videos_status" AS ENUM('published', 'draft');
  CREATE TYPE "public"."enum_videos_translation_status" AS ENUM('complete', 'missing_en', 'missing_bn', 'missing_both');
  CREATE TABLE "videos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer NOT NULL,
  	"poster_id" integer,
  	"orientation" "enum_videos_orientation" DEFAULT 'portrait' NOT NULL,
  	"status" "enum_videos_status" DEFAULT 'published' NOT NULL,
  	"show_in_reels" boolean DEFAULT true,
  	"sort_order" numeric DEFAULT 0,
  	"translation_status" "enum_videos_translation_status" DEFAULT 'missing_en',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "videos_locales" (
  	"title" varchar NOT NULL,
  	"label" varchar,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "videos_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  CREATE TABLE "video_files" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "homepage_marquee_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "homepage_marquee_items_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_story_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "homepage_story_steps_locales" (
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "categories" ADD COLUMN "cutout_id" integer;
  ALTER TABLE "categories" ADD COLUMN "tint" varchar;
  ALTER TABLE "categories" ADD COLUMN "coming_soon" boolean DEFAULT false;
  ALTER TABLE "categories_locales" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "videos_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "video_files_id" integer;
  ALTER TABLE "homepage" ADD COLUMN "hero_video_id" integer;
  ALTER TABLE "homepage" ADD COLUMN "marquee_enabled" boolean DEFAULT true;
  ALTER TABLE "homepage" ADD COLUMN "story_video_id" integer;
  ALTER TABLE "homepage" ADD COLUMN "reels_enabled" boolean DEFAULT true;
  ALTER TABLE "homepage" ADD COLUMN "reels_limit" numeric DEFAULT 8;
  ALTER TABLE "homepage_locales" ADD COLUMN "categories_section_link_label" varchar;
  ALTER TABLE "homepage_locales" ADD COLUMN "story_eyebrow" varchar;
  ALTER TABLE "homepage_locales" ADD COLUMN "reels_heading" varchar;
  ALTER TABLE "homepage_locales" ADD COLUMN "reels_intro" varchar;
  ALTER TABLE "homepage_rels" ADD COLUMN "videos_id" integer;
  ALTER TABLE "videos" ADD CONSTRAINT "videos_file_id_video_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."video_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "videos" ADD CONSTRAINT "videos_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "videos_locales" ADD CONSTRAINT "videos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "videos_rels" ADD CONSTRAINT "videos_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "videos_rels" ADD CONSTRAINT "videos_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_marquee_items" ADD CONSTRAINT "homepage_marquee_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_marquee_items_locales" ADD CONSTRAINT "homepage_marquee_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_marquee_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_story_steps" ADD CONSTRAINT "homepage_story_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_story_steps_locales" ADD CONSTRAINT "homepage_story_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_story_steps"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "videos_file_idx" ON "videos" USING btree ("file_id");
  CREATE INDEX "videos_poster_idx" ON "videos" USING btree ("poster_id");
  CREATE INDEX "videos_updated_at_idx" ON "videos" USING btree ("updated_at");
  CREATE INDEX "videos_created_at_idx" ON "videos" USING btree ("created_at");
  CREATE UNIQUE INDEX "videos_locales_locale_parent_id_unique" ON "videos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "videos_locales_parent_id_idx" ON "videos_locales" USING btree ("_parent_id");
  CREATE INDEX "videos_rels_order_idx" ON "videos_rels" USING btree ("order");
  CREATE INDEX "videos_rels_parent_idx" ON "videos_rels" USING btree ("parent_id");
  CREATE INDEX "videos_rels_path_idx" ON "videos_rels" USING btree ("path");
  CREATE INDEX "videos_rels_products_id_idx" ON "videos_rels" USING btree ("products_id");
  CREATE INDEX "video_files_updated_at_idx" ON "video_files" USING btree ("updated_at");
  CREATE INDEX "video_files_created_at_idx" ON "video_files" USING btree ("created_at");
  CREATE UNIQUE INDEX "video_files_filename_idx" ON "video_files" USING btree ("filename");
  CREATE INDEX "homepage_marquee_items_order_idx" ON "homepage_marquee_items" USING btree ("_order");
  CREATE INDEX "homepage_marquee_items_parent_id_idx" ON "homepage_marquee_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_marquee_items_locales_locale_parent_id_unique" ON "homepage_marquee_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_marquee_items_locales_parent_id_idx" ON "homepage_marquee_items_locales" USING btree ("_parent_id");
  CREATE INDEX "homepage_story_steps_order_idx" ON "homepage_story_steps" USING btree ("_order");
  CREATE INDEX "homepage_story_steps_parent_id_idx" ON "homepage_story_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_story_steps_locales_locale_parent_id_unique" ON "homepage_story_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_story_steps_locales_parent_id_idx" ON "homepage_story_steps_locales" USING btree ("_parent_id");
  ALTER TABLE "categories" ADD CONSTRAINT "categories_cutout_id_media_id_fk" FOREIGN KEY ("cutout_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_videos_fk" FOREIGN KEY ("videos_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_video_files_fk" FOREIGN KEY ("video_files_id") REFERENCES "public"."video_files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_video_id_videos_id_fk" FOREIGN KEY ("hero_video_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_story_video_id_videos_id_fk" FOREIGN KEY ("story_video_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_videos_fk" FOREIGN KEY ("videos_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "categories_cutout_idx" ON "categories" USING btree ("cutout_id");
  CREATE INDEX "payload_locked_documents_rels_videos_id_idx" ON "payload_locked_documents_rels" USING btree ("videos_id");
  CREATE INDEX "payload_locked_documents_rels_video_files_id_idx" ON "payload_locked_documents_rels" USING btree ("video_files_id");
  CREATE INDEX "homepage_hero_hero_video_idx" ON "homepage" USING btree ("hero_video_id");
  CREATE INDEX "homepage_story_story_video_idx" ON "homepage" USING btree ("story_video_id");
  CREATE INDEX "homepage_rels_videos_id_idx" ON "homepage_rels" USING btree ("videos_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "videos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "videos_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "videos_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "video_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_marquee_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_marquee_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_story_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_story_steps_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "videos" CASCADE;
  DROP TABLE "videos_locales" CASCADE;
  DROP TABLE "videos_rels" CASCADE;
  DROP TABLE "video_files" CASCADE;
  DROP TABLE "homepage_marquee_items" CASCADE;
  DROP TABLE "homepage_marquee_items_locales" CASCADE;
  DROP TABLE "homepage_story_steps" CASCADE;
  DROP TABLE "homepage_story_steps_locales" CASCADE;
  ALTER TABLE "categories" DROP CONSTRAINT "categories_cutout_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_videos_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_video_files_fk";
  
  ALTER TABLE "homepage" DROP CONSTRAINT "homepage_hero_video_id_videos_id_fk";
  
  ALTER TABLE "homepage" DROP CONSTRAINT "homepage_story_video_id_videos_id_fk";
  
  ALTER TABLE "homepage_rels" DROP CONSTRAINT "homepage_rels_videos_fk";
  
  DROP INDEX "categories_cutout_idx";
  DROP INDEX "payload_locked_documents_rels_videos_id_idx";
  DROP INDEX "payload_locked_documents_rels_video_files_id_idx";
  DROP INDEX "homepage_hero_hero_video_idx";
  DROP INDEX "homepage_story_story_video_idx";
  DROP INDEX "homepage_rels_videos_id_idx";
  ALTER TABLE "categories" DROP COLUMN "cutout_id";
  ALTER TABLE "categories" DROP COLUMN "tint";
  ALTER TABLE "categories" DROP COLUMN "coming_soon";
  ALTER TABLE "categories_locales" DROP COLUMN "subtitle";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "videos_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "video_files_id";
  ALTER TABLE "homepage" DROP COLUMN "hero_video_id";
  ALTER TABLE "homepage" DROP COLUMN "marquee_enabled";
  ALTER TABLE "homepage" DROP COLUMN "story_video_id";
  ALTER TABLE "homepage" DROP COLUMN "reels_enabled";
  ALTER TABLE "homepage" DROP COLUMN "reels_limit";
  ALTER TABLE "homepage_locales" DROP COLUMN "categories_section_link_label";
  ALTER TABLE "homepage_locales" DROP COLUMN "story_eyebrow";
  ALTER TABLE "homepage_locales" DROP COLUMN "reels_heading";
  ALTER TABLE "homepage_locales" DROP COLUMN "reels_intro";
  ALTER TABLE "homepage_rels" DROP COLUMN "videos_id";
  DROP TYPE "public"."enum_videos_orientation";
  DROP TYPE "public"."enum_videos_status";
  DROP TYPE "public"."enum_videos_translation_status";`)
}
