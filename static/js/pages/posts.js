let key = document.body.classList[0].slice(5);
let posts = Array.from(document.querySelectorAll("[data-anim]"));
animateItems(posts, key);