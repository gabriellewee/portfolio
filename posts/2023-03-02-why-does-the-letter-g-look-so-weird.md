---
date: 2023-03-02
title: Why does the letter G look so weird?
---
I don’t know if it’s just me, but finding an aesthetically pleasing G is the bane of my existence. I’ve never liked the way G looks in any font — especially cursive G’s, those are the worst. Lowercase g’s don’t make much sense either, especially the [looptail variety](https://psycnet.apa.org/doiLanding?doi=10.1037%2Fxhp0000532). I used to spend hours as a child rewriting my name over and over because I couldn't get it to look like how I wanted it to look (still haven’t quite gotten it right).

As time has passed, this search for the perfect G has spilled over into other parts of my life. I spent three hours browsing Etsy the other day because I wanted an initial necklace and all the G’s were too narrow, too angled, not special in any particular way.

I also have struggled with making favicons/OpenGraph images for my site. I’ve avoided proper identity design by simply using my initial, but then I spend even more time trying to perfect it.

::: row-quad

![White G logo design on a red background from 2013](2023-03-02-logo-v1.svg 'Logo design from 2013')

![White G logo design on a dark grey background from 2014](2023-03-02-logo-v2.svg 'Logo design from 2014')

![White G logo design on a light pink background from 2016](2023-03-02-logo-v3.svg 'Logo design from 2016')

![White G logo design on a pink background from 2021](2023-03-02-logo-v4.svg 'Logo design from 2021')

:::

With my first proper website design, I simply threw the initial in my website font onto a red background and called it a day. Later iterations were more or less the same thing, with varying colors and backgrounds. This proven technique has led me to my current icon design, though I think I like the G a little more this time around.

![Current logo design used in OpenGraph image. A capital letter G sits in front of a diamond shape on a gradient background.](2023-03-02-logo.svg 'Current logo design used in OpenGraph image')

::: row-double

![Current logo design used in OpenGraph image for graphic page, with a background composed of randomly placed outlined stars and circles.](2023-03-02-logo-graphic.svg 'Current logo design used in OpenGraph image for graphic page')

![Current logo design used in OpenGraph image for post pages, with a background resembling a piece of lined paper.](2023-03-02-logo-posts.svg 'Current logo design used in OpenGraph image for post pages')

:::

Maybe it’s because wide sans-serif fonts are trendy right now, but something about the oval that is deeply satisfying, more so than the perfect circles I emulated in previous iterations. I also added the cut-off corner motif that is used all over my site.

![Vector points used for logo design](2023-03-02-logo-vector.png 'Vector points used for logo design')

I decided to rotate the background for favicons since the square would utilize more space than the diamond shape.

::: row-double

![Logo version used for iOS and OpenGraph. A capital letter G sits in front of a diamond shape on a gradient background.](2023-03-02-logo-ios.svg 'Logo version used for iOS and OpenGraph')

![Logo version used for favicons and Android. A capital letter G sits in front of an octagon with a gradient.](2023-03-02-logo-favicon.svg 'Logo version used for favicons and Android')

:::

I used to have to search for a favicon generator every time I updated mine, but I finally just installed [ImageMagick](https://imagemagick.org) and made the .ico file myself.

```
convert ./favicon.png ./android-chrome-48x48.png ./favicon-32x32.png ./favicon-24x24.png ./favicon-16x16.png ./favicon.ico
```

All that to say, I think this G is  _close enough_ to perfection for me. Now I just have to figure out how to get this version onto a necklace.