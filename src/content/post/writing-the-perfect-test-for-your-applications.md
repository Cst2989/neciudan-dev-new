---
title: 'Writing The Perfect Tests for your Application'
excerpt: 'Testing is hard, but knowing what and when to test is actually harder. Let me tell you about 3 types of tests that can help you secure your project.'
publishDate: 2023-01-23
image: '/images/articles/pefect-test.jpeg'
category: 'Software Testing'
readTime: '5 min read'
---

We, as humans, are all looking for perfection. Some are trying to capture the perfect sunset, some are trying to ride the perfect wave and Software Engineers are looking for perfection in their code.

We want to write clean, maintainable code, with as little fragility as possible, and to achieve this most of the time the correct approach is with lots and lots of tests.

I wrote about the [5 types of testing practices you need in your application](/articles/5-testing-practices-you-should-have-in-your-cicd-pipeline), but in this article, I want to talk about the app-saving tests, that can help you save time, money, and stress.

We can categorize the perfect tests into 3 types:

- The test that helps you build
- The test that helps you debug
- The test that helps you sleep well at night

## The Test that helps you Build

<img src="/images/articles/build.jpeg" alt="The Test that helps you build" /> 

<p style="text-align: center;">Photo by Randy Fath on Unsplash</p>

The purpose of Software Testing is to make sure our code works!

And it’s important our code works in as different situations as possible. Testing just the happy path is not enough, we have to add tests for boundary situations and errors.

For example, we have an array of numbers:

`const arr = [1,2,3,4,5]`

And we want to write a simple function that adds +1 to every number of the array without using any array build-in functions like map or reduce

If you start with a simple for loop from 0 to 5, iterate through the array, and add 1 to each value, we can create a boundary test where instead of passing a 5-value array we will pass a 6-value array or an empty array.

Our tests would fail, and we will improve our design by changing the for loop to include the array's length.

We are continuously iterating through our design and building better and more maintainable code.

You write your tests first, make sure they fail and write the most straightforward code that will make your test case pass.

Afterward, you look at your code and see if it can be improved in any way, if not you add another test case and continue the cycle.

*This is what Test-Driven-Development (TDD) is all about.*

## The Test that helps you debug

<img src="/images/articles/debug.jpeg" alt=" The Test that helps you debug" /> 

<p style="text-align: center;">Photo by Mediamodifier on Unsplash</p>

Has this ever happened to you?

You’re working on your project and you find a critical bug that is hard to reproduce but you just know it wasn't there in the last sprint.

It was introduced recently, but you don't know how and more importantly when.

In October 2022, Git introduced a very handy command called git bisect

git bisect is a useful tool for quickly identifying the commit that introduced a bug in your code. It can save you a lot of time compared to manually searching through the commit history.

But before you run the git bisect process, you need a test to determine if the bug is present or not.

Let’s say you have a bug in the login flow. You would write an e2e that simulates the flow for you.

Having the test ready, here’s how to use it to find the commit that introduced a bug:

1. Start the bisect process by running `git bisect start`.
2. Identify a commit that is known to be “good”, and run `git bisect good <commit>`.
3. Identify a commit that is known to be “bad”, and run `git bisect bad <commit>`.
4. Git will then check out a commit that is halfway between the good and bad commits.
5. Run your test to determine whether the current commit is good or bad. If it is good, run `git bisect good`. If it is bad, run `git bisect bad`.
6. Repeat this process until git bisect finds the commit that introduced the bug.
7. When git bisect has found the commit, it will output the commit hash and message.
8. Run git bisect reset to stop the bisect process and return to the HEAD commit.

Automating this process will save you hours and hours of checking commit histories, especially if the bug was introduced months ago and you have a very big codebase.

## The Test that helps you Sleep well at night
<img src="/images/articles/sleep.jpg" alt="The Test that helps you Sleep well at night" /> 

<p style="text-align: center;">Photo by bruce mars on Unsplash</p>

Engineers love complexity.

Like building software that does things, nobody or no other software has done before.

And the same is true for our automation processes. Engineers like to add automated flows for visual tests, performance tests, unit tests, and every other kind of testing flow imaginable.

I actually wrote a piece about [5 testing practices you should have in your CI/CD pipeline](/articles/5-testing-practices-you-should-have-in-your-cicd-pipeline), but the truth of the matter is that a very simple synthetic test would give you more value than all of those combined.

Sure, testing practices in your CI/CD can prevent faults from being deployed, but bugs are tricky, they like to hide in dark places and only come out during the perfect moment (Like a long weekend, or Christmas)

Having a smoke test or a synthetic test that covers the most critical business flow in your application **running on the production environment**, will give everyone involved that amazing good night's rest without worrying about the feature they deployed on Friday.

Third-party monitoring and observability tools like DataDog, Sentry, or Testing as Service platforms allow you to build these kinds of tests that run on your application every minute and alert you if anything goes wrong.

Building these tests in your pipeline, having canary deployments, and running them only on the affected group could save your company a lot of money and reduce the stress level of all the company's engineers.

## Conclusion

Software Testing is not only useful to verify the correctness of your software.

Taking full advantage of tests you can use them to better write your code using TDD practices like Red-Green-Refactor or Triangulation.

You can automate debugging with git bisect and a handy E2E test to quickly find when a bug was introduced in your codebase.

And having a small and simple synthetic test that runs on your production environment can make sure your dreams at night are without worry and stress.

**Doesn't that sound just perfect?**
