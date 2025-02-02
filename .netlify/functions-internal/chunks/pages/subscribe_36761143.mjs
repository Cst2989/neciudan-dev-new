const prerender = false;
const POST = async ({ request }) => {
  let email = null;
  try {
    if (request.headers.get("content-type")?.includes("application/json")) {
      const json = await request.json();
      email = json.email;
    } else {
      const formData = await request.formData();
      email = formData.get("email")?.toString() || null;
    }
    if (!email) {
      return new Response(JSON.stringify({
        error: "Email is required"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    fetch(
      `${"https://script.google.com/macros/s/AKfycbxryrtFvjtWEpC0L1hyeLwiPu0u4BwgBIj66bR5gtF53RVDg-RH2OavosYJ8vkWt_41/exec"}?email=` + encodeURIComponent(email) + "&callback=?",
      {
        method: "GET",
        mode: "no-cors"
      }
    ).catch((error) => {
      console.log("Google Apps Script request error:", error);
    });
    return new Response(JSON.stringify({
      message: "Subscribed successfully"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Subscription error:", error);
    return new Response(JSON.stringify({
      error: "Failed to subscribe"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

export { POST, prerender };
