// Remove `hidden`` attribute from all elements
export const showAllHidden = (hidden = "[hidden]") => {
	document.querySelectorAll(hidden).forEach((el) => el.removeAttribute("hidden"));
};

// Buttons for refreshing code post iframes
export const refreshIframes = (buttons = "[data-reload]") => {
	document.querySelectorAll(buttons).forEach((button) => {
		const frame = button.closest("figure, div")?.querySelector("iframe");
		if (!frame) return;

		const refresh = () => (frame.src = frame.src);

		button.addEventListener("click", refresh);
		button.addEventListener("keydown", (e) => {
			if (e.key === "Enter") refresh();
		});
	});
};

// Enable copy buttons to access clipboard
export const enableClipboardButtons = (buttons = "[data-clip]") => {
	if (!navigator.clipboard) return;

	document.querySelectorAll(buttons).forEach((button) => {
		button.removeAttribute("disabled");
		let text = button.getAttribute("data-clip");
		let target = text;

		if (/^[^a-zA-Z0-9]/.test(text)) {
			const el = document.querySelector(text);
			if (!el) return;
			text = el.value || el.textContent || "";
			target = el;
		}

		const toggleVisibility = (show) => {
			if (button.hasAttribute("data-clip-target") && target instanceof HTMLElement) {
				target.classList.toggle("hidden", !show);
			} else if (button instanceof HTMLInputElement) {
				const parent = button.parentNode;
				parent.classList.toggle("hidden", !show);
				if (show) button.select();
			} else {
				button.classList.toggle("hidden", !show);
			}
		};

		button.addEventListener("click", async (e) => {
			e.preventDefault();
			await navigator.clipboard.writeText(text);
			toggleVisibility(true);
			setTimeout(() => toggleVisibility(false), 3000);
		});
	});
};

// Enable copy for pre/code blocks
export const enableClipboardCode = (pres = "pre:has(code)") => {
	if (!navigator.clipboard) return;

	document.querySelectorAll(pres).forEach((pre) => {
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
};

// Open external links in new tab
export const targetBlankLinks = (links = "a") => {
	document.querySelectorAll(links).forEach((anchor) => {
		const href = anchor.getAttribute("href");
		if (/^(https?:)?\/\//.test(href)) {
			anchor.target = "_blank";
			anchor.rel = "noopener noreferrer";
		}
	});
};

// Scroll to anchors
export const scrollToAnchors = (links = "[data-anchor]", mainContent = "main") => {
	const scrollToId = (id) => {
		const el = document.getElementById(id);
		if (el) el.scrollIntoView({ behavior: "smooth" });
	};

	document.querySelectorAll(links).forEach((link) => {
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
};

// Wait for libraries to load
export const waitForGlobals = (names, callback, interval = 50, maxAttempts = 20) => {
	let attempts = 0;

	const check = () => {
		const values = names.map((name) => window[name]);
		const allAvailable = values.every((val) => typeof val !== "undefined");

		if (allAvailable) {
			callback(...values);
		} else if (attempts < maxAttempts) {
			attempts++;
			setTimeout(check, interval);
		} else {
			console.warn(`⚠️ Globals [${names.join(", ")}] not found after ${maxAttempts} attempts.`);
			console.warn(callback);
		}
	};

	check();
};