import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products_attributes_locales" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "products_attributes_locales" ALTER COLUMN "value" DROP NOT NULL;
  ALTER TABLE "products_variants_locales" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "products_locales" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "categories_locales" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "videos_locales" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "faqs_locales" ALTER COLUMN "question" DROP NOT NULL;
  ALTER TABLE "faqs_locales" ALTER COLUMN "answer" DROP NOT NULL;
  ALTER TABLE "testimonials_locales" ALTER COLUMN "quote" DROP NOT NULL;
  ALTER TABLE "posts_locales" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "pages_locales" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "homepage_benefits_locales" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "homepage_marquee_items_locales" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "homepage_story_steps_locales" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "homepage_locales" ALTER COLUMN "hero_headline" DROP NOT NULL;
  ALTER TABLE "branding_locales" ALTER COLUMN "brand_name" DROP NOT NULL;
  ALTER TABLE "branding_locales" ALTER COLUMN "site_title" DROP NOT NULL;
  ALTER TABLE "navigation_header_links_locales" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "navigation_footer_columns_links_locales" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "navigation_footer_columns_locales" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "delivery_settings_zones_locales" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "delivery_settings_methods_locales" ALTER COLUMN "name" DROP NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products_attributes_locales" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "products_attributes_locales" ALTER COLUMN "value" SET NOT NULL;
  ALTER TABLE "products_variants_locales" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "products_locales" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "categories_locales" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "videos_locales" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "faqs_locales" ALTER COLUMN "question" SET NOT NULL;
  ALTER TABLE "faqs_locales" ALTER COLUMN "answer" SET NOT NULL;
  ALTER TABLE "testimonials_locales" ALTER COLUMN "quote" SET NOT NULL;
  ALTER TABLE "posts_locales" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "pages_locales" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "homepage_benefits_locales" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "homepage_marquee_items_locales" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "homepage_story_steps_locales" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "homepage_locales" ALTER COLUMN "hero_headline" SET NOT NULL;
  ALTER TABLE "branding_locales" ALTER COLUMN "brand_name" SET NOT NULL;
  ALTER TABLE "branding_locales" ALTER COLUMN "site_title" SET NOT NULL;
  ALTER TABLE "navigation_header_links_locales" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "navigation_footer_columns_links_locales" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "navigation_footer_columns_locales" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "delivery_settings_zones_locales" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "delivery_settings_methods_locales" ALTER COLUMN "name" SET NOT NULL;`)
}
