---
title: 'The Bowling Kata'
excerpt: 'A kata is a set of routines, samurai used to perfect their craft. We can apply the same practices for code development'
publishDate: 2021-06-22
image: '/images/articles/kata.jpeg'
category: 'Coding Kata'
readTime: '8 min read'
---

<p style="text-align: center;">
<img src="/images/articles/kata.jpeg" alt="Kata" /> 
</p>
A kata is an exercise in martial arts, where you practice the same thing over and over again making small improvements each time. The same concept can be applied to programming, it helps programmers hone their skills and be better at their job.

Being a tested concept with a lot of online resources, job applications started using this coding challenge for their on-site Live Coding Interview.

In this article I’m going to explore a coding Kata, the Bowling Score, and how to solve it in the context of an interview.

You will be given a series of inputs and expected output for each input, and the expected result is to code everything in between (classes, methods, unit tests) to get the desired result.

We will go through the thinking process, the steps to take when presented a problem and some tips and tricks to help you when you are stuck in the journey to solve this challenge.

## The Bowling Score Kata



In a game of bowling you get ten rounds to knock back 10 pins with a bowling ball. In each round, called a frame, you have two tries. If you knock them over on the first try, it’s called a strike, if you do it in two it’s called a spare. At the end of the 10 frames the player with the most points wins.

Points are calculated based on a frame result:

- If it’s not a strike or a spare the sum of the throws is calculated.
- For a spare, you get the next throw added as a bonus.
- For a strike, you get the next two throws added as a bonus.
- If you have a spare or a strike in the last frame you get another throw as a bonus.

<p style="text-align: center;">
<img src="/images/articles/bowling.webp" alt="Bowling score" /> 
</p>

In an interview typically you get an explanation like the one above and a series of input / output values, as examples, that you can use to verify your solution. Like this:

<p style="text-align: center;">
<img src="/images/articles/bowling0.png"  /> 
</p>

From the description and examples we can gather a couple of insights:

- We receive an array of numbers as input and expect a number, the total score, as output.
- A strike is always followed by the number 0.
- The length of the rolls array is 20 and in the case of a strike / spare on the last frame, it’s 21.
- A frame is composed of two throws and the game is composed of ten frames.

With this in mind we can start coding our solution, and the first step of that is to write some unit tests.

### Starting with Unit tests

Starting with unit tests first is a must-have for any interview process. You don’t have to practice [TDD](https://www.browserstack.com/guide/what-is-test-driven-development) regularly at work, or follow the [Red, Green, Refactor framework](https://www.codecademy.com/articles/tdd-red-green-refactor) rigorously, but writing the tests first helps you think in small increments about a problem.

All of a sudden you don’t have to solve a big complex problem, you have to solve multiple small problems and you can take them one at a time.

And by writing unit tests you can showcase your thinking process outside of your coding skills. Interviewers are very interested to see a candidate think about error boundaries in a problem and handle it accordantly.

From the requirements we can gather a couple of invalid inputs:

- When the input rolls length is lower than 20
- When the input rolls length is bigger than 21
- When we have negative numbers among the input rolls
- When two rolls in a frame have a sum bigger than 10 (there are only 10 pins you can hit)
- When following a strike you have another number other than 0

Just by thinking about error boundaries, it also helped us with our design, because to test against them we have to code in a specific, granular way.

For example, to test that two rolls in a frame have a sum bigger than 10, we now deduce that we need a function that handles the logic for a specific frame.

Pointing these invalid inputs out to the interviewer will score you massive points, but please keep in mind that you are on limited time. So you can code one or two but have the bigger picture in mind. Nothing is worse that having the interviewer stop you to let you know you have 5 more minutes left.

### Getting started
Assuming our starting function is something like this:

<p style="text-align: center;">
<img src="/images/articles/bowling1.png"  /> 
</p>

Let’s write our first test to protect ourselves against invalid inputs:

<p style="text-align: center;">
<img src="/images/articles/bowling2.png"  /> 
</p>

Quick tips regarding testing:
- Follow the AAA (ARRANGE, ACT, ASSERT) pattern when writing test
- Only have one Assert per unit test
- When testing and coding and debugging you can use helper functions to focus only one test or block of tests

<p style="text-align: center;">
<img src="/images/articles/bowling3.png"  /> 
</p>

Coming back to our first test case, we need to code a solution for when we have too few rolls as our input.

<p style="text-align: center;">
<img src="/images/articles/bowling4.png"  /> 
</p>

Running the tests with the focus on our first test will return our first green. Good job!

<p style="text-align: center;">
<img src="/images/articles/bowling-kid.jpeg"  /> 
</p>

Similarly we can now do the same for the others, take care of doing it one by one and running the test each time, in case of an error in our code so you don’t waste time debugging.

<p style="text-align: center;">
<img src="/images/articles/bowling5.png"  /> 
</p>

Here normally, if you are not stressed on time, I would remove the if statement in a different function that handles the Invalid Input rolls statement, but it’s more important to finish the assignment first and refactor later.

### Thinking in Bowling Frames

Going forward, the next two invalid inputs are harder to test right off the bat, as we don’t have them split into frames. So let’s create a new function that handles the logic of a single frame, and move our invalid tests to this function.

<p style="text-align: center;">
<img src="/images/articles/bowling6.png"  /> 
</p>

Let’s create our calculateFrame function. Normally a frame should return either the sum of two rolls, a Strike symbol if the frame was a strike, or a spare symbol if the frame was a Spare. Firstly though, let’s take care of our invalid inputs.

<p style="text-align: center;">
<img src="/images/articles/bowling7.png"  /> 
</p>

It’s now time to test the happy path, and our first order of business is to finish the frame function.

We need the frame to return the sum of the rolls or the corresponding symbol for a spare / strike. The ‘/’ symbol for spare and a ‘X’ for a strike.

<p style="text-align: center;">
<img src="/images/articles/bowling8.png"  /> 
</p>

Expanding on our invalid verification code we just had to return the sum. Pretty simple once you start with the errors, now all we have to do is handle a strike and a spare.

For the spare if the sum is 10, return the symbol for spare ‘/ and for a Strike, if the first roll is a 10 then we return the ‘X’ symbol.

<p style="text-align: center;">
<img src="/images/articles/bowling9.png"  /> 
</p>

### All games have a score card

We now have our tests that verify our implementation, so we can refactor as much as we want, and more importantly we have our first block in our solution.

The next step now is to build on top of this function to get to the final correct result.

Next we want a scorecard, given any number of frames, let’s see the result like in a normal Bowling Game. We see the frame number, and either the sum of that frame, a strike symbol or a spare symbol.

<p style="text-align: center;">
<img src="/images/articles/scorecard.webp"  /> 
</p>

<p style="text-align: center;">
<img src="/images/articles/bowling10.png"  /> 
</p>

Again we can test multiple scenarios, when we have no strikes or spares, when we have a spare, when we have a strike, and when we have multiple strikes / spares.

<p style="text-align: center;">
<img src="/images/articles/bowling11.png"  /> 
</p>

We already have our frame function that returns the correct result, we just have to loop the frames, apply the frame function and store the result in a string.

<p style="text-align: center;">
<img src="/images/articles/bowling12.png"  /> 
</p>

A simple and elegant function, that only does one thing.

### Adding up your score
We have our score card, and now it’s time to calculate the score from it.
<p style="text-align: center;">
<img src="/images/articles/bowling13.png"  /> 
</p>
Let’s give this function the three already tested scorecards and assert the correct response.
<p style="text-align: center;">
<img src="/images/articles/bowling14.png"  /> 
</p>
First step, would be to iterate though the string, parse each value as an integer and calculate the sum. After that we need to calculate the tricky stuff, when we have a spare and a strike.

For a spare, we need to add the next throw as a bonus, so to do that, the scorecard is not enough, we also need to have access to the frames array.
<p style="text-align: center;">
<img src="/images/articles/bowling15.png"  /> 
</p>

One more step to go, for the strike we need to add the next two throws as bonus, and here is where it gets tricky, we can do the same as above and add the next two values in the future frame, but what if the next frame is also a strike? Then we will add 0 by mistake, we need to verify if it is a strike and plan accordantly.

Just like before, we need to check for a strike and add the next throw throws inside the forEach:

<p style="text-align: center;">
<img src="/images/articles/bowling16.png"  /> 
</p>

This will solve our initial test case, but if we have two strikes in a row, it will add 0 instead of 10 to the second strike, so we have to verify we don’t add a faulty 0 and be very careful in case the 0 is from a strike or a normal miss.

<p style="text-align: center;">
<img src="/images/articles/bowling17.png"  /> 
</p>

To make this test past, we have to check for a future strike in our calculation

<p style="text-align: center;">
<img src="/images/articles/bowling18.png"  /> 
</p>

There are multiple things happening in the above code, a smell that we can extract it in a different function, but essentially it’s trying to add the next two rolls to the score. But to do that it first checks if we have two rolls ahead of this strike, and if we do, it checks for a future strike.

### Putting the pieces together

Now we have the entire logic flashed out, all that is left is putting it all together inside our bowlingScore function.

<p style="text-align: center;">
<img src="/images/articles/bowling19.png"  /> 
</p>

listToMatrix is a simple utility function that generates a two dimensional matrix (our frames) from an array. Here it is:

<p style="text-align: center;">
<img src="/images/articles/bowling20.png"  /> 
</p>

<p style="text-align: center;">
<img src="/images/articles/passing-tests.webp"  /> 
</p>


And thats it! Congratulations, you just finished your first kata. Going forward you can refactor it, and try to optimise it as much as you want.

## Conclusion

You can also find the [finished code here](https://github.com/Cst2989/katas/tree/master/src).

TLDR: If you skipped the article, here are the key elements that I hope will remain with you during your interviewing journey:

- Write tests first, verify your output with unit tests and not with the console
- When writing unit tests, follow the AAA pattern, use only one ASSERT per test and take advantage of the “only()” helper function to focus on a single test.
- Always think about error boundaries and input validation
- Start by coding a small simple function and increment on the solution from there.
- Naming matters! Please take the time to name your functions and variables with clear and concise names.
- With proper unit tests in place, it’s easy and safe to refactor your code.
- Leave refactoring for the end, when you already finished the assignment
- Keep an eye on the clock, you do not want to be reminded that you have 5 minutes left by the interviewer.

Thank you for your time! I hope this article helps you land your dream job in the wonderful world of Software Engineering.
