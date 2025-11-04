import { fetchCryptodata} from "./Sections/dashboard.js";
import { renderNews } from "./Sections/news.js";
import { renderBlogs } from "./Sections/blogs.js";

const sections = {
  dashboard: fetchCryptodata,
  news: renderNews,
  blog: renderBlogs
};

const mainContent = document.getElementById("main");
const menuItems = document.querySelectorAll(".sidebar ul li");

fetchCryptodata();

menuItems.forEach(item => {
  item.addEventListener("click", () => {
    menuItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");
    const section = item.getAttribute("data-section");
    mainContent.innerHTML = ""; // clear old content
    sections[section](); 
  });
});


const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");

hamburger.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

document.querySelectorAll(".sidebar li").forEach(li => {
  li.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      sidebar.classList.remove("active");

    }
  });
});
