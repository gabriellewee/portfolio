let posts = Array.from(document.querySelectorAll(".post-animate"));
let filters = Array.from(document.querySelectorAll(".grid-filter"));
posts.push(document.querySelector(".bottom"));
posts.unshift(...filters);
animateItems(posts);