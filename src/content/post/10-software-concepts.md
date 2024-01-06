---
title: '10 Software concepts I learned in 2022'
excerpt: 'Software Engineers commit to a lifetime habit of learning. Here are 10 things I learned this year that made me a better Frontend Engineer.'
publishDate: 2023-01-05
image: '/images/articles/soft-concepts.jpeg'
category: 'Software Development'
readTime: '10 min read'
---

This year was without a doubt a year full of learning, from learning to Snowboard to How to Traverse a Graph and even trying and failing to learn how to whistle.

And while not everything I learned can be applied in my career as a Frontend Engineer, let me share with you the lessons that I believe made me better at my job, and in turn, it may help you as well.

## 1. Margin Block and Gaps

As soon as I started coding, the first CSS properties I learned about were margins and paddings.

Color me surprised when I learned there exists a different but similar property called margin-block.

For you and me margin-block-start is the same as margin-top and margin-inline-start the same as margin-left. But if you switch the language of the Browser from English to Arabic the vertical and horizontal axes will be reversed and Users will start reading from right to left.

Why use these alternatives? Because not all languages are left-to-right, top-to-bottom.

By using margin-block you will basically create the same UX design for both reading experiences.

It’s not just margin: there are properties for padding, border, and overflow as well.

The main selling point for logical properties is internationalization. If you want your product to be available in a left-to-right language like English and a right-to-left language like Arabic, you can save yourself a lot of trouble by using logical properties.

Both flexbox and grid layouts have a common property called gap. It basically adds spacing between columns and/or rows.

It comes with specific properties as well: column-gap and row-gap.

Before, I used to either justify-content with flex-start or flex-end and then use a combination of margins and padding to get the desired result.

Now a quick column-gap: 20px solves the problem.

## 2. Dynamic Programming

Dynamic programming is a method for solving problems by breaking them down into smaller subproblems and storing the solutions to these subproblems in a table so that they can be reused (instead of recomputing them).

Let’s think of a common exercise where this can be applied. Imagine you are a world-class thief and you are alone in a store with a bag that can handle 4 kg of products.

In front of you are the following items:

A laptop worth 2000$ and a weight of 3kg
An electric guitar worth 1500$ and a weight of 1kg
A stereo system worth 3000$ with a weight of 4kg
To steal the maximum amount of money you have to go through each item and create a number of sub-sets to calculate the maximum amount. For 3 items this is easy — you have to calculate 8 possible sets, but for each item, you add the number of sets doubles.

This algorithm works in O(2^n) time, which is very very slow.

Dynamic Programming, on the other hand, creates a table and breaks the problem into sub-problems. So instead of the 4kg limit that we have in our bag, we try to find the best possible solution for 1kg, then for 2kg, 3kg, and finally for 4.

Our table will look like this:

For each item row you have to answer the question, is this item the best option to steal at this cell and moment in time?

The first row checks if the Guitar is the best solution, without knowing about the other items, on the second row the Stereo does not fit into the small bags only when it reaches the 4kg limit does it become the optimal solution.

In the last row, for the 3kg bag, the laptop is the best solution, but once it reaches the 4kg it has to compare the previous solution (3000$) or put the laptop which is (2000$) and it sees that it has 1kg left and takes the value from the first column that we calculated all along.

The actual formula used for this is more complicated, and it’s a story for another time.

## 3. Git bisect

git bisect is a useful tool for quickly identifying the commit that introduced a bug in your code. It can save you a lot of time compared to manually searching through the commit history.

Here’s how to use it to find the commit that introduced a bug:

Start the bisect process by running git bisect start.
Identify a commit that is known to be “good”, and run git bisect good <commit>.
Identify a commit that is known to be “bad”, and run git bisect bad <commit>.
Git will then check out a commit that is halfway between the good and bad commits.
Run your script to determine whether the current commit is good or bad. If it is good, run git bisect good. If it is bad, run git bisect bad.
Repeat this process until git bisect finds the commit that introduced the bug.
When git bisect has found the commit, it will output the commit hash and message.
Run git bisect reset to stop the bisect process and return to the HEAD commit.

## 4. Domain Driven Design concepts

DDD is a way to build your software to ensure as little coupling between modules as possible. It is very popular in the micro-service world and it introduces concepts to help you design your software, such as:

Ubiquitous language. A vocabulary shared by everyone involved in a project, from domain experts to stakeholders, to project managers, to developers

Bounded Context. A boundary within a domain where a particular domain model applies.

Entities. An entity is an object with a unique identity that persists over time.

Value objects. A value object has no identity. It is defined only by the values of its attributes. Value objects are also immutable.

Domain Driven Design is really powerful and can create beautiful clean architecture and communication between domains is very straightforward.

## 5. Javascript on the Edge

A content delivery network (CDN) is a distributed network of servers that are used to deliver content to users based on their geographic location. A CDN stores copies of content in multiple locations, and when a user requests content, the CDN delivers it from the server that is closest to the user.

This helps to reduce the distance that the content must travel, and can improve the performance and reliability of a website.

We have taken this a step further, while we stored static content like images, fonts, and files on CDNs for a while, recently we started to move complex functionality on the server as well.

Lambda functions have existed for a while, but in the Frontend World we just started to move pure functions, network requests and parsers and all sorts of complex stateless functionality to “the edge” as we call it.

Basically, remove the bloat of these functions from the main javascript bundle and keep it in servers close to the users so they run very fast and can be cached.

## 6. How important Observability is

Since we started coding, for every website we build, we always had to add to it different tracking scripts. The most common of course is Google Analytics.

But the usage of these tracking tools was used mainly to measure clicks, conversion rate, and page views. And it was used primarily by marketing or more recently by Data analysts.

But new tools in the industry like DataDog or Sentry have added another layer to track. They started measuring errors and combining logs, and you can send as many metrics as you desire to observe the interactions of your piece of software with the users.

An undeniable fact in programming is that software has bugs, and at Scale, errors are plenty and vary in size and how they affect the user.

Using DataDog, we can group issues, see which are handled, and break the errors by Browser, OS, or any number of attributes we can deduce about the user.

For example, we figured out that a particularly devastating Hydration Error inside a Scoped Slot in our Vue Application was only happening on a version of Safari. And using this browser ourselves we could reproduce and debug the issue.

## 7. Typescript Concepts

I always knew the basics, and how to make types work but I did not understand how Typescript works behind the scenes and what it does.

Here are some examples that were new to me and helped me move forward when using Typescript.

Types are not sealed. If a function has a param type Shape with height and width you can pass it a different type like Cube that has height width and length.
Types and interfaces are mostly the same. Types can create unions and interfaces can be augmented
If your function does not modify its parameters then declare them read-only. This makes its contract clearer and prevents inadvertent mutations in its implementation.
TypeScript gives you a few ways to control the process of widening. One is const. If you declare a variable with const instead of let, it gets a narrower type.
When you write as const after a value, TypeScript will infer the narrowest possible type for it. There is no widening. For true constants, this is typically what you want.
Evolving any! It happens when you don't declare it as any.

For example result = [] as you push in the array it changes the type from any[] to number[]

While TypeScript types typically only refine, implicit any and any[] types are allowed to evolve. You should be able to recognize and understand this construct where it occurs.
For better error checking, consider providing an explicit type annotation instead of using evolving any
The evolving array is tripped up by iterators like forEach

## 8. The New Project Razor

When deciding whether to take on a new project, follow a simple two-step approach:

Is this a “hell yes!” opportunity? If not, say no. If yes, proceed to Step 2.

Imagine that this is going to take 2x as long and be 1/2 as profitable as you expect. Do you still want to do it? If no, say no. If yes, take on the project.

Using this approach will force you to say no much more often — you’ll only say yes to projects you are extremely excited about, which are ultimately those that drive asymmetric rewards in your life.

## 9. Moores Task and Shortest Process Time

Consider you have four tasks A, B, C, and D.

Task A is estimated at 4h, B at 9h, C at 12h, and D at 18h.

Doing all these tasks will take above the desired deadline and that deadline cannot be broken.

Moore's Law says to throw away the longest-taking task. In our case D.

Work and repeat at scale.

Shortest Process Time:

Say you have two projects: one takes 4 days for Client A and one takes 1 day For client B.

If you do the big one first and the small one last the total waiting time of your clients combined is 9 days: Client B waits 5 days, and Client A waits 4 days.

Doing it in reverse makes it 6 days: Client B waits 1 day, and client A waits 5 days

Here you are optimizing for client happiness while still taking one week for your work.

## 10. How to Listen

While this is not frontend specific, I believe that taking the time to actually listen to what people around me are saying, helped me become a better programmer.

Usually, I would either pick up on the topic and if it was not interesting to me I would normally tune it out, and this was the best-case scenario.

Sometimes I would be on my phone and not pay attention at all to my teammates during meetings or even when something tech-related was discussed.

But the worst of it was when I would react too fast. Usually by assuming, wrongly, that I know what the person is talking about and that I could, again wrongly, explain it better.

By doing this I would just add confusion to the topic and complicate it further.

And even when receiving feedback or being told a piece of information, my first instinct was always to react, to show I know about it, or I know something similar but never to listen and assimilate that piece of knowledge.

Being aware of this and taking time to pay attention, listen, and be more mindful of my working environment has helped me learn most of the items iterated in this article.

So if you can take just one thing from this article, let it be this point.

We all are actively looking for new knowledge by reading, browsing the internet, and exploring new tech. But Actively Listening to what people around us are saying can give us so much information that will pique our curiosity and trigger a domino effect on our learning path.

If you liked this article, don’t forget to follow me on Medium or on Twitter to connect and exchange ideas.

I write mostly about Testing, Frontend Engineering, or Productivity. Here you can also check out my youtube channel.

Here are a couple of articles I’ve also written:

Testing Practices you should have in your CI/CD pipeline
Tech Books you have to read to be a better Engineer
Javascript Component Patterns to Scale up
The Bowling Kata
5 Tips to Solve Common Pitfalls With React Native
CSS: The !important parts
