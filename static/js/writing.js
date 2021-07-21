let mainContent = document.querySelector("main");
let anchorLinks = document.querySelectorAll(".direct-link");

anchorLinks.forEach(el=>{
	let targetLink = el.getAttribute("href");
	el.addEventListener('click', e => {
		document.querySelector(targetLink).scrollIntoView({ behavior: 'smooth' });
	});
});

if(window.location.hash) {
	imagesLoaded(mainContent, { background: true }, function(){
		setTimeout(() => {
			document.querySelector(window.location.hash).scrollIntoView({ behavior: 'smooth' });
		}, 300);
	});
}