# MSOutlookit

MSOutlookit was my second Javascript project -- it essentially reskins the homepage of reddit (along with other functionality) into a Microsoft Outlook interface.

<img src="http://petercottle.com/miscPics/msoutlookit.png"/>

It serves the silly (and not-so-honorable) purpose of disguising reddit browsing during work.

## Video

A demo on how to use MSOutlookit can be seen [here](http://www.youtube.com/watch?v=rGVhlxxu6oc) . At the time of filming, the full functionality was in place (logging in, Lynx text dumps, etc). Due to server constraints I've stripped out MSOutlookit to bare-bones Reddit API display.

## Challenges

Since this was my first project with both a backend and a front-end, I experienced a lot of scaling pains when the site got popular. After manually implementing memcached on all the endpoints and making some optimizations, the site is in a much better shape now.

It was a fun challenge to embed reddit functionality inside a different UI (as well as reimplement window management and the desktop taskbar). I'm thankful for the reddit community, who inspired me to keep working and get this out the door before starting grad school.

## Usage

The site still gets around [10,000 unique visitors](http://msoutlookit.com/awstats.html) per month at the time of writing, so I've left the server running for the time being, despite the code not being in the best shape.


