---
title: 'Building a Substack-like Subscribe Feature'
excerpt: 'Learn how to implement a newsletter subscription system using Astro, Netlify Functions, and Google Sheets - a free alternative to paid newsletter platforms.'
publishDate: 2025-02-02
image: '/images/articles/subscribe-feature.png'
category: 'Development'
readTime: '7 min read'
---

I always debated between using a blog platform like Medium or Substack and building my own. 

I love the idea of having complete control over the user experience, but I also acknowledge that building a newsletter platform is not an easy task. Plus I actually really enjoy the look and feel Substack has. 

By first showcasingIn the article's header, on the first screen, the authors story and what his writing is all about, with a subscribe form right below. You instantly get the value proposition if you are interested in what he writes.

Then, in case you haven't subscribed yet, while you are reading the article, the page gets darker and darker until the only thing visible is a Subscribedialog box which slowly animates up from the bottom of the page. Very mindful, very demure.

I loved this feature so much that I tried replicating it as closely as possible using simple database solutions.

Spoiler alert: If you are reading this on my blog, odds are you have already seen the header and the dialog. If you liked it in action, here is how I built it: 

## The Requirements

Here's what we need:
- A subscription form in the author profile section
- A popup dialog that appears while reading
- Email storage in Google Sheets
- Loading states and error handling
- Cross-component communication for subscription status

## The Implementation

Currently this blog is built on Astro, specifically its using the `astrowind` open source project. You can check it out <a href="https://github.com/onwidget/astrowind" target="_blank">here</a>

All my code is not Astro specific, it's normal Javascript code with some Server Side Logic behind it. The only thing platform specific is the deployment to Netlify, but I show how you can easily replicate it on Vercel if thats your poison.

A small note: I intentionally wrote the code in a way that it's not Astro specific, so you can easily replicate it on any other framework, by manipulating the DOM directly and using native Javascript methods. Doing it this way makes it easier to understand and more importantly it's easier to replicate in your own project that might use a different framework. 

### 1. The Author Profile Component

Let's get started. The first touchpoint for newsletter subscriptions is the AuthorProfile component. It appears immediately after the article content, making it visible in the first fold when readers start your post - the perfect moment to capture their interest.

Here's how we structured it:

```astro
<form id="inlineSubscribeForm" class="flex flex-col sm:flex-row gap-2 py-6">
  <input
    type="email"
    name="email"
    placeholder="Type your email..."
    class="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#1e2432]"
    required
  />
  <button type="submit" class="submit-btn px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
    <span class="normal-text">Subscribe</span>
    <span class="loading-text hidden">
      <svg class="animate-spin h-5 w-5 inline mr-2"></svg>
      Subscribing...
    </span>
  </button>
</form>
```

The form is intentionally simple - just an email input and a submit button. But the magic happens in the interaction details:

1. The form uses a flex layout that stacks vertically on mobile but sits side-by-side on larger screens
2. The input field expands to take available space while the button maintains a fixed width
3. The button includes both normal and loading states, with a spinning SVG animation

When a user submits their email, we handle it like this:

```javascript
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target as HTMLFormElement);
  const email = formData.get('email');
  const submitBtn = form.querySelector('button[type="submit"]');
  const normalText = submitBtn.querySelector('.normal-text');
  const loadingText = submitBtn.querySelector('.loading-text');

  // Show loading state
  submitBtn.disabled = true;
  normalText.classList.add('hidden');
  loadingText.classList.remove('hidden');

  try {
    const response = await fetch('/.netlify/functions/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (!response.ok) throw new Error('Subscription failed');

    // Store subscription status
    localStorage.setItem('newsletterSubscribed', 'true');
    form.style.display = 'none';
    Toast.show('Thank you for subscribing! 🎉');
    
  } catch (error) {
    Toast.show('Sorry, there was an error. Please try again later.', 'error');
    
    // Reset button state
    submitBtn.disabled = false;
    normalText.classList.remove('hidden');
    loadingText.classList.add('hidden');
  }
});
```

We get the values from the form, show a loading state, and then call the serverless function to store the email in Google Sheets. 

After we receive a response from the serverless function, we store the subscription status in localStorage and hide the form. 

On the right side of the page, a nice looking toast will appear showing our success or error message. 

### The Toast Notification System

This is the Toast component that shows temporary notifications in the bottom-right corner of the screen. 

```typescript
class Toast {
  private static container: HTMLDivElement;

  static show(message: string, type: 'success' | 'error' = 'success') {
    // Initialize container if needed
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2';
      document.body.appendChild(this.container);
    }

    // Create and style the toast
    const toast = document.createElement('div');
    toast.className = `
      transform transition-all duration-300 ease-out translate-x-full
      px-4 py-2 rounded-lg shadow-lg
      ${type === 'success' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}
    `;
    toast.textContent = message;

    // Add to container and animate in
    this.container.appendChild(toast);
    setTimeout(() => toast.classList.remove('translate-x-full'), 10);

    // Remove after delay
    setTimeout(() => {
      toast.classList.add('translate-x-full', 'opacity-0');
      setTimeout(() => this.container.removeChild(toast), 300);
    }, 3000);
  }
}
```

We use the Toast to either show a success message or an error message when the user submits their email. If you want to try it out, you can use the form in the header of this page, if you haven't already! 

### 2. The Subscription Dialog

The most distinctive feature of Substack is its subscription dialog that appears as you scroll through an article. The page gracefully dims, and a dialog slides up from the bottom, creating an engaging but non-intrusive prompt for subscription. Let's recreate this effect.

First, the HTML structure:

```astro
<div id="overlay"></div>
<div id="dialog">
  <button id="close">✕</button>
  <div class="content">
    <img src="/images/logo.png" alt="Author" />
    <h2>Discover more from The Neciu Dan Newsletter</h2>
    <p class="description">A weekly column on Tech & Education, startup building and occasional hot takes.</p>
    <p class="subscribers">Over 1,000 subscribers</p>
    <form id="subscribeForm">
      <input type="email" name="email" placeholder="Type your email..." required />
      <button type="submit" class="submit-btn">
        <span class="normal-text">Subscribe</span>
        <span class="loading-text hidden">
          <svg class="animate-spin h-5 w-5 inline"><!-- Loading spinner SVG --></svg>
          Subscribing...
        </span>
      </button>
    </form>
  </div>
</div>
```

The over 1000 subscriber test is hardcoded and whishfull thinking! Here is how we style the dialog and the overlay:

```scss
#overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  pointer-events: none;
  z-index: 40;
}

#dialog {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 2rem;
  transform: translateY(100%);
  transition: transform 0.3s ease-in-out;
  z-index: 50;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  
  &.visible {
    transform: translateY(0);
  }
}

.overlay-visible {
  opacity: 1 !important;
  pointer-events: auto !important;
}
```

Nothing too fancy, to make it really cool we need a touch of Javascript.

```javascript
const dialog = document.getElementById('dialog');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('close');

// Only show if user hasn't subscribed
if (localStorage.getItem('newsletterSubscribed') !== 'true') {
  let lastScrollPosition = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    lastScrollPosition = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        // Show dialog after scrolling 30% of the article
        const scrollPercentage = (lastScrollPosition / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        if (scrollPercentage > 30) {
          dialog.classList.add('visible');
          overlay.classList.add('overlay-visible');
        }
        
        ticking = false;
      });

      ticking = true;
    }
  });
}

// Handle close button
closeBtn.addEventListener('click', () => {
  dialog.classList.remove('visible');
  overlay.classList.remove('overlay-visible');
});

// Handle form submission
const form = document.getElementById('subscribeForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target as HTMLFormElement);
  const email = formData.get('email');
  const submitBtn = form.querySelector('button[type="submit"]');
  const normalText = submitBtn.querySelector('.normal-text');
  const loadingText = submitBtn.querySelector('.loading-text');

  // Show loading state
  submitBtn.disabled = true;
  normalText.classList.add('hidden');
  loadingText.classList.remove('hidden');

  try {
    const response = await fetch('/.netlify/functions/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (!response.ok) throw new Error('Subscription failed');

    // Store subscription status and notify other components
    localStorage.setItem('newsletterSubscribed', 'true');
    window.dispatchEvent(new CustomEvent('newsletter:subscribed'));
    
    // Hide dialog and show success message
    dialog.classList.remove('visible');
    overlay.classList.remove('overlay-visible');
    Toast.show('Thank you for subscribing! 🎉');
    
  } catch (error) {
    Toast.show('Sorry, there was an error. Please try again later.', 'error');
    
    // Reset button state
    submitBtn.disabled = false;
    normalText.classList.remove('hidden');
    loadingText.classList.add('hidden');
  }
});
```

PS: Make sure you remove the scroll listener when leaving the page. 

```javascript
// Clean up on page unload
  document.addEventListener('astro:before-swap', () => {
    window.removeEventListener('scroll', handleScroll);
  });
```

OK. Maybe a little more than a touch of Javascript. But it's not rocket science. Here is what's happening: 

1. Scroll position tracking with requestAnimationFrame for performance
2. CSS transforms for smooth animations
3. Local storage to remember subscribed users
4. Custom events to communicate between components

When a user subscribes, we:
1. Store their subscription status in localStorage
2. Dispatch a custom event that other components (like AuthorProfile) listen for
2. Hide the dialog with a smooth animation
3. Show a success toast notification

This creates a seamless experience where users only see the subscription prompt once, and all components stay in sync with the subscription status. 

We also want to make sure we are not annoying the user with the dialog. So if they close it we dont open it again in this session. 

### 3. The Backend with Netlify Functions

Before we dive into the serverless functions, we need to configure Astro to work with our chosen platform. First, install the appropriate adapter:

For Netlify:
```bash
npm install @astrojs/netlify
```

Or for Vercel:
```bash
npm install @astrojs/vercel
```

Then update your `astro.config.mjs`:

```typescript
import { defineConfig } from 'astro/config';

// For Netlify
import netlify from '@astrojs/netlify/functions';

// Or for Vercel
// import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'hybrid',  // Enable server-side rendering
  adapter: netlify(), // Or vercel() if using Vercel
});
```

The `output: 'hybrid'` setting is crucial - it allows us to mix static pages with server-side functionality. This means your blog posts remain static (fast and SEO-friendly) while the subscription functionality runs on the server.

Now let's implement our serverless function...

#### Using Netlify Functions

Create a new file at `.netlify/functions/subscribe.ts`:

```typescript
import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  try {
    const { email } = JSON.parse(event.body || '{}');
    
    // Send to Google Sheets via Apps Script
    await fetch(
      `${process.env.PUBLIC_GOOGLE_SCRIPT_URL}?email=${encodeURIComponent(email)}`,
      { method: 'GET' }
    );

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
```

#### Using Vercel Edge Functions

Alternatively, if you're hosting on Vercel, create a file at `api/subscribe.ts`:

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    const { email } = request.body;
    
    // Send to Google Sheets via Apps Script
    await fetch(
      `${process.env.PUBLIC_GOOGLE_SCRIPT_URL}?email=${encodeURIComponent(email)}`,
      { method: 'GET' }
    );

    return response.status(200).json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Subscription error:', error);
    return response.status(500).json({ error: String(error) });
  }
}
```

The only difference in your frontend code would be the endpoint URL:
- For Netlify: `/.netlify/functions/subscribe`
- For Vercel: `/api/subscribe`

Both platforms offer:
- Automatic HTTPS
- Environment variable management
- Zero configuration needed
- Free tier that's more than enough for newsletter subscriptions

Just make sure to add your `PUBLIC_GOOGLE_SCRIPT_URL` to your environment variables in your platform's dashboard. In Netlify, go to Site settings > Build & deploy > Environment. In Vercel, go to Project settings > Environment Variables.

And in your local environment you need to add it your .env file. 

The function is intentionally simple - it takes an email from the request body, forwards it to your Google Sheet, and returns a success or error response. Error handling ensures your users get appropriate feedback if something goes wrong.

The main reason we are using an edge function instead of calling the Google Sheep App directly is that we want to hide the URL of our Google Sheet from the public. 

Same reason why we use a variable in our URL to not expose the Google Sheet URL on Github. 

### 4. Google Sheets as a Database

For storage, we created a Google Sheet and published it as a web app using Google Apps Script. This gives us a free, simple database that we can easily export or manipulate.

First, create a new Google Sheet with two columns:
- Timestamp
- Email

Then, click on `Extensions > Apps Script` to open the script editor. Create a new script with this code:

```javascript
function doGet(e) {
  // Add CORS headers
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Get the email parameter
  const email = e.parameter.email;
  
  if (!email) {
    return output.setContent(JSON.stringify({
      status: 'error',
      message: 'No email provided'
    }));
  }

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const timestamp = new Date();
    sheet.appendRow([timestamp, email]);
    
    // Wrap the response in the callback function name if provided
    const callback = e.parameter.callback;
    const responseData = JSON.stringify({
      status: 'success',
      message: 'Email saved successfully'
    });
    
    return output.setContent(
      callback ? `${callback}(${responseData})` : responseData
    );
    
  } catch (error) {
    return output.setContent(JSON.stringify({
      status: 'error',
      message: error.toString()
    }));
  }
}

// Add this function to handle CORS preflight requests
function doOptions(e) {
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
```

To deploy your Apps Script:

1. Click on `Deploy > New deployment`
2. Click `Select type > Web app`
3. Configure the deployment:
   - Execute as: `Me`
   - Who has access: `Anyone`
   - Click `Deploy`
4. Copy the Web app URL - this will be your `PUBLIC_GOOGLE_SCRIPT_URL`

This setup gives you a simple but effective database for your newsletter subscriptions, with zero hosting costs and easy export options when you need to migrate to a more robust solution.

Remember to add the Web app URL to your environment variables as `PUBLIC_GOOGLE_SCRIPT_URL` in your deployment platform (Netlify/Vercel).


### 5. Cross-Component Communication

To ensure a consistent experience, we needed components to communicate when a user subscribes. 

This way, if someone subscribes through the popup, the profile form automatically hides, and vice versa.

We use localStorage and custom events:

```javascript
// Store subscription status
localStorage.setItem('newsletterSubscribed', 'true');

// Notify other components
window.dispatchEvent(new CustomEvent('newsletter:subscribed'));
```

## The Result

The final system provides a clean, professional newsletter subscription experience similar to Substack, but with complete control over the implementation and zero monthly costs. The only limitation is Google Sheets' row limit (10 million rows), but by then, you'll probably want to migrate to a proper database anyway.

Or the relative slowness of the Google Sheets API response. 

## Conclusion

Building your own subscription system might seem like overengineering when solutions like Substack exist. However, it offers several advantages:
- Complete control over the user experience
- No monthly fees
- Integration with your existing site design
- Valuable learning experience

The entire implementation took about 3 hours and has been running smoothly. Sometimes, the simplest solution is the best one - you don't always need complex infrastructure to solve a straightforward problem.

Want to see it in action? Try subscribing to my newsletter using any of the forms on this page! 😉

The complete code is available <a href="https://github.com/Cst2989/neciudan-dev-new/tree/main" target="_blank">on my GitHub</a>, and you're welcome to use it for your own projects. 
