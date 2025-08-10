"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartItemTable, cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { addProductToCartSchema } from "./schema";

export const addProductToCart = async (data: addProductToCartSchema) => {
  // check if the data is valid
  addProductToCartSchema.parse(data);
  // verify session user
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // the product with this ID exists
  const productVariant = await db.query.productVariantTable.findFirst({
    where: (productVariant, { eq }) =>
      eq(productVariant.id, data.productVariantId),
  });

  if (!productVariant) {
    throw new Error("Product variant not found");
  }

  // take the cart
  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
  });

  // if you don't have a cart, create one
  let cartId: string | undefined;

  if (!cartId) {
    const [newCart] = await db
      .insert(cartTable)
      .values({ userId: session.user.id })
      .returning();

    cartId = newCart.id;
  }

  // check if the variant already exists in the cart
  const cartItem = await db.query.cartItemTable.findFirst({
    where: (cartItem, { eq }) =>
      eq(cartItem.cartId, cartId) &&
      eq(cartItem.productVariantId, data.productVariantId),
  });

  // if it exists, update the quantity
  if (cartItem) {
    await db
      .update(cartItemTable)
      .set({
        quantity: cartItem.quantity + data.quantity,
      })
      .where(eq(cartItemTable.id, cartItem.id));
    return;
  }

  // If it does not exist, create a new item
  await db.insert(cartItemTable).values({
    cartId,
    productVariantId: data.productVariantId,
    quantity: data.quantity,
  });
};
