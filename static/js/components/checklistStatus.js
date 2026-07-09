// Store checklist status in tab session
export const checklistStatus = (taskList = ".task-list", reset = "[data-task-list-reset]") => {
	const listEl = document.querySelector(taskList);
	const resetEl = document.querySelector(reset);
	if (!listEl || !resetEl) return;

	const options = listEl.querySelectorAll("input[type='checkbox']");
	const labels = listEl.querySelectorAll("label");

	const setState = (checked, index, id) => {
		const option = options[index];
		const label = labels[index];

		option.checked = checked;
		option.toggleAttribute("checked", checked);
		label.setAttribute("aria-pressed", checked.toString());

		if (checked) {
			if (id) localStorage.setItem(id, "true");
			if (resetEl.classList.contains("hide")) {
				resetEl.classList.remove("hide");
				localStorage.setItem("resetIngredients", "true");
			}
		} else {
			if (id) localStorage.removeItem(id);
			if (!listEl.querySelector("[id^='task-list-checkbox']:checked")) {
				localStorage.removeItem("resetIngredients");
				resetEl.classList.add("hide");
			}
		}
	};

	if (localStorage.getItem("resetIngredients") === "true") {
		resetEl.classList.remove("hide");
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

	resetEl.addEventListener("click", (e) => {
		e.preventDefault();
		localStorage.removeItem("resetIngredients");
		resetEl.classList.add("hide");
		options.forEach((option, index) => {
			const id = option.id;
			setState(false, index, id);
		});
	});
}