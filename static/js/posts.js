// Run scripts
lightbox("[data-media-expand]", "[data-lightbox]");
timeAgo("[data-time]");

// Smooth scroll to anchors
(() => {
	const links = document.querySelectorAll("[data-anchor]");
	const mainContent = document.querySelector("main");

	const scrollToId = (id) => {
		const el = document.getElementById(id);
		if (el) el.scrollIntoView({ behavior: "smooth" });
	};

	links.forEach((link) => {
		link.setAttribute("aria-hidden", "true");
		const href = link.getAttribute("href")?.replace(/^#/, "");
		if (!href) return;

		link.addEventListener("click", (e) => {
			e.preventDefault();
			scrollToId(href);
		});
	});

	if (window.location.hash) {
		const scrollHash = window.location.hash.substring(1);
		const scrollTarget = document.getElementById(scrollHash);

		if (scrollTarget) {
			imagesLoaded(mainContent, { background: true }, () => {
				setTimeout(() => scrollToId(scrollHash), 300);
			});
		}
	}
})();

// Copy code
(() => {
	if (!navigator.clipboard) return;

	const pres = document.querySelectorAll("pre:has(code)");

	pres.forEach((pre) => {
		const code = pre.querySelector("code");
		if (!code) return;

		const button = document.createElement("button");
		button.innerHTML = `<span></span>`;
		button.setAttribute("aria-label", "Copy code");
		button.style.setProperty("--tooltip-label", `"Copied"`);
		button.classList.add("tooltip", "tooltip-left", "dark", "hidden");

		pre.appendChild(button);

		const toggleTooltip = (visible) => {
			button.classList.toggle("hidden", !visible);
		};

		button.addEventListener("click", async () => {
			toggleTooltip(true);
			await navigator.clipboard.writeText(code.innerText);
			setTimeout(() => toggleTooltip(false), 3000);
		});
	});
})();