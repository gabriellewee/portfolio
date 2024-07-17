const popup = ((containers = Array.from(document.querySelectorAll("[data-popup]"))) => {
	if (!containers) return;
	containers.forEach(container =>{
		let popupWindow = container.querySelector("[data-popup-window]");
		let popupLabel = container.querySelector("[data-popup-label]");
		let popupTrigger = container.querySelector("[data-popup-trigger]");
		let popupClose = container.querySelector("[data-popup-close]");
		let triggers = Array.from([popupTrigger, popupClose]);

		let _true = () => {
			popupTrigger.checked = true;
			popupTrigger.setAttribute("checked", "");
			popupTrigger.setAttribute("aria-pressed", "true");
		}
		let _false = (focus) => {
			popupTrigger.checked = false;
			popupTrigger.removeAttribute("checked");
			popupTrigger.setAttribute("aria-pressed", "false");
			if (focus === true) {
				popupTrigger.focus();
			}
		}

		triggers.forEach(trigger =>{
			trigger.addEventListener("click",  e => {
				if (popupTrigger.checked) {
					_true();
				} else {
					_false();
				}
			});
			trigger.addEventListener("keydown",  e => {
				if (e.key === "Enter") {
					if (popupTrigger.checked) {
						_false(true);
					} else {
						_true();
					}
				}
			});
		});

		container.addEventListener("keydown",  e => {
			if (e.key === "Escape") {
				_false(true);
			}
		});

		ScrollTrigger.create({
			trigger: popupWindow,
			start: "top top",
			end: "bottom top",
			onLeave: self => {
				if (popupTrigger.checked) {
					_false();
				}
			}
		});

		if (container.hasAttribute("data-copy")) {
			let copyElem = container.querySelector("[data-clipboard-text]");
			triggers.forEach(trigger =>{
				trigger.addEventListener("keydown",  e => {
					if (e.key === "Enter") {
						if (popupTrigger.checked) {
							copyElem.classList.add("hidden");
						}
					}
				});
				trigger.addEventListener("click",  e => {
					if (popupTrigger.checked) {
						setTimeout(() => {
							copyElem.classList.add("hidden");
						}, 300);
					}
				});
			});

			let copyButton = container.querySelector("[data-clipboard-button]");
			copyButton.removeAttribute("disabled");
			let clipboard = new ClipboardJS(copyButton);

			clipboard.on("success", e => {
				copyElem.classList.remove("hidden");
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
					copyElem.classList.add("hidden");
				}
			});
		}
	})
})();