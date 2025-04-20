let key = document.body.classList[0].slice(5);
let posts = Array.from(document.querySelectorAll("[data-anim]"));
animateItems(posts, key);

// Store checklist status in tab session
(() => {
	const taskList = document.querySelector(".task-list");
	const reset = document.querySelector("[data-task-list-reset]");
	if (!taskList || !reset) return;

	const options = taskList.querySelectorAll("input[type='checkbox']");
	const labels = taskList.querySelectorAll("label");

	const setState = (checked, index, id) => {
		const option = options[index];
		const label = labels[index];

		option.checked = checked;
		option.toggleAttribute("checked", checked);
		label.setAttribute("aria-pressed", checked.toString());

		if (checked) {
			if (id) localStorage.setItem(id, "true");
			if (reset.classList.contains("hide")) {
				reset.classList.remove("hide");
				localStorage.setItem("resetIngredients", "true");
			}
		} else {
			if (id) localStorage.removeItem(id);
			const anyChecked = taskList.querySelector("[id^='task-list-checkbox']:checked");
			if (!anyChecked) {
				localStorage.removeItem("resetIngredients");
				reset.classList.add("hide");
			}
		}
	};

	if (localStorage.getItem("resetIngredients") === "true") {
		reset.classList.remove("hide");
	}

	options.forEach((option, index) => {
		const id = option.id;

		setState(localStorage.getItem(id) === "true", index, id);

		option.addEventListener("click", () => {
			setState(option.checked, index, id);
		});

		option.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				setState(!option.checked, index, id);
			}
		});
	});

	reset.addEventListener("click", (e) => {
		e.preventDefault();
		localStorage.removeItem("resetIngredients");
		reset.classList.add("hide");
		options.forEach((option, index) => {
			const id = option.id;
			setState(false, index, id);
		});
	});
})();
