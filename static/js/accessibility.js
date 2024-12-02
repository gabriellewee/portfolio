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
	const labels = Array.from(document.querySelectorAll("[data-option-label]"));
	if (!options || !window.matchMedia) return;

	let _true = (option, index) => {
		option.checked = true;
		option.setAttribute("checked", "");
		labels[index].setAttribute("aria-pressed", "true");
	}
	let _false = (option, index) => {
		option.checked = false;
		option.removeAttribute("checked");
		labels[index].setAttribute("aria-pressed", "false");
	}
	let _toggle = (option, index, _optionTrue, _optionFalse) => {
		option.addEventListener("click", e => {
			if (option.checked) {
				_optionTrue();
			} else {
				_optionFalse();
			}
		});

		labels[index].addEventListener("keydown", e =>{
			if (e.key === "Enter") {
				if (option.checked) {
					_optionFalse();
				} else {
					_optionTrue();
				}
			}
		});
	}

	options.forEach((option, index) =>{
		option.classList.add("inactive");
		if (option.getAttribute("data-option") === "theme") {
			const theme = window.matchMedia('(prefers-color-scheme: dark)');
			if (theme.matches && !localStorage.getItem("theme")) {
				_true(option, index);
			} else if (!theme.matches && !localStorage.getItem("theme")) {
				_false(option, index);
			}

			let _optionTrue = () => {
				_true(option, index);
				document.documentElement.classList.remove("theme-light");
				document.documentElement.classList.add("theme-dark");
				localStorage.setItem("theme", "dark");
			}
			let _optionFalse = () => {
				_false(option, index);
				document.documentElement.classList.remove("theme-dark");
				document.documentElement.classList.add("theme-light");
				localStorage.setItem("theme", "light");
			}

			if (localStorage.getItem("theme") === "dark") {
				_optionTrue();
			} else if ((localStorage.getItem("theme") === "light")) {
				_optionFalse();
			}

			_toggle(option, index, _optionTrue, _optionFalse);
		} else if (option.getAttribute("data-option") === "tone") {
			const theme = document.querySelector('meta[media="(prefers-color-scheme: light)"]');

			let _optionTrue = () => {
				_true(option, index);
				document.documentElement.classList.add("theme-cool");
				theme.setAttribute("content", "#DAE3E4");
				localStorage.setItem("tone", "true");
			}
			let _optionFalse = () => {
				_false(option, index);
				document.documentElement.classList.remove("theme-cool");
				theme.setAttribute("content", "#fcf1ef");
				localStorage.setItem("tone", "false");
			}

			if (localStorage.getItem("tone") === "true") {
				_optionTrue();
			} else if ((localStorage.getItem("tone") === "false")) {
				_optionFalse();
			}

			_toggle(option, index, _optionTrue, _optionFalse);
		} else if (option.getAttribute("data-option") === "contrast") {
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
		} else if (option.getAttribute("data-option") === "transparency") {
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
		} else if (option.getAttribute("data-option") === "load") {
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