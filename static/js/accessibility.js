const show = ((container = document.documentElement) => {
	hidden = Array.from(document.querySelectorAll("[hidden]"));
	if (hidden) {
		hidden.forEach(el => {
			el.removeAttribute("hidden");
		});
	}
})();

const accessibility = (() => {
	const options = Array.from(document.querySelectorAll("[data-option]"));
	if (!options || !window.matchMedia) return;

	let _true = (option, index) => {
		option.checked = true;
		option.setAttribute("checked", "");
		option.setAttribute("aria-pressed", "true");
	}
	let _false = (option, index) => {
		option.checked = false;
		option.removeAttribute("checked");
		option.setAttribute("aria-pressed", "false");
	}
	let _toggle = (option, index, _optionTrue, _optionFalse) => {
		if (option) option.addEventListener("click", e => {
			if (option.checked) {
				_optionTrue();
			} else {
				_optionFalse();
			}
		});

		if (option) option.addEventListener("keydown", e =>{
			if (e.key === "Enter") {
				if (option.checked) {
					_optionFalse();
				} else {
					_optionTrue();
				}
			}
		});
	}
	let _multiple = (option, index, _optionTrue) => {
		option.addEventListener("click", e => {
			_optionTrue();
		});

		option.addEventListener("keydown", e =>{
			if (e.key === "Enter") {
				_optionTrue();
			}
		});
	}

	options.forEach((option, index) =>{
		option.classList.add("inactive");
		if (option.getAttribute("name") === "theme") {
			const theme = window.matchMedia('(prefers-color-scheme: dark)');
			const themeLight = document.querySelector('meta[media="(prefers-color-scheme: light)"]');
			const themeDark = document.querySelector('meta[media="(prefers-color-scheme: dark)"]');

			if (theme.matches && !localStorage.getItem("theme")) {
				_true(option, index);
			} else if (!theme.matches && !localStorage.getItem("theme")) {
				_false(option, index);
			}

			let _optionTrue = () => {
				_true(option, index);

				document.documentElement.classList.remove("theme-light");
				document.documentElement.classList.add("theme-dark");

				if(themeLight) themeLight.setAttribute("content", '#1c2429');
				if(themeDark) themeDark.setAttribute("content", '#1c2429');

				localStorage.setItem("theme", "dark");
			}
			let _optionFalse = () => {
				_false(option, index);

				document.documentElement.classList.remove("theme-dark");
				document.documentElement.classList.add("theme-light");

				let tone = document.querySelector('input[name="tone"]:checked');
				let color = themeLight.getAttribute("data-default") || tone.getAttribute("data-color") || "#fae5e1";

				if(themeLight) themeLight.setAttribute("content", color);
				if(themeDark) themeDark.setAttribute("content", color);

				localStorage.setItem("theme", "light");
			}

			if (localStorage.getItem("theme") === "dark") {
				_optionTrue();
			} else if ((localStorage.getItem("theme") === "light")) {
				_optionFalse();
			}

			_toggle(option, index, _optionTrue, _optionFalse);
		} else if (option.getAttribute("name") === "tone") {
			const theme = document.querySelector('meta[content="#fae5e1"]');
			const tone = option.getAttribute("data-option");
			const color = option.getAttribute("data-color");
			const prefix = "tone-";

			let _optionTrue = () => {
				_true(option, index);
				options.forEach((other, index) =>{
					if(other.getAttribute("name") === "tone" && other != option) {
						_false(other, index)
					}
				});

				document.documentElement.classList.add(prefix + tone);
				let toneClasses = Array.from(document.documentElement.classList);
				toneClasses.forEach(toneClass => {
					if(toneClass.includes(prefix) && toneClass != prefix + tone) document.documentElement.classList.remove(toneClass);
				});

				if(theme && !document.documentElement.classList.contains("theme-dark")) theme.setAttribute("content", color);
				if (localStorage.getItem("tone") != tone) localStorage.setItem("tone", tone);
			}

			if (localStorage.getItem("tone") === tone) {
				_optionTrue();
			}

			_multiple(option, index, _optionTrue);
		} else if (option.getAttribute("name") === "contrast") {
			const contrast = window.matchMedia('(prefers-contrast: more)');
			if (contrast.matches && !localStorage.getItem("contrast")) {
				_true(option, index);
				document.documentElement.classList.add("theme-contrast");
			} else if (!contrast.matches && !localStorage.getItem("contrast")) {
				_false(option, index);
			}

			let _optionTrue = () => {
				_true(option, index);
				document.documentElement.classList.add("theme-contrast");
				localStorage.setItem("contrast", "true");
			}
			let _optionFalse = () => {
				_false(option, index);
				document.documentElement.classList.remove("theme-contrast");
				localStorage.setItem("contrast", "false");
			}

			if (localStorage.getItem("contrast") === "true") {
				_optionTrue();
			} else if ((localStorage.getItem("contrast") === "false")) {
				_optionFalse();
			}

			_toggle(option, index, _optionTrue, _optionFalse);
		} else if (option.getAttribute("name") === "transparency") {
			const transparency = window.matchMedia('(prefers-reduced-transparency: reduce)');
			if (transparency.matches && !localStorage.getItem("transparency")) {
				_true(option, index);
				document.documentElement.classList.add("theme-reduce-transparency");
			} else if (!transparency.matches && !localStorage.getItem("transparency")) {
				_false(option, index);
			}

			let _optionTrue = () => {
				_true(option, index);
				document.documentElement.classList.add("theme-reduce-transparency");
				localStorage.setItem("transparency", "false");
			}
			let _optionFalse = () => {
				_false(option, index);
				document.documentElement.classList.remove("theme-reduce-transparency");
				localStorage.setItem("transparency", "true");
			}

			if (localStorage.getItem("transparency") === "false") {
				_optionTrue();
			} else if ((localStorage.getItem("transparency") === "true")) {
				_optionFalse();
			}

			_toggle(option, index, _optionTrue, _optionFalse);
		} else if (option.getAttribute("name") === "load") {
			let _optionTrue = () => {
				_true(option, index);
				document.documentElement.classList.remove("theme-no-load");
				localStorage.setItem("load", "true");
			}
			let _optionFalse = () => {
				_false(option, index);
				document.documentElement.classList.add("theme-no-load");
				localStorage.setItem("load", "false");
			}
			
			if (localStorage.getItem("load") === "true") {
				_optionTrue();
			} else if ((localStorage.getItem("load") === "false")) {
				_optionFalse();
			}

			_toggle(option, index, _optionTrue, _optionFalse);
		} else if (option.getAttribute("data-option") === "reset") {
			option.addEventListener("click", e => {
				localStorage.clear();
				location.reload();
			});
		}
	});
})();