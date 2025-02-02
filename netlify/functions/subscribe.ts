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

    // Parse the body based on content type
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

    console.log('Sending request to:', process.env.PUBLIC_GOOGLE_SCRIPT_URL);
    console.log('Email:', email);
    
    // Send request to Google Apps Script
    await fetch(
      `${process.env.PUBLIC_GOOGLE_SCRIPT_URL}` + 
      '?email=' + encodeURIComponent(email) +
      '&callback=?',
      {
        method: 'GET',
        mode: 'no-cors'
      }
    ).catch(error => {
      console.log('Google Apps Script request error:', error);
      throw error; // Re-throw to be caught by outer try-catch
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Subscribed successfully' }),
    };
  } catch (error) {
    console.error('Subscription error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: String(error) }),
    };
  }
}; 
