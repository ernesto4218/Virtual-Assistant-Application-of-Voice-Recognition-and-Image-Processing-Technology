// Runs on Teachable Machine pages
const appElement = document.getElementById("app-name");
if (appElement) {
    appElement.textContent = "Modified by Extension";
} else {
    console.log("Element with ID 'appname' not found.");
}
