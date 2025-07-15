// theme.js
function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('localconnect_theme', isDark ? 'dark' : 'light');
  const themeIcon = document.getElementById('theme-icon');
  if (themeIcon) themeIcon.className = isDark ? 'fas fa-sun text-gray-300' : 'fas fa-moon text-gray-700';
}
document.addEventListener('DOMContentLoaded', function() {
  if (localStorage.getItem('localconnect_theme') === 'dark') {
    document.documentElement.classList.add('dark');
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) themeIcon.className = 'fas fa-sun text-gray-300';
  }
});
window.toggleDarkMode = toggleDarkMode; 