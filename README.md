- npm install
- npm start
- npm run watch
- go to localhost:2016

TODO:
Find what event coincided with most likes/increase in popularity in the last time session

Similarly least likes.

Say the aggregate city, and percentage increase over averaged trajectory
  maybe in the last year verses for the duration

NEED:
aggregate of what “like” is.
Averaged curve
Difference of likes to average curve

service steps:
getArtistID
getArtistMetric(s) i.e. start likes/likes over time, genre,

Q's:
what is Facebook like metric #?
what is tweet metric #?
how do you get an average line?
how do you add circles?
how do you make lines from circles to average?

STEPS
Look up artist get ID
- get back id with promise
- fire metrics with id
Look up metrics like and tweet with artist ID
Make bar graph

Find average curve
Make line graph

Find Events with time
Make points

Find Events vs average curve
Make lines to curve

Show in text what location was best and worst

DONE:

Look up artist get ID
- wire input to artist
- replace spaces with +'s
- have it fire onload with model supplied
