---
date: 2022-03-11
title: Mourning online.
external: [{"platform": "medium","url": "https://gabriellewee.medium.com/mourning-online-ac086c4eb87e"}]
---
Late last year, my paternal grandmother passed away. She was an incredible woman, flaws and all. I wrote a short eulogy for her funeral.

> One of my earliest memories of my grandmother was when I was about five years old. My parents had left me at her house for a few hours, and upon returning, found me hiding behind the sofa. They asked me what was wrong, and I told them I didn’t want to eat anymore. Ngin Ngin had fed me so much that I had finally had enough and had to remove myself from the situation.
>
> That was how Ngin Ngin was. Whenever I called or visited, she always greeted me by asking me if I wanted food. “Hoo mm oo” was her favorite phrase with me. “Do you want this?” And she would wave some delicious home cooked food in front of my face. One time I told her how much I loved her fu jook soup, and that ended up being the only soup she’d make for me for the next fifteen years.
>
> I don’t really speak Toisan, her dialect, and she didn’t really speak English, but we still managed to communicate. I would sit with her for hours while she painstakingly told her stories to me. About traveling to Hong Kong and the US, about her village in China and the famine she suffered though, about her struggles to raise her children by herself. She always emphasized that despite her struggles, God had blessed her with everything in her life.
>
> She always reminded me how much she loved me and would giggle whenever I hugged her or kissed her cheek. Even at her last, she was smiling as I held her hand and told her I loved her.
>
> I love you, Ngin Ngin, and I look forward to one day seeing you again in Heaven.

<!--more-->

![Me and Ngin Ngin](2022-03-11-baby.jpg 'Me and Ngin Ngin')

<div class="row-double">

![Me and Ngin Ngin visiting Ye Ye](2022-03-11-toddler.jpg 'Me and Ngin Ngin visiting Ye Ye')

![Me and Ngin Ngin at one of her recent birthdays](2022-03-11-adult.jpg 'Me and Ngin Ngin at one of her recent birthdays')

</div>

I miss Ngin Ngin a lot. I didn’t realize what a enormous rift her passing would leave in my life. Even writing about her now is still painful. I’m learning, slowly, to let myself grieve.

---

One of the things I never really thought about before she passed away was _mourning online_. I haven’t really had very many people close to me pass away in the recent years, and the few I knew of had some sort of social media presence where people could gather and share memories. My grandmother could barely operate a DVD player — there was no way she could manage Facebook or anything of the kind.

My family ended up asking me to create a website memorializing her. I thought this would be a quick and easy task, but it's actually really difficult to find what I was looking for:

<div class="highlight">

1. A minimal page that included a place for her obituary and memorial video
2. A self-moderated guestbook that anybody could sign without social media
3. Inexpensive or free to use

</div>

Most of the memorial websites I came across were not suitable for what I wanted. Many were outdated and looked like they were built twenty years ago. Others were free but were overwhelming and had too much information. Some wanted around $100 USD up front to unlock features and others had a monthly subscription.

I knew that I could make something better for Ngin Ngin, something that wouldn’t burden my family with constant fees and bloated extras. So here is what I came up with. 

## Setup

I decided to use my current setup that I’m working with on my personal website. It’s simple and straightforward — I built the site in [Eleventy](https://www.11ty.dev), stored it in [Github](https://github.com), and deployed it to [Netlify](https://www.netlify.com).

## Guestbooks and Netlify Forms

I really wanted to avoid using third-party software for the guestbook, so I decided to try out [Netlify Forms](https://www.netlify.com/products/forms/). The setup was a little complicated, but I figured it out in the end.

First, I set up the forms HTML in my template with spam filters. The [Netlify docs](https://docs.netlify.com/forms/setup/) have more detailed information on how to customize your form.

``` html
<form name="Guestbook" method="POST" data-netlify="true">
	<ul>
		<li class="guest-name">
			<fieldset class="line">
				<input required id="name" type="text" name="name" placeholder=" "/>
				<label for="name">Name*</label>
				<hr/>
			</fieldset>
		</li>
		<li class="guest-email">
			<fieldset class="line">
				<input required id="email" type="email" name="email" placeholder=" "/>
				<label for="email">Email*</label>
				<hr/>
			</fieldset>
		</li>
		<li class="guest-message">
			<fieldset>
				<textarea required id="message" name="message" rows="5" placeholder=" "></textarea>
				<label for="message">Message*</label>
			</fieldset>
		</li>
		<li class="guest-photo">
			<fieldset>
				<label for="photo">Add photo (optional)</label>
				<input id="photo" name="file" type="file" accept="image/*" placeholder=" "/>
			</fieldset>
		</li>
		<li hidden>
			<fieldset class="line">
				<input id="bots" name="bot-field"/>
				<label for="bots">Leave blank</label>
				<hr/>
			</fieldset>
		</li>
		<li class="guest-captcha">
			<div data-netlify-recaptcha="true"></div>
		</li>
		<li class="guest-submit">
			<button type="submit">Send</button>
		</li>
	</ul>
</form>
```

Next, I installed Eleventy Fetch with `npm install @11ty/eleventy-fetch`. Then, I created a JS file in `_data/` that grabs the form data.

1. You can find your Netlify site ID by going to `Site Settings > General > Site Details > Site Information > API ID`.
2. You can find your Netlify form ID by going to `Forms > Active forms > (your form)` and copying the long string at the end of the URL.
3. You can create a personal access token in your [Applications settings](https://app.netlify.com/user/applications?_ga=2.201187694.1144438264.1647038881-1877924727.1646553096#personal-access-tokens).

``` js
const Cache = require('@11ty/eleventy-fetch');

/**
 * Grabs the remote data and returns back an array of objects
 *
 * @returns {Array} Empty or array of objects
 */

module.exports = async () => {
	try {
		let url = "https://api.netlify.com/api/v1/sites/{SITE_ID}/forms/{FORM_ID}/submissions";

		/* This returns a promise */
		return Cache(url, {
			duration: '1d', // 1 day
			type: 'json',
			fetchOptions: {
				headers: {
					'Authorization': "Bearer {ACCESS_TOKEN}"
				}
			}
		});
	} catch(e) {
		return [];
	}
};
```

The last part was setting up the HTML for the form submissions, with a couple of small Eleventy filters for the date.

``` html
{% raw %}{% for guest in guests %}
	<section>
		<time datetime="{{guest.created_at|htmlDateString}}">{{guest.created_at|readableDataDate}}</time>
		<figure>
			<figcaption><cite><h3>{{guest.data.name}}</h3></cite></figcaption>
			<blockquote>{{guest.data.message}}</blockquote>
		</figure>
		<picture>
			<img src="{{guest.data.file.url}}" alt="">
		</picture>
	</section>
{% endfor %}{% endraw %}
```

## Video

The last part of putting the site together was formatting and uploading my grandmother’s memorial video. This took the longest — I had to gather over 70 years worth of old photos, organize them, scan them, and put them into a video. I did this with [Apple’s scan utility](https://support.apple.com/guide/mac-help/scan-images-documents-a-scanner-mac-mh28032/mac), Photoshop (to clean them up a bit), and Final Cut Pro (for the video itself). You can substitute Final Cut Pro with iMovie or the video editing software of your choice.

I chose not to host the video on YouTube or other sites, so the difficult part was getting the video to work on the website. I had to reduce the size to something that could load on a mobile device. I managed to get it down to about 40mb — which is still really large — but I figured it's the only large media on the site and it's not necessary to load it to use the site. I installed [FFmpeg](https://ffmpeg.org) and used it to reduce and convert my video via command line.

```
ffmpeg -y -i video.mov -c:v libx264 -crf 30 -profile:v high -movflags +faststart -s 1280:720 video.mp4
```

In order to upload the video file, I had to enable [Git LFS](https://git-lfs.github.com), [Netlify CLI](https://docs.netlify.com/cli/get-started/), and [Netlify Large Media](https://docs.netlify.com/large-media/setup/). I had a bit of trouble getting it to all work together, but definitely installing Netlify CLI globally helped.

Once I had the video uploaded, I could finally put it on the site. I know that `preload="metadata"` is only really a _suggestion_, but it’s better than nothing `¯\_(ツ)_/¯`

``` html
<video width="1280" height="720" controls preload="metadata" poster="poster.jpg">
	<source src="video.mp4" type="video/mp4">
</video>
```

## Conclusion

I threw together this website the week before my grandmother’s funeral. It was a madwoman’s dash to the finish line, and yet I’m proud of the work I did. I’m also happy that I was able to put it together in a way that will be easy to maintain for my family — I moderate the guestbook submissions through Netlify and all they have to pay for is the domain name — $12 a year, much more inexpensive than the other monthly subscriptions that don’t include a domain name. I don’t know if anybody has needs as specific as mine, but hopefully this helps someone out there.