#A simulated test runner.

###Every test has 4 states:
1) Pending (grey)
2) Running (blue)
3) Completed (green)
4) Rejected (red)

Depending on the state the build is in you can see additional info regarding
the tests by clicking on the test block.

On the top right there is two action buttons that allow the user to clear the
tests or add a test.

When a new test is added it will be either a firewall or a build. This is
random and can't be controlled by the user.

Running tests can either fail or pass depending on the following crieteria:

####Pass:
  1) If the test is the first of its kind
  2) If the metric results for maintainability and test is higher than the last test of the same kind.

####Fail:
  1) If the metric results for maintainability and test is lower than the last test of the same kind.

When the page is first opened a test is automatically added.

####UX

When adding a test it slides in from the right to the list.
The logo is pulsating when a test is running.
When a test changes from pending --> running the test block flashes to indicate the start.
When clicking on a completed or rejected more info is revealed with a slide animation.
When seeing more info of a test block the chart is visually drawn.
While tests are running the progress bars are being run sequentially with a fill animation.

How to run the code.

```
run 'npm install'

run 'bower install'

run 'npm start'

How to run unit tests

run 'npm run test-single-run'

How to run code coverage

run 'npm run cov'

then open index.html in app/coverage/ directory
```
