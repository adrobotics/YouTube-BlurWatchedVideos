// ==UserScript==
// @name         YouTube-BlurWatchedVideos
// @author       Adrian Popa (ad_robotics@yahoo.com)
// @namespace    https://github.com/adrobotics/YouTube-BlurWatchedVideos
// @description  Blurs the thumbnail of all previously watched videos on YouTube.
// @version      1.0
// @downloadURL  https://raw.githubusercontent.com/adrobotics/YouTube-BlurWatchedVideos/master/youtube-blur-watched-videos.user.js
// @updateURL    https://raw.githubusercontent.com/adrobotics/YouTube-BlurWatchedVideos/master/youtube-blur-watched-videos.meta.js
// @icon         https://www.google.com/s2/favicons?domain=www.youtube.com
// @match        https://www.youtube.com
// @match        https://www.youtube.com/watch*
// @match        https://www.youtube.com/feed/*
// @run-at       document-end
// ==/UserScript==


/**
* KNOWN ISSUES
* - For Firefox users: Replace @match with @include in the meta-data section.
* - Bluring of the thumbnails needs to be run periodically since some thumbnails are lazy-loaded, hence the setInterval(..., DELAY_INTERVAL).
* - Switching pages on YouTube does not perform a hard-refresh. Because of this, the @exclude-s can't be used, hence the EXCLUDED_PATHS workaround.
* - Some videos on the EXCLUDED_PATHS might get blurred if the next page loads slower than the next run of the bluring interval. Switching back to the excluded page will yield blured thumbnails. Refreshing the page fixes this.
*/
const DELAY_INTERVAL = 1000;
const EXCLUDED_PATHS = ['/feed/history', '/channel'];

setInterval(() => {
    if (!EXCLUDED_PATHS.some(path => window.location.pathname.startsWith(path))) {
        run();
    }
}, DELAY_INTERVAL);

function run() {
    const thumbnails = Array.from(document.getElementsByTagName('ytd-thumbnail'));
    blurOnMiddleMouseButtonClick(thumbnails);
    blurWatchedVideos(thumbnails);
};

function blurOnMiddleMouseButtonClick(thumbnails) {
    thumbnails.forEach(thumbnail => {
        thumbnail.onauxclick = () => blur(thumbnail);
    });
};

function blurWatchedVideos(thumbnails) {
    thumbnails
        .filter(wasWatched)
        .map(blur);
};

function wasWatched(domElement) {
    return domElement.getElementsByTagName('ytd-thumbnail-overlay-resume-playback-renderer').length;
};

function blur(domElement) {
    domElement.style.filter = 'grayscale(100%) opacity(50%) blur(4px)';
    domElement.style.transition = '0.5s filter ease-in-out';
};
