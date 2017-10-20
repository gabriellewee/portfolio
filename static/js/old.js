// var closeFn;
// function closeShowingModal() {
//     var showingModal = document.querySelector('.modal.show');
//     if (!showingModal) return;
//     showingModal.classList.remove('show');
//     document.body.classList.remove('disable-mouse');
//     document.body.classList.remove('disable-scroll');
//     if (closeFn) {
//         closeFn();
//         closeFn = null;
//     }
// }
// function showNextModal() {
//     var showingModal = document.querySelector('.modal.show');
//     if (!showingModal) return;
//     if ($(showingModal).is(":last-child")) {
//         showingModal.classList.remove('show');
//         document.body.classList.remove('disable-mouse');
//         document.body.classList.remove('disable-scroll');
//         if (closeFn) {
//             closeFn();
//             closeFn = null;
//         }
//     }
//     else {
//         showingModal.classList.remove('show');
//         $(showingModal).next().addClass("show");
//     }
// }
// function showPrevModal() {
//     var showingModal = document.querySelector('.modal.show');
//     if (!showingModal) return;
//     if ($(showingModal).is(":first-child")) {
//         showingModal.classList.remove('show');
//         document.body.classList.remove('disable-mouse');
//         document.body.classList.remove('disable-scroll');
//         if (closeFn) {
//             closeFn();
//             closeFn = null;
//         }
//     }
//     else {
//         showingModal.classList.remove('show');
//         $(showingModal).prev().addClass("show");
//     }
// }
// document.addEventListener('click', function (e) {
//     var target = e.target;
//     if (target.dataset.ctaTarget) {
//         closeFn = cta(target, document.querySelector(target.dataset.ctaTarget), { relativeToWindow: true }, function showModal(modal) {
//             modal.classList.add('show');
//             document.body.classList.add('disable-mouse');
//             if(target.dataset.disableScroll){
//                 document.body.classList.add('disable-scroll');
//             }
//         });
//     }
//     else if (target.classList.contains('modal-close')) {
//         closeShowingModal();
//     }
//     else if (target.parentElement.classList.contains('modal-close')) {
//         closeShowingModal();
//     }
// });
// document.addEventListener('keyup', function (e) {
//     if (e.which === 27) {
//         closeShowingModal();
//     } else if (e.which === 39) {
//         showNextModal();
//     } else if (e.which === 37) {
//         showPrevModal();
//     }
// });
