import { waitForGlobals } from '../helpers/domHelpers.js';
import { enter, loading, refresh, animateQueries } from '../components/onloadAnimations.js';

waitForGlobals(["gsap", "TextPlugin"], (gsap, TextPlugin) => {
	gsap.registerPlugin(TextPlugin);

	const timeline = enter();
	const text = document.querySelector(".text");
	const posts = document.querySelectorAll("[data-anim]");

	timeline.set('.title', {
		opacity: 1
	});
	timeline.set('.cursor', {
		opacity: 1
	});
	timeline.from('.copy', {
		duration: text.innerHTML.length * .3,
		text: {
			value: "",
			preserveSpaces: true
		},
		ease: "none"
	});
	timeline.from('.apple', {
		duration: .6 * .3,
		text: {
			value: "",
			preserveSpaces: true
		},
		ease: "none"
	});
	timeline.set('.cursor', { className: 'cursor animated' });
	timeline.to(loading, {
		duration: .2,
		opacity: 0,
		y: "-100%",
		ease: "power1.out",
		onComplete() {
			loading.classList.add("hidden");
		}
	});
	posts.forEach(post => {
		timeline.fromTo(post, {
			opacity: 0,
			y: 20
		}, {
			duration: .5,
			opacity: 1,
			y: 0,
			onComplete() {
				if (post.hasAttribute("data-anim")) post.removeAttribute("data-anim");
				if (refresh) refresh.classList.remove("hidden");
			}
		}, "<.1");
	});

	animateQueries(timeline);
});