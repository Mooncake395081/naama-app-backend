const API_URL = '/api';

// פונקציה כללית לבדיקה אם המידע תקין
async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`);
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        // מוודאים שזה באמת מערך, אם לא - מחזירים מערך ריק
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return []; // מחזירים מערך ריק כדי שה-forEach לא יקרוס
    }
}

async function loadGreetings() {
    const greetings = await fetchData('greetings');
    // כאן אנחנו עוטפים בבדיקה בטוחה
    if (Array.isArray(greetings)) {
        // ... הקוד שלך להצגת ברכות ...
        console.log('Greetings loaded:', greetings);
    }
}

async function loadGallery() {
    const photos = await fetchData('photos');
    if (Array.isArray(photos)) {
        // ... הקוד שלך להצגת גלריה ...
        console.log('Photos loaded:', photos);
    }
}

// קריאה ראשונית
loadGreetings();
loadGallery();