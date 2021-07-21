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