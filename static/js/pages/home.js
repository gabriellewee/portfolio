let key = document.body.classList[0].slice(5);
let enter = gsap.timeline({ paused: true });
let text = document.querySelector(".text");
let message = document.querySelector(".message");
let posts = Array.from(document.querySelectorAll(".post-animate"));
posts.push(document.querySelector(".bottom"));

enter.fromTo(message, {
	opacity: 0,
	y: "100%"
}, {
	duration: .1,
	opacity: 1,
	y: 0,
	ease: "power1.out"
});
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
enter.to(message, {
	duration: .2,
	opacity: 0,
	y: "-100%",
	ease: "power1.out",
	onComplete() {
		message.classList.add("hidden");
	}
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
		y: 0,
		onComplete() {
			if (post.classList.contains("post-animate")) post.classList.remove("post-animate");
	    }
	}, "<.1");
});

animateQueries(enter, key);