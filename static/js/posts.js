lightbox("[data-media-expand]", "[data-lightbox]");
timeAgo("[data-time]");

const smoothScrollLinks = ((links = Array.from(document.querySelectorAll("[data-anchor]"))) => {
	if (!links) return;
	let mainContent = document.querySelector("main");
	links.forEach(link=>{
		link.setAttribute("aria-hidden", "true");
		let linkHref = link.getAttribute("href").substring(1);
		let targetLink = document.getElementById(linkHref);
		link.addEventListener("click", e => {
			targetLink.scrollIntoView({ behavior: "smooth" });
		});
	});
	if (window.location.hash) {
		let scrollHash = window.location.hash.substring(1);
		let scrollLocation = document.getElementById(scrollHash);
		if (scrollLocation) {
			imagesLoaded(mainContent, { background: true }, () =>{
				setTimeout(() => {
					scrollLocation.scrollIntoView({ behavior: "smooth" });
				}, 300);
			});
		}
	}
})();

const copyCode = ((pres = Array.from(document.querySelectorAll("pre:has(code)"))) => {
	if (!pres || !navigator.clipboard) return;
	pres.forEach(pre=> {
		let button = document.createElement("button");
		button.innerHTML = `<span></span>`;
		button.style.setProperty('--tooltip-label', `"Copied"`);
		button.setAttribute("aria-label", "Copy code");
		button.classList.add("tooltip", "tooltip-left", "dark", "hidden");
		pre.appendChild(button);
		let code = pre.querySelector("code");

		button.addEventListener("click", async () => {
			button.classList.remove("hidden");
			await navigator.clipboard.writeText(code.innerText);
			setTimeout(() => {
				button.classList.add("hidden");
			}, 3000);
		});
	});
})();