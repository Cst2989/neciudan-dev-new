import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let email: string | null = null;

  try {
    if (request.headers.get('content-type')?.includes('application/json')) {
      const json = await request.json();
      email = json.email;
    } else {
      const formData = await request.formData();
      email = formData.get('email')?.toString() || null;
    }

    if (!email) {
      return new Response(JSON.stringify({
        error: 'Email is required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Send request to Google Apps Script using env variable
    fetch(
      `${import.meta.env.PUBLIC_GOOGLE_SCRIPT_URL}` + 
      '?email=' + encodeURIComponent(email) +
      '&callback=?',
      {
        method: 'GET',
        mode: 'no-cors'
      }
    ).catch(error => {
      // Log but don't throw the error since we can't read the response anyway
      console.log('Google Apps Script request error:', error);
    });

    // Return success immediately after sending the request
    return new Response(JSON.stringify({
      message: 'Subscribed successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to subscribe'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
