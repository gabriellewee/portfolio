let enter = gsap.timeline({ paused: true });
let text = document.querySelector(".text");
let posts = Array.from(document.querySelectorAll(".post-animate"));
posts.push(document.querySelector(".bottom"));

enter.set('.title', {
	opacity: 1
});
enter.set('.cursor', {
	opacity: 1
});
enter.from('.copy', {
	duration: text.innerHTML.length * .3,
	text: {
		value: "",
		preserveSpaces: true
	},
	ease: "none"
});
enter.from('.apple', {
	duration: .6 * .3,
	text: {
		value: "",
		preserveSpaces: true
	},
	ease: "none"
});
enter.set('.cursor', { className: 'cursor animated' });
enter.to('.message', {
	duration: .2,
	opacity: 0,
	y: "-100%"
});
enter.fromTo(".contact-sites", {
	opacity: 0,
	y: 20
}, {
	duration: .5,
	opacity: 1,
	y: 0
}, "<");
enter.fromTo(".contact-messages", {
	opacity: 0,
	y: 20
}, {
	duration: .5,
	opacity: 1,
	y: 0
}, "<.1");
posts.forEach(post => {
	enter.fromTo(post, {
		opacity: 0,
		y: 20
	}, {
		duration: .5,
		opacity: 1,
		y: 0
	}, "<.1");
});

new imagesLoaded(document.body, () => {
	if(window.scrollY > 0) {
		enter.progress(1);
	}
});

gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
	ScrollTrigger.create({
		trigger: ".page-index",
		start: "-10",
		end: "+=50",
		once: true,
		onEnter: self => enter.resume(),
		onLeave: self => enter.progress(1)
	});

	document.documentElement.addEventListener("click", () => {
		enter.progress(1)
	}, {once: true});

	document.documentElement.addEventListener("keydown", () => {
		enter.progress(1)
	}, {once: true});
});

gsap.matchMedia().add("(prefers-reduced-motion: reduce)", () => {
	enter.progress(1);
});