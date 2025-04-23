import { waitForGlobals } from '../helpers/domHelpers.js';

// avatar messages
export const enter = gsap.timeline({ paused: true });
export const loading = document.querySelector(".loading");
export const refresh = document.querySelector(".go-home");

// onload animation setup
export const animateQueries = (
	timeline = enter,
	key = document.body.classList[0].slice(5)
) => {
	new imagesLoaded(document.body, () => {
		if (window.scrollY > 0) timeline.progress(1);
	});

	const storageItem = `${key}PageAnimation`;

	waitForGlobals(["gsap", "ScrollTrigger"], (gsap, ScrollTrigger) => {
		window.onload = () => {
			gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
				if (sessionStorage.getItem(storageItem) === null) {
					gsap.to(loading, {
						duration: .2,
						opacity: 1,
						y: 0,
						ease: "power1.out"
					});

					ScrollTrigger.create({
						trigger: document.body,
						start: "-10",
						end: "50",
						once: true,
						onEnter: () => timeline.resume(),
						onLeave: () => timeline.progress(1)
					});

					["click", "keydown"].forEach(event => {
						document.documentElement.addEventListener(event, () => {
							timeline.progress(1);
						}, { once: true });
					});

					sessionStorage.setItem(storageItem, true);
				} else {
					document.documentElement.classList.add("loaded");
					timeline.progress(1);
				}
			});
		}

		gsap.matchMedia().add("(prefers-reduced-motion: reduce)", () => {
			timeline.progress(1);
		});
	});
}

// onload animations
export const animateItems = (
	items = document.querySelectorAll("[data-anim]"),
	key = document.body.classList[0].slice(5),
) => {
	waitForGlobals(["gsap", "ScrollTrigger"], (gsap, ScrollTrigger) => {
		if(loading) {
			let loaded = loading.nextElementSibling;

			enter.to(loading, {
				duration: .2,
				opacity: 0,
				y: "-100%",
				ease: "power1.out",
				onComplete() {
					loading.classList.add("hidden");
				}
			});
			enter.to(loaded, {
				duration: .2,
				opacity: 1,
				y: 0,
				ease: "power1.out"
			});
		}

		items.forEach(item => {
			enter.fromTo(item, {
				opacity: 0,
				y: 20
			}, {
				duration: .5,
				opacity: 1,
				y: 0,
				onComplete() {
					if (item.hasAttribute("data-anim")) item.removeAttribute("data-anim");
					if (refresh) refresh.classList.remove("hidden");
				}
			}, "<.1");
		});

		animateQueries();
	});
};