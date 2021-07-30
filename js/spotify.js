// Get the hash of the url
const hash = window.location.hash
    .substring(1)
    .split('&')
    .reduce(function (initial, item) {
        if (item) {
            var parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
    }, {});
window.location.hash = '';

// Set token
let _token = hash.access_token;

const authEndpoint = 'https://accounts.spotify.com/authorize';

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = process.env.SPOTIFY_CLIENT_ID;
const redirectUri = 'https://anniew.xyz/music';
const scopes = [
    'user-read-currently-playing',
    'user-top-read'
];

// If there is no token, redirect to Spotify authorization
if (!_token) {
    window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token`;
}

const currentlyPlaying = document.getElementById('currently-playing-container');
const topArtists = document.getElementById('artists-container');
const topTracks = document.getElementById('tracks-container');


/* --- GET JSON DATA FROM API --- */

async function getCurrentlyPlayingData() {
    try {
        const result = await fetch('https://api.spotify.com/v1/me/player/currently-playing?market=US',
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${_token}`
                }
            }
        );
        const data = await result.json();
        // console.log('NOW PLAYING RAW DATA');
        // console.log(data);
        return data;
    } catch (error) {
        return null;
    }
};

async function getTopArtistsData() {
    const result = await fetch('https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=8&offset=0',
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${_token}`
            }
        }
    );
    const data = await result.json();
    // console.log('TOP ARTISTS RAW DATA');
    // console.log(data);
    return data;
};

async function getTopTracksData() {
    const result = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=8&offset=0',
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${_token}`
            }
        }
    );
    const data = await result.json();
    // console.log('TOP TRACKS RAW DATA');
    // console.log(data);
    return data;
};

/* --- GET ARTIST NAME(S) FROM DATA --- */

function getArtistNames(data) {
    let names = [];
    let namesFormatted = '';

    let artistData = data.artists;

    artistData.forEach(artistName => {
        names.push(`${artistName.name}`);
    })
    namesFormatted = names[0];
    if (names.length > 1) {
        for (let i = 1; i < names.length; i++) {
            namesFormatted += `, ${names[i]}`;
        }
    }

    return namesFormatted;
};

/* --- DISPLAY DATA --- */

function showCurrentlyPlaying(data) {
    let currentlyPlayingHTML = '';

    if (data === null) {
        currentlyPlayingHTML = `
            <div class="music-display">
                <div class="info">
                    <h4 class="title">
                        Not playing music right now
                    </h4>
                </div>
            </div>
        `;
    }
    else {
        let songData = data.item;

        currentlyPlayingHTML = `
            <a target="_blank" href="${songData.album.external_urls.spotify}">
                <div class="music-display">
                    <img class="cover-img" src="${songData.album.images[2].url}" alt="Album Cover">
                    <div class="info">
                        <h4 class="title">
                            ${songData.name}
                        </h4>
                        <p class="artist-album">${getArtistNames(songData)}<span>${songData.album.name}</span></p>
                    </div>
                </div>
            </a>
        `;
    }
    currentlyPlaying.innerHTML = currentlyPlayingHTML;
};

function showTopArtists(data) {
    let artistData = data.items;
    let topArtistsHTML = '';

    artistData.forEach(artist => {
        topArtistsHTML += `
            <a target="_blank" href="${artist.external_urls.spotify}">
                <div class="music-display">
                    <img class="cover-img" src="${artist.images[2].url}" alt="Album Cover">
                    <div class="info">
                        <p class="artist-album">${artist.name}</p>
                    </div>
                </div>
            </a>
        `;
    });

    topArtists.innerHTML = topArtistsHTML;
};

function showTopTracks(data) {
    let songData = data.items;
    let topTracksHTML = '';

    songData.forEach(song => {
        topTracksHTML += `
            <a target="_blank" href="${song.album.external_urls.spotify}">
                <div class="music-display">
                    <img class="cover-img" src="${song.album.images[2].url}" alt="Album Cover">
                    <div class="info">
                        <h4 class="title">
                            ${song.name}
                        </h4>
                        <p class="artist-album">${getArtistNames(song)}<span>${song.album.name}</span></p>
                    </div>
                </div>
            </a>
        `;
    });

    topTracks.innerHTML = topTracksHTML;
};

getCurrentlyPlayingData().then(data => {
    showCurrentlyPlaying(data);
});

getTopArtistsData().then(data => {
    showTopArtists(data);
});

getTopTracksData().then(data => {
    showTopTracks(data);
});

