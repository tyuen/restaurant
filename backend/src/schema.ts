import { relations } from "drizzle-orm";
import {
  pgTable,
  index,
  text,
  serial,
  bigserial,
  integer,
  decimal,
  pgEnum,
  primaryKey,
  timestamp,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("roles", ["customer", "merchant"]);

export const users = pgTable("users", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  userName: text("userName").unique().notNull(),
  password: text("password").notNull(),
  role: roleEnum("role").default("customer"),
});

export const customers = pgTable("customers", {
  id: integer("id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name"),
  email: text("email"),
});

export const merchantTypes = pgTable("merchantTypes", {
  id: serial("id").primaryKey(),
  type: text("type").unique().notNull(),
});

export const merchants = pgTable("merchants", {
  id: integer("id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name"),
  address: text("address"),
  type: integer("typeId").references(() => merchantTypes.id, {
    onDelete: "set null",
  }),
});

export const customerFavorites = pgTable(
  "customerFavorites",
  {
    customerId: integer("customerId")
      .notNull()
      .references(() => customers.id, { onDelete: "cascade" }),
    merchantId: integer("merchantId")
      .notNull()
      .references(() => merchants.id, { onDelete: "cascade" }),
  },
  table => ({
    compoundPk: primaryKey({ columns: [table.customerId, table.merchantId] }),
    customerIdx: index("customer_idx").on(table.customerId),
  }),
);

export const merchantProducts = pgTable("merchantProducts", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  merchantId: integer("merchantId")
    .notNull()
    .references(() => merchants.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  price: decimal("price", { precision: 18, scale: 8 }),
});

export const orders = pgTable("orders", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  customerId: integer("customerId")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
  merchantId: integer("merchantId")
    .notNull()
    .references(() => merchants.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const orderedItems = pgTable("orderedItems", {
  orderId: integer("orderId")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("productId")
    .notNull()
    .references(() => merchantProducts.id, { onDelete: "cascade" }),
  price: decimal("price", { precision: 18, scale: 8 }),
  quantity: integer("quantity").notNull(),
});

// ** relations **

export const userRelations = relations(users, ({ one }) => ({
  customer: one(customers, { fields: [users.id], references: [customers.id] }),
  merchant: one(merchants, { fields: [users.id], references: [merchants.id] }),
}));

export const customerRelations = relations(customers, ({ many }) => ({
  favorites: many(customerFavorites),
  orders: many(orders),
}));

export const merchantRelations = relations(merchants, ({ one, many }) => ({
  type: one(merchantTypes, {
    fields: [merchants.type],
    references: [merchantTypes.id],
  }),
  orders: many(orders),
  products: many(merchantProducts),
}));

export const merchantTypeRelations = relations(merchantTypes, ({ many }) => ({
  merchants: many(merchants),
}));

export const customerFavoriteRelations = relations(
  customerFavorites,
  ({ one }) => ({
    customer: one(customers, {
      fields: [customerFavorites.customerId],
      references: [customers.id],
    }),
    merchant: one(merchants, {
      fields: [customerFavorites.merchantId],
      references: [merchants.id],
    }),
  }),
);

export const merchantProductRelations = relations(
  merchantProducts,
  ({ one, many }) => ({
    merchant: one(merchants, {
      fields: [merchantProducts.merchantId],
      references: [merchants.id],
    }),
    orderItems: many(orderedItems),
  }),
);

export const orderRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  merchant: one(merchants, {
    fields: [orders.merchantId],
    references: [merchants.id],
  }),
  items: many(orderedItems),
}));

export const orderedItemRelations = relations(
  orderedItems,
  ({ one, many }) => ({
    order: one(orders, {
      fields: [orderedItems.orderId],
      references: [orders.id],
    }),
    product: one(merchantProducts, {
      fields: [orderedItems.productId],
      references: [merchantProducts.id],
    }),
  }),
);
