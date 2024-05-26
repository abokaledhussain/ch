// ملف script.js

document.addEventListener('DOMContentLoaded', (event) => {
    loadChannels();
});

let currentTheme = 1;

function loadChannel(url) {
    document.getElementById('channelFrame').src = url;
}

function loadChannels() {
    let channels = getChannelsFromStorage();

    let tbody = document.getElementById('channelsBody');
    tbody.innerHTML = '';
    for (let i = 0; i < channels.length; i += 3) {
        let row = document.createElement('tr');
        for (let j = i; j < i + 3 && j < channels.length; j++) {
            let cell = document.createElement('td');
            let link = document.createElement('a');
            link.href = '#';
            link.onclick = () => loadChannel(channels[j].link);
            link.textContent = channels[j].name;
            cell.appendChild(link);

            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'حذف';
            deleteButton.style.display = 'none';
            deleteButton.onclick = () => deleteChannel(j);
            cell.appendChild(deleteButton);

            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }
}

function addChannel() {
    let name = document.getElementById('channelName').value;
    let link = document.getElementById('channelLink').value;
    if (name && link) {
        let channels = getChannelsFromStorage();
        channels.push({ name: name, link: link });
        saveChannelsToStorage(channels);
        loadChannels();
    }
}

function deleteChannel(index) {
    let channels = getChannelsFromStorage();
    channels.splice(index, 1);
    saveChannelsToStorage(channels);
    loadChannels();
}

function getChannelsFromStorage() {
    let channels = JSON.parse(localStorage.getItem('channels')) || [];
    return channels;
}

function saveChannelsToStorage(channels) {
    localStorage.setItem('channels', JSON.stringify(channels));
}

function showDeleteButtons() {
    let deleteButtons = document.querySelectorAll('#channelsBody button');
    deleteButtons.forEach(button => {
        button.style.display = 'block';
    });
}

function changeTheme() {
    currentTheme++;
    if (currentTheme > 10) {
        currentTheme = 1;
    }
    document.body.className = 'theme-' + currentTheme;
}

function exportToXML() {
    let channels = getChannelsFromStorage();

    let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<channels>\n';
    channels.forEach(channel => {
        xmlContent += `\t<channel>\n\t\t<name>${channel.name}</name>\n\t\t<link>${channel.link}</link>\n\t</channel>\n`;
    });
    xmlContent += '</channels>';

    let blob = new Blob([xmlContent], { type: 'text/xml' });
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'channels.xml';
    link.click();
}

function loadData() {
    let fileInput = document.getElementById('fileInput');
    let file = fileInput.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function(event) {
            let channels = JSON.parse(event.target.result);
            saveChannelsToStorage(channels);
            loadChannels();
        };
        reader.readAsText(file);
    }
}

function saveData() {
    let channels = getChannelsFromStorage();
    let blob = new Blob([JSON.stringify(channels)], { type: 'application/json' });
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'channels.json';
    link.click();
}