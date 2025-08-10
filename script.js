// Wait until the document is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {

    // --- Get references to HTML elements ---
    const archiveForm = document.getElementById("archive-form");
    const urlInput = document.getElementById("urlInput");
    const historyTableBody = document.querySelector("#history-table tbody");
    const historyContainer = document.getElementById("history-container");

    // --- Load history from local storage ---
    // It retrieves the stored history or creates an empty array if none exists
    let urlHistory = JSON.parse(localStorage.getItem("urlHistory")) || [];

    // --- Function to render (display) the history table ---
    const renderHistory = () => {
        // Clear the existing table rows
        historyTableBody.innerHTML = "";

        // Hide history container if there are no entries
        if (urlHistory.length === 0) {
            historyContainer.style.display = "none";
            return;
        }

        // Show the container if there is history
        historyContainer.style.display = "block";

        // Create a new row for each entry in the history
        urlHistory.forEach(entry => {
            const row = document.createElement("tr");

            // Cell for the URL
            const urlCell = document.createElement("td");
            urlCell.textContent = entry.url;
            row.appendChild(urlCell);

            // Cell for the date
            const dateCell = document.createElement("td");
            dateCell.textContent = entry.date;
            row.appendChild(dateCell);
            
            historyTableBody.appendChild(row);
        });
    };

    // --- Event listener for the form submission ---
    archiveForm.addEventListener("submit", (event) => {
        // Prevent the form from reloading the page
        event.preventDefault(); 
        
        const urlToPass = urlInput.value.trim();

        if (urlToPass) {
            // --- 1. Open the archive website ---
            const targetWebsiteBaseUrl = 'https://archive.is/submit/';
            const finalUrl = `${targetWebsiteBaseUrl}?url=${encodeURIComponent(urlToPass)}`;
            window.open(finalUrl, '_blank');

            // --- 2. Update the history ---
            const newEntry = {
                url: urlToPass,
                date: new Date().toLocaleDateString() // e.g., "8/10/2025"
            };
            
            // Add the new URL to the beginning of the history array
            urlHistory.unshift(newEntry);

            // Optional: Limit the history to the last 20 entries
            if (urlHistory.length > 20) {
                urlHistory.pop();
            }

            // --- 3. Save updated history to local storage ---
            localStorage.setItem("urlHistory", JSON.stringify(urlHistory));

            // --- 4. Re-render the history table and clear input ---
            renderHistory();
            urlInput.value = ""; 
        }
    });

    // --- Initial call to display history when the page first loads ---
    renderHistory();
});
