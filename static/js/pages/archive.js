let enter = gsap.timeline({ paused: true });
let posts = Array.from(document.querySelectorAll("li"));
posts.push(document.querySelector(".bottom"));

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

gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
	ScrollTrigger.create({
		trigger: ".page-archvie",
		start: "-10",
		end: "+=50",
		once: true,
		onEnter: self => enter.resume(),
		onLeave: self => enter.progress(1)
	});

	document.documentElement.addEventListener("click", () => {
		enter.progress(1)
	}, {once: true});
});

gsap.matchMedia().add("(prefers-reduced-motion: reduce)", () => {
	enter.progress(1);
});