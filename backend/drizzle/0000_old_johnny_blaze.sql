DO $$ BEGIN
 CREATE TYPE "roles" AS ENUM('customer', 'merchant');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customerFavorites" (
	"customerId" integer NOT NULL,
	"merchantId" integer NOT NULL,
	CONSTRAINT "customerFavorites_customerId_merchantId_pk" PRIMARY KEY("customerId","merchantId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customers" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text,
	"email" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "merchantProducts" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"merchantId" integer NOT NULL,
	"name" text NOT NULL,
	"price" numeric(18, 8)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "merchantTypes" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	CONSTRAINT "merchantTypes_type_unique" UNIQUE("type")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "merchants" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text,
	"address" text,
	"typeId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orderedItems" (
	"orderId" integer NOT NULL,
	"productId" integer NOT NULL,
	"price" numeric(18, 8),
	"quantity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"customerId" integer NOT NULL,
	"merchantId" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"userName" text NOT NULL,
	"password" text NOT NULL,
	"role" "roles" DEFAULT 'customer',
	CONSTRAINT "users_userName_unique" UNIQUE("userName")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customer_idx" ON "customerFavorites" ("customerId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customerFavorites" ADD CONSTRAINT "customerFavorites_customerId_customers_id_fk" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customerFavorites" ADD CONSTRAINT "customerFavorites_merchantId_merchants_id_fk" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customers" ADD CONSTRAINT "customers_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "merchantProducts" ADD CONSTRAINT "merchantProducts_merchantId_merchants_id_fk" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "merchants" ADD CONSTRAINT "merchants_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "merchants" ADD CONSTRAINT "merchants_typeId_merchantTypes_id_fk" FOREIGN KEY ("typeId") REFERENCES "merchantTypes"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderedItems" ADD CONSTRAINT "orderedItems_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderedItems" ADD CONSTRAINT "orderedItems_productId_merchantProducts_id_fk" FOREIGN KEY ("productId") REFERENCES "merchantProducts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_customers_id_fk" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_merchantId_merchants_id_fk" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
