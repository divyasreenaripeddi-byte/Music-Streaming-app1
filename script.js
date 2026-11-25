// SONG DATA
const songTitles = [
    "Shape of You", "Perfect", "Believer", "Faded", "Closer",
    "Let Me Love You", "Attention", "Despacito", "Senorita", "Havana",
    "Memories", "Girls Like You", "Sugar", "Animals", "Counting Stars",
    "See You Again", "Love Me Like You Do", "Photograph", "Sorry", "Stay",
    "Calm Down", "Heat Waves", "Night Changes", "Story of My Life",
    "Dynamite", "Butter", "Permission to Dance", "Lovely", "Ocean Eyes",
    "Bad Guy", "Thunder", "Whatever It Takes", "Demons", "Radioactive",
    "Cheap Thrills", "Chandelier", "Roar", "Dark Horse", "Firework",
    "Unstoppable", "Flowers", "Anti-Hero", "Cruel Summer", "Blank Space",
    "Shake It Off", "Style", "Cardigan", "Willow", "Levitating",
    "Don't Start Now", "New Rules", "One Kiss", "IDGAF", "Happier",
    "Without Me", "Sunflower", "Circles", "Rockstar", "Congratulations",
    "God's Plan", "In My Feelings", "Lucid Dreams", "Sicko Mode",
    "Blinding Lights", "Save Your Tears", "Starboy", "The Hills",
    "Earned It", "Die For You", "I Feel It Coming", "Take On Me",
    "Wake Me Up", "The Nights", "Waiting For Love", "Levels",
    "Alone", "Darkside", "On My Way", "Sing Me To Sleep",
    "Kesariya", "Tum Hi Ho", "Channa Mereya", "Raataan Lambiyan",
    "Apna Bana Le", "Heeriye", "Shayad", "Hawayein", "Kabira",
    "Agar Tum Saath Ho", "Ghungroo", "Malang", "Tera Ban Jaunga",
    "Samajavaragamana", "Butta Bomma", "Inkem Inkem Inkem Kaavaale",
    "Vachindamma", "Naatu Naatu", "Oo Antava"
];

// Create 100 sample songs
let songs = songTitles.map((title, index) => ({
    id: "song" + (index + 1),
    title: title,
    artist: "BeatBox Artist " + (index + 1),
    file: "songs/song" + (index + 1) + ".mp3"
}));

// LOAD SAVED DATA
let users = JSON.parse(localStorage.getItem("bbUsers")) || [];
let adminSongs = JSON.parse(localStorage.getItem("bbAdminSongs")) || [];
let playlist = JSON.parse(localStorage.getItem("bbPlaylist")) || [];
let favorites = JSON.parse(localStorage.getItem("bbFavorites")) || [];

let loggedInUser = JSON.parse(localStorage.getItem("bbLoggedInUser")) || null;
let adminLoggedIn = localStorage.getItem("bbAdminLoggedIn") === "true";

// HELPER FUNCTIONS
function saveData() {
    localStorage.setItem("bbUsers", JSON.stringify(users));
    localStorage.setItem("bbAdminSongs", JSON.stringify(adminSongs));
    localStorage.setItem("bbPlaylist", JSON.stringify(playlist));
    localStorage.setItem("bbFavorites", JSON.stringify(favorites));
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };
        return entities[char];
    });
}

function getAllSongs() {
    return [...songs, ...adminSongs];
}

// NAVIGATION
function showSection(sectionId) {
    if (sectionId === "admin" && adminLoggedIn) {
        showAdminPanel();
    }

    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });

    const selected = document.getElementById(sectionId);
    if (selected) {
        selected.classList.add("active");
    }

    if (sectionId === "songs") displaySongs(getAllSongs());
    if (sectionId === "home") displayFeaturedSongs();
    if (sectionId === "playlist") displayPlaylist();
    if (sectionId === "favorites") displayFavorites();
    if (sectionId === "admin" && adminLoggedIn) updateDashboard();

    window.scrollTo(0, 0);
}

// SONG CARD
function createSongCard(song) {
    const isFavorite = favorites.includes(song.id);

    return `
        <div class="song-card">
            <div class="song-cover">🎵</div>
            <h3>${escapeHTML(song.title)}</h3>
            <p>${escapeHTML(song.artist)}</p>

            <div class="song-actions">
                <button onclick="playSong('${song.id}')">▶ Play</button>
                <button onclick="addToPlaylist('${song.id}')">+ Playlist</button>
                <button class="favorite-btn ${isFavorite ? "selected" : ""}"
                    onclick="toggleFavorite('${song.id}')">
                    ${isFavorite ? "♥" : "♡"}
                </button>
            </div>
        </div>
    `;
}

// DISPLAY SONGS
function displaySongs(songArray) {
    const container = document.getElementById("songList");

    if (!songArray.length) {
        container.innerHTML = "<p>No songs found.</p>";
        return;
    }

    container.innerHTML = songArray.map(createSongCard).join("");
}

// FEATURED SONGS
function displayFeaturedSongs() {
    const container = document.getElementById("featuredSongs");
    const featured = getAllSongs().slice(0, 6);

    container.innerHTML = featured.map(createSongCard).join("");
}

// SEARCH SONGS
function searchSongs() {
    const searchValue = document.getElementById("searchInput")
        .value.toLowerCase();

    const filteredSongs = getAllSongs().filter(song =>
        song.title.toLowerCase().includes(searchValue) ||
        song.artist.toLowerCase().includes(searchValue)
    );

    displaySongs(filteredSongs);
}

// PLAY MUSIC
function playSong(songId) {
    const song = getAllSongs().find(item => item.id === songId);

    if (!song) return;

    const audio = document.getElementById("audioPlayer");

    document.getElementById("currentSong").textContent = song.title;
    document.getElementById("currentArtist").textContent = song.artist;

    audio.src = song.file;
    audio.play().catch(() => {
        alert("Audio file not found. Add the correct MP3 file to your songs folder.");
    });
}

// SIGNUP
function userSignup(event) {
    event.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim().toLowerCase();
    const password = document.getElementById("signupPassword").value;

    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        document.getElementById("signupMessage").textContent =
            "This email is already registered.";
        return;
    }

    users.push({ name, email, password });
    saveData();

    document.getElementById("signupMessage").textContent =
        "Signup successful! Please login.";

    event.target.reset();

    setTimeout(() => {
        document.getElementById("loginEmail").value = email;
        showSection("login");
    }, 1000);
}

// USER LOGIN
function userLogin(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const user = users.find(item =>
        item.email === email && item.password === password
    );

    if (user) {
        loggedInUser = {
            name: user.name,
            email: user.email
        };

        localStorage.setItem("bbLoggedInUser", JSON.stringify(loggedInUser));

        document.getElementById("loginMessage").textContent =
            "Login successful! Welcome to BeatBox.";

        event.target.reset();
        updateWelcome();

        setTimeout(() => showSection("home"), 800);
    } else {
        document.getElementById("loginMessage").textContent =
            "Invalid email or password.";
    }
}

// USER LOGOUT
function userLogout() {
    loggedInUser = null;
    localStorage.removeItem("bbLoggedInUser");
    updateWelcome();
    showSection("home");
}

// WELCOME MESSAGE
function updateWelcome() {
    const welcome = document.getElementById("welcomeUser");

    if (loggedInUser) {
        welcome.innerHTML = `
            Welcome, ${escapeHTML(loggedInUser.name)}
            <button onclick="userLogout()">Logout</button>
        `;
    } else {
        welcome.textContent = "";
    }
}

// ADMIN LOGIN
function adminLogin(event) {
    event.preventDefault();

    const username = document.getElementById("adminUsername").value;
    const password = document.getElementById("adminPassword").value;

    // Demo credentials
    if (username === "admin" && password === "admin123") {
        adminLoggedIn = true;
        localStorage.setItem("bbAdminLoggedIn", "true");

        document.getElementById("adminMessage").textContent =
            "Admin login successful!";

        event.target.reset();
        showAdminPanel();
    } else {
        document.getElementById("adminMessage").textContent =
            "Invalid admin username or password.";
    }
}

// SHOW ADMIN DASHBOARD
function showAdminPanel() {
    document.getElementById("adminLoginBox").classList.add("hidden");
    document.getElementById("adminDashboard").classList.remove("hidden");

    updateDashboard();
    displayAdminSongs();
    displayAdminUsers();
}

// ADMIN LOGOUT
function adminLogout() {
    adminLoggedIn = false;
    localStorage.removeItem("bbAdminLoggedIn");

    document.getElementById("adminLoginBox").classList.remove("hidden");
    document.getElementById("adminDashboard").classList.add("hidden");
    document.getElementById("adminMessage").textContent =
        "Admin logged out successfully.";

    showSection("home");
}

// ADMIN ADD SONG
function addSong(event) {
    event.preventDefault();

    if (!adminLoggedIn) return;

    const title = document.getElementById("newSongTitle").value.trim();
    const artist = document.getElementById("newSongArtist").value.trim();
    const file = document.getElementById("newSongFile").value.trim();

    const newSong = {
        id: "admin" + Date.now(),
        title,
        artist,
        file
    };

    adminSongs.push(newSong);
    saveData();

    event.target.reset();

    displayAdminSongs();
    updateDashboard();
    alert("Song added successfully!");
}

// ADMIN DISPLAY SONGS
function displayAdminSongs() {
    const container = document.getElementById("adminSongList");

    container.innerHTML = getAllSongs().map(song => `
        <div class="admin-song-item">
            <span>${escapeHTML(song.title)} - ${escapeHTML(song.artist)}</span>
            <button onclick="deleteSong('${song.id}')">Delete</button>
        </div>
    `).join("");
}

// ADMIN DELETE SONG
function deleteSong(songId) {
    if (!adminLoggedIn) return;

    const originalSong = songs.some(song => song.id === songId);

    if (originalSong) {
        alert("Default songs cannot be deleted in this demo.");
        return;
    }

    adminSongs = adminSongs.filter(song => song.id !== songId);

    playlist = playlist.filter(id => id !== songId);
    favorites = favorites.filter(id => id !== songId);

    saveData();
    displayAdminSongs();
    updateDashboard();
    displaySongs(getAllSongs());
    alert("Song deleted successfully!");
}

// ADMIN DISPLAY USERS
function displayAdminUsers() {
    const container = document.getElementById("adminUserList");

    if (users.length === 0) {
        container.innerHTML = "<p>No registered users yet.</p>";
        return;
    }

    container.innerHTML = users.map(user => `
        <div class="admin-user-item">
            <span>${escapeHTML(user.name)} - ${escapeHTML(user.email)}</span>
        </div>
    `).join("");
}

// ADMIN DASHBOARD COUNTS
function updateDashboard() {
    document.getElementById("totalSongs").textContent = getAllSongs().length;
    document.getElementById("totalUsers").textContent = users.length;
}

// ADD TO PLAYLIST
function addToPlaylist(songId) {
    if (!playlist.includes(songId)) {
        playlist.push(songId);
        saveData();
        alert("Song added to playlist!");
    } else {
        alert("This song is already in your playlist.");
    }

    displayPlaylist();
}

// DISPLAY PLAYLIST
function displayPlaylist() {
    const container = document.getElementById("playlistSongs");

    const playlistSongs = getAllSongs().filter(song =>
        playlist.includes(song.id)
    );

    if (playlistSongs.length === 0) {
        container.innerHTML = "<p>Your playlist is empty.</p>";
        return;
    }

    container.innerHTML = playlistSongs.map(song => `
        <div class="song-card">
            <div class="song-cover">🎵</div>
            <h3>${escapeHTML(song.title)}</h3>
            <p>${escapeHTML(song.artist)}</p>
            <div class="song-actions">
                <button onclick="playSong('${song.id}')">▶ Play</button>
                <button onclick="removeFromPlaylist('${song.id}')">Remove</button>
            </div>
        </div>
    `).join("");
}

// REMOVE FROM PLAYLIST
function removeFromPlaylist(songId) {
    playlist = playlist.filter(id => id !== songId);
    saveData();
    displayPlaylist();
}

// FAVORITES
function toggleFavorite(songId) {
    if (favorites.includes(songId)) {
        favorites = favorites.filter(id => id !== songId);
    } else {
        favorites.push(songId);
    }

    saveData();

    displaySongs(getAllSongs());
    displayFeaturedSongs();
    displayFavorites();
}

// DISPLAY FAVORITES
function displayFavorites() {
    const container = document.getElementById("favoriteSongs");

    const favoriteList = getAllSongs().filter(song =>
        favorites.includes(song.id)
    );

    if (favoriteList.length === 0) {
        container.innerHTML = "<p>No favorite songs added yet.</p>";
        return;
    }

    container.innerHTML = favoriteList.map(song => `
        <div class="song-card">
            <div class="song-cover">♥</div>
            <h3>${escapeHTML(song.title)}</h3>
            <p>${escapeHTML(song.artist)}</p>
            <div class="song-actions">
                <button onclick="playSong('${song.id}')">▶ Play</button>
                <button onclick="toggleFavorite('${song.id}')">Remove ♥</button>
            </div>
        </div>
    `).join("");
}

// INITIALIZE APP
function initializeApp() {
    updateWelcome();
    displayFeaturedSongs();
    displaySongs(getAllSongs());
    displayPlaylist();
    displayFavorites();

    if (adminLoggedIn) {
        showAdminPanel();
    }
}

initializeApp();