---json
{
	"date": "2023-01-30",
	"title": "New year, new design.",
	"permalink": "/posts/{{date|linkDate}}/{{title|slugify}}/",
	"layout": "layouts/post.njk",
	"templateEngineOverride": "md,njk",
	"photos": [
		{
			"name": "photo-overlays",
			"type": "png",
			"description": "Different photo overlay layouts for different container widths"
		}
	]
}
---

I think I force myself to keep up with all the new things happening in web development by making myself redesign my site every couple of years or so. I never really consciously sit down to make comps and figure out all the details. The process is really more of me noodling on an idea I‘ve had for a while until it crystallizes into something I can use.

I realized towards the end of last year that I really missed Tumblr. I don‘t really miss the artwork and photos (I get those from other social media platforms these days) or even the community aspect. What I really miss is the **themes**!

Back then, I was used to making MySpace layouts and having to manually overwrite their built-in HTML in order to put what I wanted on the page. Tumblr felt like a breath of fresh air — a free, built-in CMS and community with the ability to write custom HTML templates for different kinds of posts. Different kinds of posts! Every other platform I had used up until that point had one kind of post with the ability to add other forms of media, like tweets having media attachments. But Tumblr‘s microblogging platform had 7 or 8 different kinds of posts and I could represent each of them differently than the rest.

<!-- moere -->

So I set out to recreate the *feeling* of a Tumblr blog but ✨for me✨. This eventually boiled down to four different post types:

1. **Text posts** — including these blog posts as well as my old blog posts from before 2015 and external articles that featured me or my writing.
2. **Photo posts** — including photography, graphics, and artwork. I pretty much brought these over from my last site iteration since I liked the implementation.
3. **Code posts** — My CodePen code snippets that I wanted to feature.
4. **Social media posts** — posts from other platforms that are directly related to either web dev or my other hobbies.

## Text posts

Text posts were easy enough to build - I‘m still using [Eleventy](http://11ty.dev) (updated to 2.0, which is exciting!) and could pull my [markdown posts](https://github.com/gabriellewee/portfolio/tree/netlify/posts) from the previous site. I also imported my old blog posts from 2012-2014 but decided to let them live in their own category so that I could treat them separately if needed. I took a lot of inspiration from the previous site styles, including the cut-off corners and angled buttons.

There was no straightforward way for me to add external articles, so I created an [Eleventy global data file](https://www.11ty.dev/docs/data-global/) with the same information as the rest of the text posts. I called these “feature posts”.

## Photo posts

I also imported photo posts from the previous site as well as the collection pages ([/photography](/photography/), [/graphic](/graphic/), [/art](/art/)), but I wanted to tweak the [information overlay](/posts/2021/07/26/setting-up-shop/#no-js) that I‘d previously designed. They still use a checkbox input to activate! I also included links if they were posted on another site like Instagram or Dribbble.

This was the first opportunity that I had seen to try out container queries, which I‘m really excited about. I attended An Event Apart 2022 in San Francisco last year and learned about container queries from [Chris Coyier](https://chriscoyier.net) and [Val Head](https://valhead.com).

{%- set number = 1 %}{% include 'pages/posts/image.html' %}

Portrait photos by default take up half the container width while landscape photos take up the entire container width, but with some photos I overrode the width to emphasize or deemphasize the post. If the post has enough width and height, a thumbnail of the photo shows up that when clicked, expands into a lightbox. If the container isn't tall enough to show a thumbnail, the text "Expand" replaces the thumbnail. On browsers that don‘t support container queries, the overlay is scrollable to view all content.

``` scss
.media-container {
	// set up container query
	@supports (container-type: size) {
		container-type: size;
		container-name: metadata;
	}
}
.media-overlay {
	overflow-y: auto;
}
.media-thumbnail {
	.media-expand {
		// hide the "Expand" text for large viewports when container queries aren‘t supported
		@supports not(container-type: size) {
			@include viewport($iphone) {
				.no-image {
					display: none;
				}
			}
		}
		// hide the "Expand" text for large containers when container queries are supported
		@container metadata (min-width: 320px) and (min-height: 400px) {
			.no-image {
				display: none;
			}
		}
	}
	.media-picture {
		width: 150px;
		// media queries to handle thumbnail display and sizing when container queries aren‘t supported
		@supports not(container-type: size) {
			@include viewport($iphone) {
				display: block;
			}
			@media only screen and (min-width: 450px) {
				width: 200px;
			}
			@include viewport(mobile) {
				width: 150px;
			}
			@include viewport($ipad-11) {
				width: 200px;
			}
		}
		// a more straightforward version when container queries are supported
		@container metadata (min-width: 320px) and (min-height: 400px) {
			display: block;
		}
		@container metadata (min-width: 400px) {
			width: 200px;
		}
	}
}

```

In order for the container queries to work in both directions (inline and block), the container needed to have a defined width and height. In order to solve this, I created a `stats` shortcode using [eleventy-img](https://www.11ty.dev/docs/plugins/image/) that gets the height and width of each image and outputs an aspect ratio. It can also output width, height, or orientation, which I found useful in other contexts.

**Shortcode:**
``` js
const Image = require("@11ty/eleventy-img");
const sharp = require("sharp");

module.exports = eleventyConfig => {
	eleventyConfig.addNunjucksAsyncShortcode("stats", async (src, type) => {
		let stats = await Image(src, {
			widths: [null],
			statsOnly: true
		});
		let width = stats["webp"][0].width;
		let height = stats["webp"][0].height;
		let result;
		let orientation;

		if(type === "width") {
			result = width;
		} else if(type === "height") {
			result = height
		} else if(type === "orientation") {
			width > height ? orientation = "landscape" : orientation = "portrait"
			result = orientation
		} else if(type === "ratio") {
			result = `${width} / ${height}`
		}

		return result;
	});
};
````

**Implementation:**
``` html
{% raw %}<figure style="aspect-ratio: {% stats './static/images/photography/2022-07-20-cat-garden.jpg', 'ratio' %};">
	<!-- image and information -->
</figure>{% endraw %}
```

**Output:**
``` html
{% raw %}<figure style="aspect-ratio: 3024 / 4032;">
	<!-- image and information -->
</figure>{% endraw %}
```

## Code posts

Each code post has an iframe, a link to the original CodePen pen, and a reload/replay button that refreshes the frame. I wanted to style my code posts independent of the CodePen UI, so the frame source code is hosted on my own site. Each frame source also has its own front matter, just like my text posts, so that it can be included on the front page.

<div class="row-double">
<figure>
<figcaption>My no-UI embed for <a href="https://codepen.io/gabriellewee/pen/zYGxNKa" target="_blank">Four-Quadrant CSS-Only Gradient</a></figcaption>
<iframe src="https://gabriellew.ee/code/quadrant/" width="600" height="400" title="Four-Quadrant CSS-Only Gradient" loading="lazy"></iframe>
</figure>

<figure>
<figcaption>CodePen embed for <a href="https://codepen.io/gabriellewee/pen/zYGxNKa" target="_blank">Four-Quadrant CSS-Only Gradient</a></figcaption>
<p class="codepen" data-height="400" data-theme-id="39292" data-default-tab="result" data-slug-hash="zYGxNKa" data-user="gabriellewee">
  <span>See the Pen <a href="https://codepen.io/gabriellewee/pen/zYGxNKa">
  Four-Quadrant CSS-Only Gradient</a> by Gabrielle Wee (<a href="https://codepen.io/gabriellewee">@gabriellewee</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
</figure>
</div>

## Social media posts

As of right now, the only social media posts that I‘m including on my site are Mastodon posts. I considered Twitter and Instagram, but Twitter‘s API is notoriously [out of commission](https://tapbots.com/tweetbot/) and I generally use Instagram for personal and not dev-related content. So Mastodon it is, for now!

[Eleventy-fetch](https://github.com/11ty/eleventy-fetch) has been super useful, as well as [Netlify environment variables](https://docs.netlify.com/configure-builds/environment-variables/). I set up a global data file called `mastodon.js` that caches my account‘s posts as well as an `.env` file that contains all of the same build variables I specified on Netlify.

``` js
const Cache = require('@11ty/eleventy-fetch');

module.exports = async () => {
	try {
		let key = process.env.MASTODON_API_KEY;
		let id = process.env.MASTODON_API_ID;
		let url = `https://mas.to/api/v1/accounts/${id}/statuses`;

		return Cache(url, {
			duration: '1d',
			type: 'json',
			fetchOptions: {
				headers: {
					'Authorization': `Bearer ${key}`
				}
			}
		});
	} catch(e) {
		return [];
	}
};
```

**In .eleventy.js:**
``` js
require('dotenv').config();
````

## Putting it all together

In order to get everything on the front page, I needed to have one category that Eleventy could paginate through. I decided to call this collection “entries” and add it as a tag to all four kinds of posts.

For [regular text posts](https://github.com/gabriellewee/portfolio/blob/netlify/_includes/layouts/post.njk), I include it as a tag in the front matter on my post template.

``` yaml
---
layout: layouts/base.njk
tags: entries
---
```

Code posts were the same except that they didn‘t use the post template so I put `tags: entries` into each individual file.

For [text feature posts](https://github.com/gabriellewee/portfolio/blob/netlify/collections/features.njk), [photo posts](https://github.com/gabriellewee/portfolio/blob/netlify/collections/photography.njk), and [social media posts](https://github.com/gabriellewee/portfolio/blob/netlify/collections/mastodon.njk), I created a collection page that mapped all the information from the global data files to the correct properties for posts using [eleventyComputed](https://www.11ty.dev/docs/data-computed/).

``` yaml
---js
{
	layout: "layouts/base.njk",
	key: "post",
	tags: "entries",
	category: "social",
	pagination: {
		data: "mastodon",
		size: 1,
		addAllPagesToCollections: true,
		alias: "mastodon"
	},
	permalink: false,
	eleventyComputed: {
		mastodon(data) {
			data.page.date = new Date(data.mastodon.created_at);
			data.content = data.mastodon.content;
			data.url = data.mastodon.url;
			data.media = data.mastodon.media_attachments;
			if (data.mastodon.reblog || data.mastodon.in_reply_to_account_id || data.mastodon.content.includes("https://gabriellew.ee")) data.tags = "";
		}
	}
}
---
```

I set `permalink: false` on all of these — photo posts already had all the information included and the others had permalink pages outside of my website.

I decided to filter my Mastodon posts and remove posts mentioning my site URL (since they‘d most likely just be a link to a blog post already on the front page) as well as replies/reposts. I‘d seen some implementations removing them entirely from the data, but Javascript is not my strong suit and I couldn‘t get it to work for me, so instead I changed the tag so that they were no longer included in the “entries” collection.

Now, in my `index.njk` file, I could paginate through “entries” and have everything I needed! Here‘s a much-abbreviated version of my post template (I have a lot more variables in the final version).

``` html
---
title: Home
layout: layouts/base.njk

pagination:
    data: collections.entries
    size: 16
    reverse: true
---

{% raw %}<div class="posts">
	{% for post in pagination.items %}
		<article class="post">
			<div class="post-wrapper">
				<header class="post-header">
					<div class="post-header-wrapper">
						<h2>
							<a href="{{post.url|url}}"><span>{{post.data.title|safe}}</span></a>
						</h2>
						<time datetime="{{post.page.date|htmlDateString}}">{{post.page.date|readableDate}}</time>
					</div>
				</header>
				<div class="post-content">
					<!-- {{post.content|safe}} or code post iframe or photo post information -->
				</div>
			</div>
		</article>
	{% endfor %}
</div>{% endraw %}
```

## Webmentions

Implementing webmentions was tricky. I ended up using eleventy-fetch again and set up [Webmention.io](https://webmention.io) and [Bridgy](https://brid.gy) to get my webmentions — here‘s [an article](https://daily-dev-tips.com/posts/implementing-webmentions-on-a-11ty-blog/) I read describing how to set that all up. I found out how to send outgoing webmentions from [James Mead](https://jamesmead.org/blog/2020-10-13-sending-webmentions-from-a-static-website) and how to set up an h-card from [Ashley Kolodziej](https://ashleykolodziej.com/add-webmentions-to-static-site/).

``` js
const Cache = require('@11ty/eleventy-fetch');

module.exports = async () => {
	try {
		let key = process.env.WEBMENTION_IO_KEY;
		let url = `https://webmention.io/api/mentions.json?token=${key}&per-page=90001`;

		return Cache(url, {
			duration: '1d',
			type: 'json'
		});
	} catch(e) {
		return [];
	}
};
```

I decided against a Javascript solution to sorting data (again, not my strong suit) and instead used a built-in Nunjucks filter called [groupby](https://mozilla.github.io/nunjucks/templating.html#groupby). This allowed me to group each mention by type (likes, reposts, links, and replies) and create different templates for each type. You can see the [full template here](https://github.com/gabriellewee/portfolio/blob/netlify/_includes/pages/posts/mentions.html).

``` html
{% raw %}<!-- set a pageLink variable so that only mentions for this page show up -->
{% set pageLink = site.url + page.url %}
<aside class="mentions">
	{% for type, webmentions in webmentions.links | groupby("activity.type") %}
		<div class="mentions-list">
			<ul>
				{% for webmention in webmentions %}
					{% if (webmention.target == pageLink) %}
						<li>
							<!-- webmention template -->
						</li>
					{% endif %}
				{% endfor %}
			</ul>
		</div>
	{% endfor %}{% endraw %}
</aside>
```

## Done (for now)

Figuring out each step of building this new site took a lot of time, research, and trial/error. I feel a little weird posting about all the things I did, especially as cobbled together as this feels. But I would have loved if I had been able to find this kind of information/compilation when I was building this site. If you have any questions, please feel free to contact me!