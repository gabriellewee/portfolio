const popup = ((containers = Array.from(document.querySelectorAll(".popup"))) => {
	if (!containers) return;
	containers.forEach(container =>{
		let popupWindow = container.querySelector(".popup-window");
		let popupLabel = container.querySelector(".popup-label");
		let popupTrigger = container.querySelector(".popup-button");
		let popupClose = container.querySelector(".close");
		let triggers = Array.from([popupTrigger, popupClose]);

		triggers.forEach(trigger =>{
			trigger.addEventListener("click",  e => {
				if (popupTrigger.checked) {
					popupTrigger.checked = true;
				} else {
					popupTrigger.checked = false;
					popupTrigger.focus();
				}
			});
			trigger.addEventListener("keydown",  e => {
				if (e.key === "Enter") {
					if (popupTrigger.checked) {
						popupTrigger.checked = false;
						popupTrigger.focus();
					} else {
						popupTrigger.checked = true;
					}
				}
			});
		});

		container.addEventListener("keydown",  e => {
			if (e.key === "Escape") {
				popupTrigger.checked = false;
				popupTrigger.focus();
			}
		});

		ScrollTrigger.create({
			trigger: popupWindow,
			start: "top top",
			end: "bottom top",
			onLeave: self => {
				if (popupTrigger.checked) {
					popupTrigger.checked = false;
				}
			}
		});

		if (container.hasAttribute("data-copy")) {
			let copyElem = container.querySelector(".username-input");
			triggers.forEach(trigger =>{
				trigger.addEventListener("keydown",  e => {
					if (e.key === "Enter") {
						if (popupTrigger.checked) {
							copyElem.classList.remove("copied");
						}
					}
				});
				trigger.addEventListener("click",  e => {
					if (popupTrigger.checked) {
						setTimeout(() => {
							copyElem.classList.remove("copied");
						}, 300);
					}
				});
			});

			let copyButton = container.querySelector(".copy-button");
			copyButton.removeAttribute("disabled");
			let clipboard = new ClipboardJS(copyButton);

			clipboard.on("success", e => {
				let copy = container.querySelector(e.trigger.getAttribute("data-clipboard-target"));
				copyElem.classList.add("copied");
				e.clearSelection();
			});
			copyButton.addEventListener("keydown", e => {
				if (e.key === "Enter") {
					setTimeout(() => {
						popupClose.focus();
					}, 50);
				}
			});
			container.addEventListener("keydown",  e => {
				if (e.key === "Escape") {
					copyElem.classList.remove("copied");
				}
			});
		}
	})
})();