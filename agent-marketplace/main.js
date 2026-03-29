// Simple mobile nav toggle (placeholder for future interactions)
document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".nav__burger");
  const navLinks = document.querySelector(".nav__links");
  const navActions = document.querySelector(".nav__actions");

  if (!burger || !navLinks || !navActions) return;

  burger.addEventListener("click", () => {
    navLinks.classList.toggle("nav--open");
    navActions.classList.toggle("nav--open");
  });
});

