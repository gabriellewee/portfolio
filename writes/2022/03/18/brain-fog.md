---json
{
	"date": "2022-03-18",
	"title": "Brain fog.",
	"layout": "layouts/post.njk",
	"templateEngineOverride": "md,njk",
	"photos": [
		{
			"name": "er-iv",
			"type": "jpg",
			"description": "The photo I sent to my family when I went to the ER"
		},
		{
			"name": "cat",
			"type": "jpg",
			"description": "My cat cuddling me one morning while I was sick in bed"
		},
		{
			"name": "selfie",
			"type": "jpg",
			"description": "Trying out neon green and pink makeup and velcro roller hair"
		},
		{
			"name": "jaw-cooper",
			"type": "jpg",
			"description": "Art poster by JAW Cooper from a Kickstarter I supported"
		},
		{
			"name": "soeymilk",
			"type": "jpg",
			"description": "Original art by soeymilk that I purchased at Comic Con"
		}
	]
}
---

December and January were rough months for me. Work was stressful, my grandmother passed away, and then in January I suffered from debilitating migraines for three straight weeks. I think it was the culmination of all the anxiety and stress I was holding inside.

Those three weeks passed like a fever dream. I would get up from bed to go lay on the couch, and throw back Tylenol and Excedrin every few hours. My moans of pain became so constant that I almost didn’t notice them anymore. I went to the ER once and they pumped me full of Tylenol and Benadryl. My dreams were filled with monsters who lurked in the shadows and devoured people. I cried constantly. I threw up almost everything I ate. We kept a bucket next to me at all times along with a basket full of meds.

<div class="row-double">
{% for photo in photos | index(1) %}{% image './static/images/writing/' + date + '-' + photo.name + '.' + photo.type, photo.description, 'default', 'lightbox' %}{% endfor %}

{% for photo in photos | index(2) %}{% image './static/images/writing/' + date + '-' + photo.name + '.' + photo.type, photo.description, 'default', 'lightbox' %}{% endfor %}
</div>

Sounds were especially painful. Everything was loud and echoed uncontrollably through my brain. I could literally hear music throughout the night even though there was almost complete silence. Actually listening to music was painful and I avoided it as much as I could.

Visuals weren’t any better — I felt like I was hallucinating. Dark corners seemed to hold the monsters I dreamed about. I kept getting aura-like symptoms — the precursor to migraines — but I couldn’t tell at the time because all the migraines and auras and symptoms blended together. I felt like I had a permanent large sunspot obscuring all of my vision. I’d regularly see cracks of light all over my otherwise blurry vision.

Finally, at the beginning of February, my migraines began to subside. I was fortunate enough to have a sympathetic manager and team lead who gave me all the time off I needed, and loved ones to take care of me while I was sick. Without them, I don’t know where I’d be.

Even the symptoms of recovery were awful. I felt like my brain was resetting itself. All my senses were numbed (perhaps because they were so intense while I was sick). I couldn’t taste, smell, or feel anything. My ears felt muffled. A hot shower felt lukewarm. Even holding my cat felt like nothing but weight. 

I also went through a period of excruciating, extreme emotions. One day I would be wildly euphoric, giggling uncontrollably and dancing around the house. The next day, I would sob uncontrollably and feel like I was falling back into migraine territory. The swings were unpredictable and intense — I felt like my brain was testing out what range I had left after being sick.

The worst, though, was the brain fog. I prided myself on being a quick thinker, always ready with a riposte, and fast with my code. I couldn’t even look at a basic HTML page and understand what was going on. My favorite activity, reading, was impossible. People would ask me questions and it would take me several minutes to respond instead of seconds. I felt like a part of myself had been stolen by the migraines.

I truly believed I was going insane that entire month. I can look back now and understand that I was under extreme duress, but at the time, I felt like my body was betraying me. I kept trying to work, kept trying to live my normal life. It’s only now, a month and a half later, that the last of my recovery symptoms is starting to disappear. I still get the massive sun spot when I move too fast, and I have a sensitive spot on my head right where it hurt.

The entire experience has left me grateful for my current life. I’ve started to be able to enjoy my hobbies again. I’m putting up artwork on my walls, trying out new makeup, even coding. I’m finally myself again, and even though I know the migraines will probably be a reoccuring problem, hopefully this experience has left me prepared for what will come.

<div class="row-triple">
{% for photo in photos | index(3) %}{% image './static/images/writing/' + date + '-' + photo.name + '.' + photo.type, photo.description, 'default', 'lightbox' %}{% endfor %}

{% for photo in photos | index(4) %}{% image './static/images/writing/' + date + '-' + photo.name + '.' + photo.type, photo.description, 'default', 'lightbox' %}{% endfor %}

{% for photo in photos | index(5) %}{% image './static/images/writing/' + date + '-' + photo.name + '.' + photo.type, photo.description, 'default', 'lightbox' %}{% endfor %}

<div class="lightbox-group">
	{% for photo in photos %}<a class="lightbox" role="dialog" aria-label="Modal" aria-modal="true" id="{{date}}-{{photo.name}}-lightbox" href="#{{photo.name}}">
		<figure class="image">
			{% image './static/images/writing/' + date + '-' + photo.name + '.' + photo.type, photo.description, 'screen' %}
		</figure>
	</a>{% endfor %}
	<div class="lightbox-background"></div>
</div>