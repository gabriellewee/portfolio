let key = document.body.classList[0].slice(5);
let posts = Array.from(document.querySelectorAll(".post-animate"));
posts.push(document.querySelector(".contact"), document.querySelector(".bottom"));
animateItems(posts, key);