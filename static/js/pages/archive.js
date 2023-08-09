let key = document.body.classList[0].slice(5);
let posts = Array.from(document.querySelectorAll("li"));
posts.push(document.querySelector(".bottom"));
animateItems(posts, key);