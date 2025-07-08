// Select the button <li>
const newProjectButton = document.querySelector('ul > li[role="button"]');

newProjectButton.addEventListener('click', (event) => {
  // Override window.open temporarily to prevent new tabs
  const originalWindowOpen = window.open;
  window.open = function() {
    console.log('New tab/window opening is blocked.');
    return null;
  };

  // Your existing button logic here, if any...
  // Example: you may want to call some function here
  // doSomething();

  // Restore original window.open just in case after some delay
  setTimeout(() => {
    window.open = originalWindowOpen;
  }, 1000);
});
