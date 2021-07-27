---
date: 2021-07-26
title: Setting up shop.
layout: layouts/post.njk
templateEngineOverride: md,njk
---

It's been a while since I've really done a proper update on this website. I'd like to talk through the last few years of this site, and what I did to make this current iteration happen.

## 2017 version

Previously, I hosted this website on [Github Pages](https://pages.github.com) and used a static site generator called [Cactus](https://github.com/eudicots/Cactus) to build my files.

{% image './static/images/writing/2021-07-26-website-home.png', 'Previous website home page', 'horizontal', 'full', 'posts', '2021-07-26-website-home', true %}

<div class="row-double">
{% image './static/images/writing/2021-07-26-website-project-top.png', 'Previous website project page top', 'horizontal', 'full', 'posts', '2021-07-26-website-project-top' %}

{% image './static/images/writing/2021-07-26-website-project-middle.png', 'Previous website project page middle', 'horizontal', 'full', 'posts', '2021-07-26-website-project-middle' %}
</div>

I was (and still am) really proud of this portfolio. It was my first big project out of college, and it got featured a few times on various sites. I experimented with different layout techniques and for the first time, created an extensive set of my own icons and thumbnails.

{% image './static/images/writing/2021-07-26-portfolio-icons.png', 'Website thumbnail icons I created for my portfolio', 'horizontal', 'full', 'posts', '2021-07-26-portfolio-icons', true %}

After this, I didn't update my portfolio for almost four years. I started working at [Apple](https://apple.com) in 2017 as a vendor and transitioned to full-time in 2018, so there really wasn't any need to change things up. I also really liked the design and couldn't think of how to change it.

## 2020 version

Finally, last year, during the height of the pandemic, I decided I needed to change things up. I still didn't have a clue what it should look like, but my work was badly outdated, so I decided to just make it more of a landing page with links to websites that I _was_ updating regularly.

<figure id="2021-07-26-website-v4" class="light-dark">
	<figcaption>Landing page version</figcaption>
	<a class="expand " href="#2021-07-26-website-v4-lightbox" aria-label="Expand image">
		{% image './static/images/writing/2021-07-26-website-v4-dark.png', 'Landing page version', 'horizontal', 'full', 'posts' %}
		{% image './static/images/writing/2021-07-26-website-v4-light.png', 'Landing page version', 'horizontal', 'full', 'posts' %}
	</a>
</figure>

## Current version

This year is the year I decided to build a full website again. I really wanted something that not only highlighted my work as a developer but also included my hobbies and other non-work activities. I've also been strongly nostalgic for the whacky, quirky Geocities-type websites that used to exist before everything became smooth and clean and minimal. Lastly, I wanted my website to be completely functional without Javascript.

I came up with a design that is busy but organized. Each section represents one of my interests and has its own styles and colors. There's also light and dark versions of this site (if you have dark mode enabled, the screenshot below should show the light mode, and vice-versa). I chose [Faune](http://cnap.graphismeenfrance.fr/faune/en.html) as the main font because I really loved the unusual-looking italics.

<figure id="2021-07-26-current-website" class="light-dark">
	<figcaption>Current website</figcaption>
	<a class="expand " href="#2021-07-26-current-website-lightbox" aria-label="Expand image">
		{% image './static/images/writing/2021-07-26-current-website-dark.png', 'Current website', 'vertical', 'full', 'posts' %}
		{% image './static/images/writing/2021-07-26-current-website-light.png', 'Current website', 'vertical', 'full', 'posts' %}
	</a>
</figure>

This site is built with [Eleventy](http://11ty.dev) and is hosted on Netlify. I chose Netlify because of the ease of use and plethora of configuration options and plugins. Eleventy is easy to learn and has the most flexibility out of the static site generators I was looking at.

## No-JS

Something I'm really proud of is the no-JS functionality. On my visual pages ([Photography](/photography/), [Graphic](/graphic/), and [Art](/art/)), I have a popup for each image that gives you more information when the image is clicked. The trigger is a checkbox with multiple labels.

<figure>
	<figcaption>CSS-only photo info popup; doesn’t include Javascript.</figcaption>
	<p class="codepen" data-height="500" data-theme-id="39292" data-default-tab="result" data-slug-hash="rNWZJgy" data-user="gabriellewee" style="height: 500px"><span>See the Pen <a href="https://codepen.io/gabriellewee/pen/rNWZJgy">CSS-Only Photo Info Popup</a> by Gabrielle Wee (<a href="https://codepen.io/gabriellewee">@gabriellewee</a>) on <a href="https://codepen.io">CodePen</a>.</span></p>
</figure>

I used a bit of Javascript to enhance the trigger. It creates some additional functionality like being able to tab through the triggers and scroll to the correct image when the trigger is focused.

``` js
buttons.forEach(button=>{
	let info = button.nextElementSibling.nextElementSibling.nextElementSibling;
	let name = button.getAttribute("id").slice(0, -5);
	let expand = info.querySelector(".grid-expand");
	info.setAttribute("aria-hidden", "false");
	button.addEventListener("focus", e => {
		document.getElementById(name).scrollIntoView({ behavior: "smooth" });
	});
	button.addEventListener("keypress", e => {
		if (e.keyCode == 13) {
			if(button.checked){
				button.checked = false;
				expand.tabIndex = -1;
				info.setAttribute("aria-hidden", "true");
			} else {
				button.checked = true;
				expand.tabIndex = 0;
				info.setAttribute("aria-hidden", "false");
			}
		}
	});
});
```

Another no-JS component is the lightbox. I found this ingenious solution that uses `:target` to trigger the lightbox activation.

<figure>
<figcaption>Pure CSS Lightbox by <a href="https://codepen.io/gschier">Gregory Schier</a></figcaption>
<p class="codepen" data-height="375" data-theme-id="39292" data-default-tab="result" data-slug-hash="HCoqh" data-user="gschier" style="height: 375px"><span>See the Pen <a href="https://codepen.io/gschier/pen/HCoqh">Pure CSS Lightbox</a> by Gregory Schier (<a href="https://codepen.io/gschier">@gschier</a>) on <a href="https://codepen.io">CodePen</a>.</span></p>
</figure>

I styled it with some basic CSS transitions and a loading icon, then added enhanced Javascript functionality on top to cycle through images and use keyboard shortcuts. The background is separate from the image so that it doesn't fade in and out when you use the arrow key to tab to another image.

{% image './static/images/photography/2021-03-02-home.jpg', 'Click on this sunset photo to try out the lightbox', 'horizontal', 'full', 'posts', '2021-03-02-home', true %}

## Eleventy

I really love how easy it is to organize your files and code any way you want with Eleventy. Each of the visual homepage sections and my blog are Eleventy collections. Here are a couple of Eleventy plugins/filters/shortcodes that I found useful:

<p class="caption">Limit the number of items in an Eleventy collection</p>

``` js
eleventyConfig.addFilter("limit", (array, limit) => {
	return array.slice(0, limit);
});
```

<p class="caption"><a href="https://github.com/11ty/eleventy/issues/410#issuecomment-462821193">Show post excerpt for blog collection</a></p>

``` js
eleventyConfig.addShortcode('excerpt', post => {
	if (!post.hasOwnProperty('templateContent')) {
		console.warn('❌ Failed to extract excerpt: Document has no property `templateContent`.');
		return;
	}

	const excerptSeparator = '<!--more-->';
	const content = post.templateContent;

	if (content.includes(excerptSeparator)) {
		return content.substring(0, content.indexOf(excerptSeparator)).trim();
	}

	const pCloseTag = '</p>';
		if (content.includes(pCloseTag)) {
		return content.substring(0, content.indexOf(pCloseTag) + pCloseTag.length);
	}

	return content;
});
```

## Previous versions

These days, I'm loath to lose any previous website content, even content that is no longer relevant or even embarrassing. I decided to upload an archive of as many versions of my website as possible. The only one I'm currently missing is the very first version that was built in Wordpress and hosted by Hostgator (I wasn't using Github for versioning at that time), but the posts are preserved in the next version. I'm even working on getting old posts from previous blogs (Xanga, Tumblr, etc) onto this blog.

1. [Version 1](/v1/)
1. [Version 2](/v2/)
1. [Version 3](/v3/)
1. [Version 4](/v4/)

## Blog

Last but not least, I have this blog. The layout I'm using for the other pages wasn't really conducive to a blog format, so I created an entirely separate set of styles. One of the things I really love about this site is the font, [Recursive](https://www.recursive.design). It's a variable font that I'm using for every single part of the blog site, including the code snippets. You can even animate between the proportional and monospace versions!

<figure class="animation">
	<figcaption>Animation of font variable settings</figcaption>
	<div>
		<span class="animating">recursive.design</span>
	</div>
	<figcaption>
		<button class="pause"><span>Pause animation</span></button>
		<button class="play"><span>Play animation</span></button>
	</figcaption>
</figure>

## That's all, folks.

It's a bit messy, and I have more direct commits than I should, but if you want to check out the code for this website, you can [view the repo](https://github.com/gabriellewee/portfolio).

I keep making small changes here and there, but the heavy lifting is done. I'm hoping to write here more regularly in the future!

<div class="lightbox-group">
	<a class="lightbox" id="2021-07-26-website-home-lightbox" href="#2021-07-26-website-home">
		<span style="background-image: url('/static/images/writing/2021-07-26-website-home.png')"></span>
	</a>
	<a class="lightbox" id="2021-07-26-website-home-project-top-lightbox" href="#2021-07-26-website-project-top">
		<span style="background-image: url('/static/images/writing/2021-07-26-website-project-top.png')"></span>
	</a>
	<a class="lightbox" id="2021-07-26-website-home-project-middle-lightbox" href="#2021-07-26-website-project-middle">
		<span style="background-image: url('/static/images/writing/2021-07-26-website-project-middle.png')"></span>
	</a>
	<a class="lightbox" id="2021-07-26-portfolio-icons-lightbox" href="#2021-07-26-portfolio-icons">
		<span style="background-image: url('/static/images/writing/2021-07-26-portfolio-icons.png')"></span>
	</a>
	<a class="lightbox light-dark" id="2021-07-26-website-v4-lightbox" href="#2021-07-26-website-v4">
		<span style="background-image: url('/static/images/writing/2021-07-26-website-v4-dark.png')"></span>
		<span style="background-image: url('/static/images/writing/2021-07-26-website-v4-light.png')"></span>
	</a>
	<a class="lightbox light-dark" id="2021-07-26-current-website-lightbox" href="#2021-07-26-current-website">
		<span style="background-image: url('/static/images/writing/2021-07-26-current-website-dark.png')"></span>
		<span style="background-image: url('/static/images/writing/2021-07-26-current-website-light.png')"></span>
	</a>
	<a class="lightbox" id="2021-03-02-home-lightbox" href="#2021-03-02-home">
		<span style="background-image: url('/static/images/photography/2021-03-02-home.jpg')"></span>
	</a>
	<div class="lightbox-background"></div>
</div>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>