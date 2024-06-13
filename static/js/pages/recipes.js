let key = document.body.classList[0].slice(5);
let posts = Array.from(document.querySelectorAll(".post-animate"));
posts.push(document.querySelector(".bottom"));
animateItems(posts, key);

const taskListCheckboxes = (() => {
	const taskList = document.querySelector(".task-list");
	const options = Array.from(taskList.querySelectorAll("input[type='checkbox']"));
	const labels = Array.from(taskList.querySelectorAll("label"));
	const reset = document.querySelector("[data-task-list-reset]");
	if (!options) return;

	let _true = (option, index, name) => {
		option.checked = true;
		option.setAttribute("checked", "");
		labels[index].setAttribute("aria-pressed", "true");
		if(name) {
			localStorage.setItem(name, "true");
		}
		if(reset.classList.contains("hide")) {
			reset.classList.remove("hide");
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
		let checked = document.querySelector("[id^='task-list-checkbox']:checked");
		if(!checked) {
			localStorage.removeItem("resetIngredients");
			reset.classList.add("hide");
		}
	}

	if(localStorage.getItem("resetIngredients") === "true" && reset.classList.contains("hide")) {
		reset.classList.remove("hide");
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
		reset.classList.add("hide");
		options.forEach((option, index) => {
			let name = option.getAttribute("id");
			_false(option, index, name);
		});
	});
})();