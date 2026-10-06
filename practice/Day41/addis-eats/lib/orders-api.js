import { getOrder as getOrderFromStore } from "./orders";

export async function getOrder(id) {
  return getOrderFromStore(id);
}
