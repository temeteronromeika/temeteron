// Translations for UI elements
const translations = {
    en: {
        searchPlaceholder: 'Search a Romeika word…',
        searchHelper: 'Search Romeika words and explore meanings, translations, and etymology.',
        description: 'Temeteron is a digital lexicon and translation resource for Romeika (Pontic Greek), aiming to document, preserve, and make accessible the vocabulary, meanings, and linguistic heritage of the region.',
        wordOfDay: 'Word of the Day',
        greekLabel: 'Greek:',
        turkishLabel: 'Turkish:',
        englishLabel: 'English:',
        didYouMean: 'Did you mean?'
    },
    gr: {
        searchPlaceholder: 'Αναζήτηση romeika λέξης…',
        searchHelper: 'Αναζητήστε romeika λέξεις και εξερευνήστε σημασίες, μεταφράσεις και ετυμολογία.',
        description: 'Το Temeteron είναι ένας ψηφιακός λεξικός και μεταφραστικός πόρος για τα Romeika (Ποντιακά ελληνικά), με στόχο να τεκμηριώσει, να διατηρήσει και να καταστήσει προσβάσιμο το λεξιλόγιο, τις σημασίες και τη γλωσσική κληρονομιά της περιοχής.',
        wordOfDay: 'Λέξη της Ημέρας',
        greekLabel: 'Ελληνικά:',
        turkishLabel: 'Τουρκικά:',
        englishLabel: 'Αγγλικά:',
        didYouMean: 'Εννοείτε;'
    },
    tr: {
        searchPlaceholder: 'Romeika kelimesi ara…',
        searchHelper: 'Romeika kelimelerini arayın ve anlamları, çevirileri ve etimolojisini keşfedin.',
        description: 'Temeteron, Romeika (Pontus Yunancası) için dijital bir sözlük ve çeviri kaynağıdır; bölgenin kelime dağarcığını, anlamlarını ve dilsel mirasını belgelemeyi, korumayı ve erişilebilir kılmayı amaçlar.',
        wordOfDay: 'Günün Kelimesi',
        greekLabel: 'Yunanca:',
        turkishLabel: 'Türkçe:',
        englishLabel: 'İngilizce:',
        didYouMean: 'Bunu mu demek istediniz?'
    }
};

// Supabase Configuration
const SUPABASE_URL = 'https://uahpzvhcpetrozwdshil.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaHB6dmhjcGV0cm96d2RzaGlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMDk0NDQsImV4cCI6MjA4MDg4NTQ0NH0.ja3lxBEEnEPkZUC5rsB6ugn4o6Li4SXBffrbwX96dKw';

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM Elements
const body = document.body;
const modeToggle = document.getElementById('modeToggle');
const toggleIcon = modeToggle.querySelector('.toggle-icon');
const searchInput = document.getElementById('searchInput');
const suggestionsContainer = document.getElementById('suggestionsContainer');
const suggestionsList = document.getElementById('suggestionsList');
const heroSection = document.getElementById('heroSection');
const heroDefault = document.getElementById('heroDefault');
const heroResult = document.getElementById('heroResult');
const heroWord = document.getElementById('heroWord');
const heroGreek = document.getElementById('heroGreek');
const heroEnglish = document.getElementById('heroEnglish');
const heroTurkish = document.getElementById('heroTurkish');
const languageSelector = document.getElementById('languageSelector');
const langButtons = languageSelector ? languageSelector.querySelectorAll('.lang-btn') : [];
const searchLanguageSelector = document.getElementById('searchLanguageSelector');
const searchLangButtons = searchLanguageSelector ? searchLanguageSelector.querySelectorAll('.search-lang-btn') : [];
const heroPhoneticLatin = document.getElementById("heroPhoneticLatin");
const heroPhoneticIpa = document.getElementById("heroPhoneticIpa");

// Search language management
let currentSearchLanguage = localStorage.getItem('temeteron-search-language') || 'romeika';


// Language Management
let currentLanguage = localStorage.getItem('temeteron-language') || 'en';

function initLanguage() {
    const savedLanguage = localStorage.getItem('temeteron-language');
    if (savedLanguage && translations[savedLanguage]) {
        currentLanguage = savedLanguage;
    } else {
        currentLanguage = 'en';
    }
    updateLanguage(currentLanguage);
}

function updateLanguage(lang) {
    if (!translations[lang]) return;
    
    currentLanguage = lang;
    localStorage.setItem('temeteron-language', lang);
    
    const t = translations[lang];
    
    // Update search placeholder
    searchInput.placeholder = t.searchPlaceholder;
    
    // Update all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (t[key]) {
            element.textContent = t[key];
        }
    });
    
    // Update active language button
    if (langButtons && langButtons.length > 0) {
        langButtons.forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}

function handleLanguageChange(lang) {
    updateLanguage(lang);
}

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('temeteron-theme');
    if (savedTheme) {
        body.className = savedTheme;
        updateToggleIcon(savedTheme);
    } else {
        body.className = 'dark-mode';
        updateToggleIcon('dark-mode');
    }
}

function toggleTheme() {
    const currentTheme = body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
    const newTheme = currentTheme === 'dark-mode' ? 'light-mode' : 'dark-mode';
    
    body.className = newTheme;
    localStorage.setItem('temeteron-theme', newTheme);
    updateToggleIcon(newTheme);
}

function updateToggleIcon(theme) {
    toggleIcon.textContent = theme === 'dark-mode' ? '☀' : '🌙';
}

// Search Functionality - Get suggestions for autocomplete
async function getSuggestions(query) {
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery || trimmedQuery.length < 1) {
        hideSuggestions();
        return;
    }
    
    try {
        let data, error;
        
        if (currentSearchLanguage === 'romeika') {
            // Use RPC function for Romeika search (phonetic matching)
            const result = await supabaseClient
                .rpc('search_words', { query: trimmedQuery });
            data = result.data;
            error = result.error;
        } else {
            // Search in specific language field
            const searchField = currentSearchLanguage;
            const result = await supabaseClient
                .from('words')
                .select('*')
                .ilike(searchField, `%${trimmedQuery}%`)
                .limit(7);
            data = result.data;
            error = result.error;
        }
        
        if (error) {
            console.error('Search error:', error);
            hideSuggestions();
            return;
        }
        
        if (data && data.length > 0) {
            // Limit to 7 suggestions for autocomplete
            const suggestions = data.slice(0, 7);
            displaySuggestions(suggestions);
        } else {
            hideSuggestions();
            showDefaultHero();
        }
    } catch (err) {
        console.error('Search error:', err);
        hideSuggestions();
    }
}

// Display suggestions in the autocomplete dropdown
function displaySuggestions(suggestions) {
    suggestionsList.innerHTML = '';
    
    suggestions.forEach(suggestion => {
        const suggestionChip = document.createElement('button');
        suggestionChip.className = 'suggestion-chip';
        suggestionChip.textContent = suggestion.romeika;
        suggestionChip.addEventListener('click', () => {
            searchInput.value = suggestion.romeika;
            hideSuggestions();
            displayResultInHero(suggestion.romeika, {
                greek: suggestion.greek || '',
                phonetic_latin: suggestion.phonetic_latin || '',
                phonetic_ipa: suggestion.phonetic_ipa || '',
                turkish: suggestion.turkish || '',
                english: suggestion.english || ''
            });
        });
        suggestionsList.appendChild(suggestionChip);
    });
    
    suggestionsContainer.style.display = 'block';
}

// Hide suggestions
function hideSuggestions() {
    suggestionsContainer.style.display = 'none';
    suggestionsList.innerHTML = '';
}

// Perform full search (when Enter is pressed or suggestion is clicked)
async function performSearch(query) {
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery) {
        showDefaultHero();
        hideSuggestions();
        return;
    }
    
    try {
        let data, error;
        
        if (currentSearchLanguage === 'romeika') {
            // Use RPC function for Romeika search (phonetic matching)
            const result = await supabaseClient
                .rpc('search_words', { query: trimmedQuery });
            data = result.data;
            error = result.error;
        } else {
            // Search in specific language field
            const searchField = currentSearchLanguage;
            const result = await supabaseClient
                .from('words')
                .select('*')
                .ilike(searchField, `%${trimmedQuery}%`)
                .limit(20);
            data = result.data;
            error = result.error;
        }
        
        if (error) {
            console.error('Search error:', error);
            showDefaultHero();
            return;
        }
        
        if (data && data.length > 0) {
            // Display the first result (most relevant) in hero
            const firstResult = data[0];
            displayResultInHero(firstResult.romeika, {
                greek: firstResult.greek || '',
                phonetic_latin: firstResult.phonetic_latin || '',
                phonetic_ipa: firstResult.phonetic_ipa || '',
                turkish: firstResult.turkish || '',
                english: firstResult.english || ''
            });
        } else {
            showDefaultHero();
        }
    } catch (err) {
        console.error('Search error:', err);
        showDefaultHero();
    }
}

// Display search result in hero section
function displayResultInHero(word, data) {
    if (!heroDefault || !heroResult || !heroWord) return;
    
    // Update hero result content
    heroWord.textContent = word;
    
    // Display phonetic_latin if present
    if (heroPhoneticLatin) {
        if (data.phonetic_latin && data.phonetic_latin.trim()) {
            heroPhoneticLatin.textContent = data.phonetic_latin;
            heroPhoneticLatin.style.display = 'block';
        } else {
            heroPhoneticLatin.style.display = 'none';
        }
    }
    
    // Display phonetic_ipa if present
    if (heroPhoneticIpa) {
        if (data.phonetic_ipa && data.phonetic_ipa.trim()) {
            heroPhoneticIpa.textContent = data.phonetic_ipa;
            heroPhoneticIpa.style.display = 'block';
        } else {
            heroPhoneticIpa.style.display = 'none';
        }
    }
    
    if (heroGreek) heroGreek.textContent = data.greek || '';
    if (heroEnglish) heroEnglish.textContent = data.english || '';
    if (heroTurkish) heroTurkish.textContent = data.turkish || '';
    
    // Hide suggestions
    hideSuggestions();
    
    // Transition from default to result view
    heroDefault.style.opacity = '0';
    heroDefault.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        heroDefault.style.display = 'none';
        heroResult.style.display = 'block';
        heroResult.style.opacity = '0';
        heroResult.style.transform = 'translateY(20px)';
        
        // Trigger fade-in animation
        requestAnimationFrame(() => {
            heroResult.style.opacity = '1';
            heroResult.style.transform = 'translateY(0)';
        });
    }, 200);
}

// Show default hero view
function showDefaultHero() {
    if (!heroDefault || !heroResult) return;
    
    // If result is not visible, just ensure default is shown
    if (heroResult.style.display === 'none') {
        heroDefault.style.display = 'block';
        heroDefault.style.opacity = '1';
        heroDefault.style.transform = 'translateY(0)';
        return;
    }
    
    heroResult.style.opacity = '0';
    heroResult.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        heroResult.style.display = 'none';
        heroDefault.style.display = 'block';
        heroDefault.style.opacity = '0';
        heroDefault.style.transform = 'translateY(-20px)';
        
        // Trigger fade-in animation
        requestAnimationFrame(() => {
            heroDefault.style.opacity = '1';
            heroDefault.style.transform = 'translateY(0)';
        });
    }, 200);
}

// Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Search Language Management
function initSearchLanguage() {
    const savedSearchLang = localStorage.getItem('temeteron-search-language');
    if (savedSearchLang && ['romeika', 'greek', 'turkish', 'english'].includes(savedSearchLang)) {
        currentSearchLanguage = savedSearchLang;
    } else {
        currentSearchLanguage = 'romeika';
    }
    updateSearchLanguage(currentSearchLanguage);
}

function updateSearchLanguage(lang) {
    currentSearchLanguage = lang;
    localStorage.setItem('temeteron-search-language', lang);
    
    // Update active button
    if (searchLangButtons && searchLangButtons.length > 0) {
        searchLangButtons.forEach(btn => {
            if (btn.getAttribute('data-search-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Update placeholder text
    const placeholders = {
        romeika: 'Search a Romeika word…',
        greek: 'Search in Greek…',
        turkish: 'Search in Turkish…',
        english: 'Search in English…'
    };
    if (searchInput) {
        searchInput.placeholder = placeholders[lang] || placeholders.romeika;
    }
}

function handleSearchLanguageChange(lang) {
    updateSearchLanguage(lang);
}

// Event Listeners
modeToggle.addEventListener('click', toggleTheme);

if (langButtons && langButtons.length > 0) {
    langButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = e.target.getAttribute('data-lang');
            handleLanguageChange(lang);
        });
    });
}

if (searchLangButtons && searchLangButtons.length > 0) {
    searchLangButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = e.target.closest('.search-lang-btn').getAttribute('data-search-lang');
            handleSearchLanguageChange(lang);
        });
    });
}

// Debounced autocomplete suggestions
const debouncedSuggestions = debounce((e) => {
    const query = e.target.value;
    if (query.length > 0) {
        getSuggestions(query);
    } else {
        hideSuggestions();
        showDefaultHero();
    }
}, 200);

searchInput.addEventListener('input', debouncedSuggestions);

// Hide suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-input-wrapper')) {
        hideSuggestions();
    }
});

// Initialize theme and language on load
initTheme();
initLanguage();
initSearchLanguage();

// Handle Enter key for immediate search
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query.length > 0) {
            hideSuggestions();
            performSearch(query);
        } else {
            showDefaultHero();
        }
    } else if (e.key === 'Escape') {
        hideSuggestions();
        if (searchInput.value.trim().length === 0) {
            showDefaultHero();
        }
    }
});

