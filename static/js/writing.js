let mainContent = document.querySelector("main");
let anchorLinks = document.querySelectorAll(".direct-link");

anchorLinks.forEach(el=>{
	let targetLink = el.getAttribute("href");
	el.addEventListener('click', e => {
		document.querySelector(targetLink).scrollIntoView({ behavior: 'smooth' });
	});
});

if(window.location.hash && anchorLinks) {
	let scrollLocation = document.querySelector(window.location.hash);
	if(scrollLocation) {
		imagesLoaded(mainContent, { background: true }, () =>{
			setTimeout(() => {
				scrollLocation.scrollIntoView({ behavior: 'smooth' });
			}, 300);
		});
	}
}

// Open the modal
netlifyIdentity.open();