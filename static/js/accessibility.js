// Remove `hidden`` attribute from all elements
(() => {
	const hidden = document.querySelectorAll("[hidden]");
	hidden.forEach((el) => el.removeAttribute("hidden"));
})();

// Accessibility features
(() => {
	const options = Array.from(document.querySelectorAll("[data-option]"));
	if (!options.length || !window.matchMedia) return;

	const $html = document.documentElement;

	const setChecked = (el, checked = true) => {
		el.checked = checked;
		checked ? el.setAttribute("checked", "") : el.removeAttribute("checked");
	};

	const onToggle = (el, onTrue, onFalse) => {
		el.addEventListener("click", () => (el.checked ? onTrue() : onFalse()));
		el.addEventListener("keydown", (e) => {
			if (e.key === "Enter") el.checked ? onFalse() : onTrue();
		});
	};

	const onClickOnly = (el, handler) => {
		el.addEventListener("click", handler);
		el.addEventListener("keydown", (e) => {
			if (e.key === "Enter") handler();
		});
	};

	const applyThemeDark = () => {
		$html.classList.remove("theme-light");
		$html.classList.add("theme-dark");
		const metaLight = document.querySelector('meta[media="(prefers-color-scheme: light)"]');
		const metaDark = document.querySelector('meta[media="(prefers-color-scheme: dark)"]');
		if (metaLight) metaLight.setAttribute("content", "#1c2429");
		if (metaDark) metaDark.setAttribute("content", "#1c2429");
		localStorage.setItem("theme", "dark");
	};

	const applyThemeLight = () => {
		$html.classList.remove("theme-dark");
		$html.classList.add("theme-light");

		const metaLight = document.querySelector('meta[media="(prefers-color-scheme: light)"]');
		const metaDark = document.querySelector('meta[media="(prefers-color-scheme: dark)"]');
		const tone = document.querySelector('input[name="tone"]:checked');
		const color = metaLight?.getAttribute("data-default") || tone?.getAttribute("data-color") || "#fae5e1";

		if (metaLight) metaLight.setAttribute("content", color);
		if (metaDark) metaDark.setAttribute("content", color);

		localStorage.setItem("theme", "light");
	};

	options.forEach((el) => {
		const name = el.getAttribute("name");
		const option = el.getAttribute("data-option");
		el.classList.add("inactive");

		switch (name) {
			case "theme": {
				const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
				const storedTheme = localStorage.getItem("theme");

				if (!storedTheme) setChecked(el, prefersDark);
				if (storedTheme === "dark") applyThemeDark(), setChecked(el);
				if (storedTheme === "light") applyThemeLight(), setChecked(el, false);

				onToggle(el, () => (setChecked(el), applyThemeDark()), () => (setChecked(el, false), applyThemeLight()));
				break;
			}

			case "tone": {
				const storedTone = localStorage.getItem("tone");
				const tone = el.getAttribute("data-option");
				const color = el.getAttribute("data-color");
				const prefix = "tone-";

				const applyTone = () => {
					setChecked(el);
					options.forEach((o) => {
						if (o !== el && o.getAttribute("name") === "tone") setChecked(o, false);
					});

					$html.classList.add(`${prefix}${tone}`);
					$html.classList.forEach((cls) => {
						if (cls.startsWith(prefix) && cls !== `${prefix}${tone}`) $html.classList.remove(cls);
					});

					const themeMeta = document.querySelector('meta[content="#fae5e1"]');
					if (themeMeta && !$html.classList.contains("theme-dark")) {
						themeMeta.setAttribute("content", color);
					}

					localStorage.setItem("tone", tone);
				};

				if (storedTone === tone) applyTone();
				onClickOnly(el, applyTone);
				break;
			}

			case "contrast": {
				const prefersContrast = window.matchMedia("(prefers-contrast: more)").matches;
				const stored = localStorage.getItem("contrast");

				if (!stored) setChecked(el, prefersContrast);
				if (stored === "true") setChecked(el), $html.classList.add("theme-contrast");
				if (stored === "false") setChecked(el, false);

				onToggle(
					el,
					() => (setChecked(el), $html.classList.add("theme-contrast"), localStorage.setItem("contrast", "true")),
					() => (setChecked(el, false), $html.classList.remove("theme-contrast"), localStorage.setItem("contrast", "false"))
				);
				break;
			}

			case "transparency": {
				const prefersReduced = window.matchMedia("(prefers-reduced-transparency: reduce)").matches;
				const stored = localStorage.getItem("transparency");

				if (!stored) setChecked(el, prefersReduced);
				if (stored === "false") setChecked(el), $html.classList.add("theme-reduce-transparency");
				if (stored === "true") setChecked(el, false);

				onToggle(
					el,
					() => (setChecked(el), $html.classList.add("theme-reduce-transparency"), localStorage.setItem("transparency", "false")),
					() => (setChecked(el, false), $html.classList.remove("theme-reduce-transparency"), localStorage.setItem("transparency", "true"))
				);
				break;
			}

			case "load": {
				const stored = localStorage.getItem("load");

				if (stored === "true") setChecked(el), $html.classList.remove("theme-no-load");
				if (stored === "false") setChecked(el, false), $html.classList.add("theme-no-load");

				onToggle(
					el,
					() => (setChecked(el), $html.classList.remove("theme-no-load"), localStorage.setItem("load", "true")),
					() => (setChecked(el, false), $html.classList.add("theme-no-load"), localStorage.setItem("load", "false"))
				);
				break;
			}

			default: {
				if (option === "reset") {
					el.addEventListener("click", () => {
						localStorage.clear();
						location.reload();
					});
				}
			}
		}
	});
})();