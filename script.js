document.getElementById('generateButton').addEventListener('click', async function () {
    console.log('Generate button clicked');
    const url = document.getElementById('urlInput').value;
    const referenceOutput = document.getElementById('referenceOutput');
    referenceOutput.innerText = 'Generating reference...'; // Show loading indicator

    const reference = await generateHarvardReference(url);
    referenceOutput.innerText = reference;
    addToHistory(reference);
});

document.getElementById('copyButton').addEventListener('click', function () {
    const copyButton = document.getElementById('copyButton');
    copyToClipboard(document.getElementById('referenceOutput').innerText, copyButton);
});

document.getElementById('copyAllButton').addEventListener('click', function () {
    const historyItems = Array.from(document.querySelectorAll('#historyList li')).map(item => item.innerText);
    copyToClipboard(historyItems.join('\n'), document.getElementById('copyAllButton'));
});

document.getElementById('clearButton').addEventListener('click', function () {
    document.getElementById('historyList').innerHTML = '';
    document.getElementById('referenceOutput').innerText = '';
    document.getElementById('urlInput').value = ''; // Clear the input field
});

async function generateHarvardReference(url) {
    const corsProxy = 'https://api.allorigins.win/get?url=';
    const proxiedUrl = corsProxy + encodeURIComponent(url);

    try {
        const response = await fetch(proxiedUrl);
        const data = await response.json();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');

        let author = doc.querySelector('meta[name="author"]')?.content || "Unknown Author";
        const year = new Date().getFullYear();
        let title = doc.querySelector('title')?.innerText || "No Title";
        let site = doc.querySelector('meta[property="og:site_name"]')?.content || new URL(url).hostname.replace('www.', '');
        const accessDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

        // Format author name
        author = author.split(' ').map((name, index, arr) => {
            if (index === arr.length - 1) {
                return name;
            }
            return name.charAt(0).toUpperCase() + '.';
        }).reverse().join(' ');

        // Capitalize the first letter of the author's name if it's not already capitalized
        author = author.charAt(0).toUpperCase() + author.slice(1);

        // Capitalize the first letter of each word in the title
        title = title.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

        // Capitalize the site name correctly
        site = site.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

        return `${author} (${year}) ${title}, ${site}. Available at: ${url} (Accessed: ${accessDate}).`;
    } catch (error) {
        console.error('Error generating reference:', error);
        return 'Error generating reference. Please check the URL and try again.';
    }
}

function addToHistory(reference) {
    const historyList = document.getElementById('historyList');
    const listItem = document.createElement('li');
    listItem.innerText = reference;

    // Get all current list items
    const items = Array.from(historyList.getElementsByTagName('li'));

    // Add the new item to the array
    items.push(listItem);

    // Sort the items alphabetically
    items.sort((a, b) => a.innerText.localeCompare(b.innerText));

    // Clear the existing list
    historyList.innerHTML = '';

    // Append the sorted items back to the list
    items.forEach(item => historyList.appendChild(item));
}
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        if (button) {
            button.style.backgroundColor = 'green';
            button.innerText = 'Copied!';
            setTimeout(() => {
                button.style.backgroundColor = '';
                button.innerText = 'Copy';
            }, 2000);
        }
    });
}