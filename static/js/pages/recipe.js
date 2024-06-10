const ingredients = (() => {
	const options = Array.from(document.querySelectorAll(".task-list-item-checkbox"));
	const labels = Array.from(document.querySelectorAll(".task-list-item-label"));
	const resetContainer = document.querySelector("[data-reset-container]");
	const reset = resetContainer.querySelector("[data-reset]");
	if (!options) return;

	let _true = (option, index, name) => {
		option.checked = true;
		option.setAttribute("checked", "");
		labels[index].setAttribute("aria-pressed", "true");
		if(name) {
			localStorage.setItem(name, "true");
		}
	}
	let _false = (option, index, name) => {
		option.checked = false;
		option.removeAttribute("checked");
		labels[index].setAttribute("aria-pressed", "false");
		if(name) {
			localStorage.setItem(name, "false");
		}
	}

	if(localStorage.getItem("resetIngredients") === "true" && resetContainer.classList.contains("hide")) {
		resetContainer.classList.remove("hide");
	}

	options.forEach((option, index) =>{
		let name = option.getAttribute("id");
		if(localStorage.getItem(name) === "true") {
			_true(option, index, name);
		} else if(localStorage.getItem(name) === "false") {
			_false(option, index, name);
		}
		option.addEventListener("click", e => {
			if (option.checked) {
				_true(option, index, name);
				if(resetContainer.classList.contains("hide")) {
					resetContainer.classList.remove("hide");
					localStorage.setItem("resetIngredients", "true");
				}
			} else {
				_false(option, index, name);
			}
		});
	});

	reset.addEventListener("click", e => {
		e.preventDefault();
		resetContainer.classList.add("hide");
		localStorage.removeItem("resetIngredients");
		options.forEach((option, index) => {
			let name = option.getAttribute("id");
			_false(option, index);
			localStorage.removeItem(name);
		});

	});
})();