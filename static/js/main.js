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
		el.addEventListener('click', function(e) {
			e.preventDefault();
			iso.arrange({ filter: value });
			let active = filterList.querySelector('.active');
			if (active != null && value == '*') {
				active.classList.remove('active');
			} else if (active != null) {
				active.classList.remove('active');
				e.target.classList.add('active');
			} else {
				e.target.classList.add('active');
			};
			iso.layout();
		});
	});
}

let infoInputs = Array.from(document.querySelectorAll('.grid-input'));
if(infoInputs != null) {
	infoInputs.forEach(el=>{
		let info = el.nextElementSibling.nextElementSibling.nextElementSibling;
		let expand = info.querySelector('.grid-expand');
		info.setAttribute('aria-hidden', 'false');
		el.addEventListener('keypress', e => {
			if (e.keyCode == 13) {
				if(el.checked){
					el.checked = false;
					expand.tabIndex = -1;
					info.setAttribute('aria-hidden', 'true');
				} else {
					el.checked = true;
					expand.tabIndex = 0;
					info.setAttribute('aria-hidden', 'false');
				}
			}
		});
	});
}

let tagsInput = document.querySelector('#grid-filters');
if(tagsInput != null) {
	tagsInput.addEventListener('keypress',  e => {
		if (e.keyCode == 13) {
			if(tagsInput.checked){
				tagsInput.checked = false;
			} else {
				tagsInput.checked = true;
			}
		}
	});
}

let expandLinks = document.querySelectorAll('.expand');
let lightboxLinks = document.querySelectorAll('.lightbox');
let lightboxSibling;
if(expandLinks != null && lightboxLinks != null) {
	expandLinks.forEach((el, index)=>{
		let spanLink = lightboxLinks[index].querySelector("span");
		el.addEventListener('click', e => {
			e.preventDefault();
			lightboxLinks[index].classList.add("active");
			imagesLoaded(spanLink, { background: true }, function(){
				spanLink.classList.add("active");
			});
		});
	});
	lightboxLinks.forEach((el, index)=>{
		el.addEventListener('click', e => {
			e.preventDefault();
			el.classList.remove("active");
			el.querySelector('span').classList.remove("active");
		});
		document.addEventListener('keydown', e => {
			let keyCode = e.keyCode;
			if(el.classList.contains("active")) {
				if (keyCode === 27) {
					el.classList.remove("active");
					el.querySelector("span").classList.remove("active");
				} else if(keyCode === 39 || keyCode === 37) {
					setTimeout(() => {
						el.classList.remove("active");
						el.querySelector("span").classList.remove("active");
						if(keyCode === 39) {
							lightboxSibling = lightboxLinks[index + 1] || lightboxLinks[0];
						} else if(keyCode === 37) {
							lightboxSibling = lightboxLinks[index - 1] || lightboxLinks[lightboxLinks.length - 1];
						}
						lightboxSibling.classList.add("active");
						lightboxSibling.querySelector("span").classList.add("active");
					}, 100);
				}
			}
		});
	});
}