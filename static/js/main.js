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

let filterList = document.querySelector(".grid-filters");
if (filterList != null) {
	let filterLinks = filterList.querySelectorAll(".grid-filter");
	filterLinks.forEach(filterLink=>{
		let filterValue = filterLink.getAttribute("data-filter");
		filterLink.addEventListener("click", function(event) {
			event.preventDefault();
			iso.arrange({ filter: filterValue });
			let filterActive = filterList.querySelector(".active");
			if (filterActive != null && filterValue == "*") {
				filterActive.classList.remove("active");
			} else if (filterActive != null) {
				filterActive.classList.remove("active");
				event.target.classList.add("active");
			} else {
				event.target.classList.add("active");
			};
			iso.layout();
		});
	});
}