// Tablist/tabpanel functionality for code demos
export const tablist = (tablists = document.querySelectorAll("[data-tablist]")) => {
	tablists.forEach(tablist => {
		const inputs = [...tablist.querySelectorAll('input[type="radio"]')];
		const panels = [...tablist.querySelectorAll('[data-tabpanel]')];

		const selectTab = (i) => {
			inputs[i].checked = true;
			inputs.forEach((l, j) => {
				i === j ? l.setAttribute("checked", "") : l.removeAttribute("checked");
				l.setAttribute('aria-selected', i === j);
				l.setAttribute('tabindex', i === j ? '0' : '-1');
			});
		}

		inputs.forEach((input, i) => {
			input.setAttribute('tabindex', input.checked ? '0' : '-1');
			input.setAttribute('aria-selected', input.checked);
			input.setAttribute('aria-controls', panels[i].id);
			panels[i].setAttribute('tabindex', '0');

			input.addEventListener('click', () => selectTab(i));
			input.addEventListener('keydown', e => {
				if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
				const next = e.key === 'ArrowRight' ? (i + 1) % inputs.length
									 : e.key === 'ArrowLeft'	? (i - 1 + inputs.length) % inputs.length
									 : e.key === 'Home' ? 0 : inputs.length - 1;
				selectTab(next);
				inputs[next].focus();
			});
		});
	});
};