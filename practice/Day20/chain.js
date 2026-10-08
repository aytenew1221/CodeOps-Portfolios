// FETCH → JSON → RENDER
// async/await

async function loadPost() {
  try {
    // Step 1: Fetch
    const res = await fetch("https://jsonplaceholder.typicode.com/posts/1");

    // Check HTTP response
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    // Step 2: Convert response to JSON
    const data = await res.json();

    // Step 3: Render
    renderPost(data);
  } catch (error) {
    console.error("Failed to load post:", error.message);
  }
}

// Render the post
function renderPost(post) {
  console.log("Title:", post.title);
  console.log("Body:", post.body);
}

loadPost();
