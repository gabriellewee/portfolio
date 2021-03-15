let lazyLoadInstance = new LazyLoad();

let iso = new Isotope(document.querySelector('.grid-isotope'), {
	percentPosition: true,
	layoutMode: 'packery',
	itemSelector: '.grid-item'
});
new imagesLoaded(window, { background: true }, function(){
	setTimeout(() => {
		iso.layout();
		setTimeout(() => {
			document.querySelector('header').classList.add('active')
		}, 500);
	}, 100);
});

let filterList = document.querySelector('.grid-filters');
if (filterList != null) {
	let filterLinks = filterList.querySelectorAll('[data-filter]');
	filterLinks.forEach(el=>{
		let value = el.getAttribute('data-filter');
		el.addEventListener('click', function(event) {
			event.preventDefault();
			iso.arrange({ filter: value });
			let active = filterList.querySelector('.active');
			if (active != null && value == '*') {
				active.classList.remove('active');
			} else if (active != null) {
				active.classList.remove('active');
				event.target.classList.add('active');
			} else {
				event.target.classList.add('active');
			};
			iso.layout();
		});
	});
}

let infoInputs = Array.from(document.querySelectorAll('.grid-input'));
infoInputs.forEach(el=>{
	let info = el.nextElementSibling.nextElementSibling.nextElementSibling;
	let external = info.querySelector('.grid-external');
	info.setAttribute('aria-hidden', 'false');
	el.addEventListener('keypress', e => {
		if (e.keyCode == 13) {
			if(el.checked){
				el.checked = false;
				external.tabIndex = -1;
				info.setAttribute('aria-hidden', 'true');
			} else {
				el.checked = true;
				external.tabIndex = 0;
				info.setAttribute('aria-hidden', 'false');
			}
		}
	});
});

let tagsInput = document.querySelector('#grid-filters');
tagsInput.addEventListener('keypress',  e => {
	if (e.keyCode == 13) {
		if(tagsInput.checked){
			tagsInput.checked = false;
		} else {
			tagsInput.checked = true;
		}
	}
});

