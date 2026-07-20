import { waitForGlobals } from '../helpers/domHelpers.js';

// Popups
export const popup = (popups = "[popover]") => {
	document.querySelectorAll(popups).forEach((popup) => {
		waitForGlobals(["gsap", "ScrollTrigger"], (gsap, ScrollTrigger) => {
			ScrollTrigger.create({
				trigger: popup,
				start: "top top",
				end: "bottom top",
				onLeave: () => {
					if (popup.matches(":popover-open")) {
						popup.hidePopover();
					}
				},
			});
		});
	});
};