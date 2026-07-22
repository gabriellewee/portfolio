// Check and uncheck inputs
export const setChecked = (checkbox, checked = true) => {
	checkbox.checked = checked;
	checked ? checkbox.setAttribute("checked", "") : checkbox.removeAttribute("checked");
};

// Event listeners for toggling option
export const onToggle = (toggle, onTrue, onFalse) => {
	toggle.addEventListener("click", () => (toggle.checked ? onTrue() : onFalse()));
	toggle.addEventListener("keydown", (e) => {
		if (e.key === "Enter") toggle.checked ? onFalse() : onTrue();
	});
};

// Event listeners for radio inputs
export const onClickOnly = (radio, handler) => {
	radio.addEventListener("click", handler);
	radio.addEventListener("keydown", (e) => {
		if (e.key === "Enter") handler();
	});
};

// Preferences popup
export const preferences = (options = document.querySelectorAll("[data-option]")) => {
	if (!window.matchMedia) return;

	const $html = document.documentElement;
	const resetButton = document.querySelector("[data-reset]");
	const preferenceKeys = [...new Set([...options].map((el) => el.name).filter(Boolean))];

	const resetButtonVisibility = () => {
		const hasPreferences = preferenceKeys.some((key) => localStorage.getItem(key) !== null);
		resetButton?.classList.toggle("active", hasPreferences);
	};

	const setPreference = (key, value) => {
		localStorage.setItem(key, value);
		resetButtonVisibility();
	};

	const applyThemeDark = () => {
		$html.classList.remove("theme-light");
		$html.classList.add("theme-dark");

		const metaLight = document.querySelector('meta[media="(prefers-color-scheme: light)"]');
		const metaDark = document.querySelector('meta[media="(prefers-color-scheme: dark)"]');

		[metaLight, metaDark].forEach((meta) => {
			meta?.setAttribute("content", "#1c2429");
		});

		setPreference("theme", "dark");
	};

	const applyThemeLight = () => {
		$html.classList.remove("theme-dark");
		$html.classList.add("theme-light");

		const metaLight = document.querySelector('meta[media="(prefers-color-scheme: light)"]');
		const metaDark = document.querySelector('meta[media="(prefers-color-scheme: dark)"]');
		const tone = document.querySelector('input[name="tone"]:checked');
		const color = metaLight?.getAttribute("data-default") || tone?.getAttribute("data-color") || "#fae5e1";

		[metaLight, metaDark].forEach((meta) => {
			meta?.setAttribute("content", color);
		});

		setPreference("theme", "light");
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
				if (storedTheme === "dark") {
					applyThemeDark();
					setChecked(el);
				}
				if (storedTheme === "light") {
					applyThemeLight();
					setChecked(el, false);
				}

				onToggle(el, () => {
					setChecked(el);
					applyThemeDark();
				}, () => {
					setChecked(el, false);
					applyThemeLight();
				});
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
					if (themeMeta && !$html.classList.contains("theme-dark")) themeMeta.setAttribute("content", color);

					setPreference("tone", tone);
				};

				if (storedTone === tone) applyTone();
				onClickOnly(el, applyTone);
				break;
			}

			case "contrast": {
				const prefers = window.matchMedia("(prefers-contrast: more)").matches;
				const stored = localStorage.getItem("contrast");

				if (!stored) setChecked(el, prefers);
				if (stored === "true") {
					setChecked(el);
					$html.classList.add("theme-contrast");
				}
				if (stored === "false") setChecked(el, false);

				onToggle(el, () => {
					setChecked(el);
					$html.classList.add("theme-contrast");
					setPreference("contrast", "true");
				}, () => {
					setChecked(el, false);
					$html.classList.remove("theme-contrast");
					setPreference("contrast", "false");
				});
				break;
			}

			case "transparency": {
				const prefers = window.matchMedia("(prefers-reduced-transparency: reduce)").matches;
				const stored = localStorage.getItem("transparency");

				if (!stored) setChecked(el, prefers);
				if (stored === "false") {
					setChecked(el);
					$html.classList.add("theme-reduce-transparency");
				}
				if (stored === "true") setChecked(el, false);

				onToggle(el, () => {
					setChecked(el);
					$html.classList.add("theme-reduce-transparency");
					setPreference("transparency", "false");
				}, () => {
					setChecked(el, false);
					$html.classList.remove("theme-reduce-transparency");
					setPreference("transparency", "true");
				});
				break;
			}

			case "load": {
				const stored = localStorage.getItem("load");

				if (stored === "true") {
					setChecked(el);
					$html.classList.remove("theme-no-load");
				} else if (stored === "false") {
					setChecked(el, false);
					$html.classList.add("theme-no-load");
				}

				onToggle(el, () => {
					setChecked(el);
					$html.classList.remove("theme-no-load");
					setPreference("load", "true");
				}, () => {
					setChecked(el, false);
					$html.classList.add("theme-no-load");
					setPreference("load", "false");
				});
				break;
			}

			default: {
				if (option === "reset") {
					el.addEventListener("click", () => {
						preferenceKeys.forEach((key) => localStorage.removeItem(key));
						location.reload();
					});
				}
			}
		}
	});

	resetButtonVisibility();
};
