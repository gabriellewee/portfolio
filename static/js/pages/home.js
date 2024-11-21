let key = document.body.classList[0].slice(5);
let enter = gsap.timeline({ paused: true });
let text = document.querySelector(".text");
let posts = Array.from(document.querySelectorAll("[data-anim]"));

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
enter.to(loading, {
	duration: .2,
	opacity: 0,
	y: "-100%",
	ease: "power1.out",
	onComplete() {
		loading.classList.add("hidden");
	}
});
posts.forEach(post => {
	enter.fromTo(post, {
		opacity: 0,
		y: 20
	}, {
		duration: .5,
		opacity: 1,
		y: 0,
		onComplete() {
			if (post.hasAttribute("data-anim")) post.removeAttribute("data-anim");
		}
	}, "<.1");
});

animateQueries(enter, key);