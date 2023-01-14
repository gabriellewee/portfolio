/*! Various site scripts */
const noJS = ((container = document.documentElement) => {
	container.classList.remove("no-js");
	container.classList.add("js");
	hidden = Array.from(document.querySelectorAll("[hidden]"));
	if(hidden) {
		hidden.forEach(el => {
			el.removeAttribute("hidden");
		});
	}
})();

let container = document.querySelector(".grid-isotope");
if(container) {
	let iso = new Isotope(container, {
		percentPosition: true,
		layoutMode: "packery",
		itemSelector: ".grid-item",
		packery: {
			gutter: 24
		}
	});
	let scroll = new InfiniteScroll(container, {
		button: '.load',
		path: '.next',
		append: '.post',
		scrollThreshold: false,
		outlayer: iso
	});
}

const loading = new imagesLoaded(document.body, () => {
	setTimeout(() => {
		if(container && iso != undefined) {
			iso.layout();
		}
		setTimeout(() => {
			document.documentElement.classList.add("loaded")
		}, 250);
	}, 100);
});

const popup = ((containers = Array.from(document.querySelectorAll(".popup"))) => {
	if(!containers) return;
	containers.forEach(container =>{
		let popupWindow = container.querySelector(".popup-window");
		let popupLabel = container.querySelector(".popup-label");

		let popupTrigger = container.querySelector(".popup-button");
		let popupClose = container.querySelector(".close");
		let triggers = Array.from([popupTrigger, popupClose]);

		triggers.forEach(trigger =>{
			trigger.addEventListener("keydown",  e => {
				if (e.key === "Enter") {
					if(popupTrigger.checked) {
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

		if(container.hasAttribute("data-copy")) {
			let copyElem = container.querySelector(".username");
			triggers.forEach(trigger =>{
				trigger.addEventListener("keydown",  e => {
					if (e.key === "Enter") {
						if(popupTrigger.checked) {
							copyElem.classList.remove("copied");
						}
					}
				});
				trigger.addEventListener("click",  e => {
					if(popupTrigger.checked) {
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
				copy.parentNode.classList.add("copied");
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