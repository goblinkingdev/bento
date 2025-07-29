function performSearch(event) {
    event.preventDefault();
    const searchInput = document.getElementById('searchInput');
    const searchQuery = encodeURIComponent(searchInput.value.trim());
    
    if (searchQuery) {
        const searchUrl = `https://www.google.com/search?q=${searchQuery}`;
        window.open(searchUrl, CONFIG.openInNewTab ? '_blank' : '_self');
        searchInput.value = '';
    }
    
    return false;
}
