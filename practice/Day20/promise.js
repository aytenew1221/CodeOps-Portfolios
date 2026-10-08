// PROMISE.ALL()

async function loadPostsAndDetails() {
  try {
    // Step 1: Get the list
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const posts = await res.json();

    // Step 2: Get first two items
    const firstTwo = posts.slice(0, 2);

    console.log("First two posts:", firstTwo);

    // Step 3: Fetch both details in parallel
    const details = await Promise.all(
      firstTwo.map(async (post) => {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${post.id}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        return response.json();
      }),
    );

    console.log("Details:", details);
  } catch (error) {
    console.error("Failed:", error.message);
  }
}

loadPostsAndDetails();
