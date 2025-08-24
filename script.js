/**
 * File: script.js
 * Description: This script handles the functionality for the "Archive in One" web application.
 * It manages form submissions, interacts with local storage to maintain a history of
 * archived URLs, and dynamically updates the content of the page.
 */

// The 'DOMContentLoaded' event ensures that the script runs only after the entire HTML
// document has been loaded and parsed. This is crucial to prevent errors from trying
// to access elements that haven't been created yet.
document.addEventListener("DOMContentLoaded", () => {

    // --- Element References ---
    // Get references to the necessary HTML elements to avoid repeated DOM queries.
    const archiveForm = document.getElementById("archive-form");
    const urlInput = document.getElementById("urlInput");
    const historyTableBody = document.querySelector("#history-table tbody");
    const historyContainer = document.getElementById("history-container");

    // --- Load History from Local Storage ---
    // Tries to retrieve the 'urlHistory' item from the browser's local storage.
    // If it exists, it's parsed from a JSON string into an array.
    // If not, a new empty array is created.
    let urlHistory = JSON.parse(localStorage.getItem("urlHistory")) || [];

    /**
     * Renders the history of archived URLs into the history table.
     * It clears the current table content and rebuilds it based on the urlHistory array.
     */
    const renderHistory = () => {
        // Clear any existing rows to prevent duplication.
        historyTableBody.innerHTML = "";

        // If the history is empty, hide the history container and stop.
        if (urlHistory.length === 0) {
            historyContainer.style.display = "none";
            return;
        }

        // If there are history entries, make sure the container is visible.
        historyContainer.style.display = "block";

        // Loop through each entry in the history array.
        urlHistory.forEach(entry => {
            // Create a new table row element.
            const row = document.createElement("tr");

            // Create a cell for the URL, set its text, and append it to the row.
            const urlCell = document.createElement("td");
            urlCell.textContent = entry.url;
            row.appendChild(urlCell);

            // Create a cell for the date, set its text, and append it to the row.
            const dateCell = document.createElement("td");
            dateCell.textContent = entry.date;
            row.appendChild(dateCell);
            
            // Add the newly created row to the table body.
            historyTableBody.appendChild(row);
        });
    };

    /**
     * Handles the form submission event.
     */
    archiveForm.addEventListener("submit", (event) => {
        // Prevent the default form submission behavior, which would cause a page reload.
        event.preventDefault(); 
        
        // Get the URL from the input field and remove leading/trailing whitespace.
        const urlToPass = urlInput.value.trim();

        // Proceed only if a URL has been entered.
        if (urlToPass) {
            // 1. Open the archive website in a new tab.
            const targetWebsiteBaseUrl = 'https://archive.is/submit/';
            // Encode the URL to ensure it's safe to pass as a query parameter.
            const finalUrl = `${targetWebsiteBaseUrl}?url=${encodeURIComponent(urlToPass)}`;
            window.open(finalUrl, '_blank');

            // 2. Create a new history entry object.
            const newEntry = {
                url: urlToPass,
                date: new Date().toLocaleDateString() // Format the date to a local string (e.g., "8/24/2025").
            };
            
            // 3. Add the new entry to the beginning of the history array.
            urlHistory.unshift(newEntry);

            // Optional: Limit the history to the last 20 entries to prevent it from growing too large.
            if (urlHistory.length > 20) {
                urlHistory.pop(); // Removes the oldest entry.
            }

            // 4. Save the updated history array back to local storage.
            // It must be converted back to a JSON string.
            localStorage.setItem("urlHistory", JSON.stringify(urlHistory));

            // 5. Re-render the history table to display the new entry and clear the input field.
            renderHistory();
            urlInput.value = ""; 
        }
    });

    // --- Initial Render ---
    // Call renderHistory once when the page loads to display any previously saved history.
    renderHistory();
});
