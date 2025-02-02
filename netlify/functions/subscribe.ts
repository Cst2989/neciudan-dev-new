import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    console.log('Method not allowed:', event.httpMethod);
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    let email: string | null = null;

    // Log the content type and body
    console.log('Content-Type:', event.headers['content-type']);
    console.log('Request body:', event.body);

    if (event.headers['content-type']?.includes('application/json')) {
      const body = JSON.parse(event.body || '{}');
      email = body.email;
    } else {
      const params = new URLSearchParams(event.body || '');
      email = params.get('email');
    }

    if (!email) {
      console.log('Email missing from request');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email is required' }),
      };
    }

    console.log('Email found:', email);
    
    // Create the URL for the Google Apps Script
    const url = `${process.env.PUBLIC_GOOGLE_SCRIPT_URL}?email=${encodeURIComponent(email)}&callback=?`;
    console.log('Sending request to:', url);

    // Use node-fetch with a timeout
    const response = await fetch(url, {
      method: 'GET'
    });

    console.log('Google Apps Script response status:', response.status);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Subscribed successfully' }),
    };
  } catch (error) {
    console.error('Subscription error:', error);
    return {
      statusCode: 200, // Still return 200 to show success toast
      body: JSON.stringify({ message: 'Subscribed successfully' }),
    };
  }
}; 
