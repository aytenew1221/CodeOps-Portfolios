export async function submitOrder(order) {
  // Simulate network delay
  await new Promise((resolve) => {
    setTimeout(resolve, 1500);
  });

  /*
    TEST FAILED REQUEST:

    If the notes contain "fail",
    the request will fail.

    Example:

    "Please fail this request"
  */

  if (order.notes.trim().toLowerCase().includes("fail")) {
    throw new Error(
      "The order server rejected the request. Your information has been kept. Please try again.",
    );
  }

  return {
    success: true,
    orderId: `AE-${Date.now()}`,
  };
}
