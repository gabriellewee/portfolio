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