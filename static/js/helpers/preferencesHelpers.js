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