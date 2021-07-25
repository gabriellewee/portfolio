let mainContent = document.querySelector("main");
let anchorLinks = document.querySelectorAll(".direct-link");
if(anchorLinks) {
	anchorLinks.forEach(el=>{
		let targetLink = el.getAttribute("href");
		el.addEventListener('click', e => {
			document.querySelector(targetLink).scrollIntoView({ behavior: 'smooth' });
		});
	});
}

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

let adminLink = document.querySelector(".admin-link");
if(adminLink) {
	adminLink.addEventListener('click', e => {
		e.preventDefault();
		netlifyIdentity.open();
	});
}