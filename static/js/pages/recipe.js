let key = document.body.classList[0].slice(5);
let posts = Array.from(document.querySelectorAll(".post-animate"));
posts.push(document.querySelector(".bottom"));
animateItems(posts, key);

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
		if(resetContainer.classList.contains("hide")) {
			resetContainer.classList.remove("hide");
			localStorage.setItem("resetIngredients", "true");
		}
	}
	let _false = (option, index, name) => {
		option.checked = false;
		option.removeAttribute("checked");
		labels[index].setAttribute("aria-pressed", "false");
		if(name) {
			localStorage.removeItem(name);
		}
		let checked = document.querySelector(".task-list-item-checkbox:checked");
		if(!checked) {
			localStorage.removeItem("resetIngredients");
			resetContainer.classList.add("hide");
		}
	}

	if(localStorage.getItem("resetIngredients") === "true" && resetContainer.classList.contains("hide")) {
		resetContainer.classList.remove("hide");
	}

	options.forEach((option, index) =>{
		let name = option.getAttribute("id");

		if(localStorage.getItem(name) === "true") {
			_true(option, index, name);
		} else {
			_false(option, index, name);
		}

		option.addEventListener("click", e => {
			if (option.checked) {
				_true(option, index, name);
			} else {
				_false(option, index, name);
			}
		});

		option.addEventListener("keydown", e =>{
			if (e.key === "Enter") {
				if (option.checked) {
					_false(option, index, name);
				} else {
					_true(option, index, name);
				}
			}
		});
	});

	reset.addEventListener("click", e => {
		e.preventDefault();
		localStorage.removeItem("resetIngredients");
		resetContainer.classList.add("hide");
		options.forEach((option, index) => {
			let name = option.getAttribute("id");
			_false(option, index, name);
		});
	});
})();