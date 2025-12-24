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
        didYouMean: 'Did you mean?',
        playFromOurRegion: 'Play from our region'
    },
    gr: {
        searchPlaceholder: 'Αναζήτηση romeika λέξης…',
        searchHelper: 'Αναζητήστε romeika λέξεις και εξερευνήστε σημασίες, μεταφράσεις και ετυμολογία.',
        description: 'Το Temeteron είναι ένας ψηφιακός λεξικός και μεταφραστικός πόρος για τα Romeika (Ποντιακά ελληνικά), με στόχο να τεκμηριώσει, να διατηρήσει και να καταστήσει προσβάσιμο το λεξιλόγιο, τις σημασίες και τη γλωσσική κληρονομιά της περιοχής.',
        wordOfDay: 'Λέξη της Ημέρας',
        greekLabel: 'Ελληνικά:',
        turkishLabel: 'Τουρκικά:',
        englishLabel: 'Αγγλικά:',
        didYouMean: 'Εννοείτε;',
        playFromOurRegion: 'Παίξτε από τις περιοχές μας'
    },
    tr: {
        searchPlaceholder: 'Romeika kelimesi ara…',
        searchHelper: 'Romeika kelimelerini arayın ve anlamları, çevirileri ve etimolojisini keşfedin.',
        description: 'Temeteron, Romeika (Pontus Yunancası) için dijital bir sözlük ve çeviri kaynağıdır; bölgenin kelime dağarcığını, anlamlarını ve dilsel mirasını belgelemeyi, korumayı ve erişilebilir kılmayı amaçlar.',
        wordOfDay: 'Günün Kelimesi',
        greekLabel: 'Yunanca:',
        turkishLabel: 'Türkçe:',
        englishLabel: 'İngilizce:',
        didYouMean: 'Bunu mu demek istediniz?',
        playFromOurRegion: 'Bizim oralardan çal'
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
const phoneticPlayButton = document.getElementById("phoneticPlayButton");
const musicPlayer = document.getElementById('musicPlayer');
const musicPlayButton = document.getElementById('musicPlayButton');
const musicCloseButton = document.getElementById('musicCloseButton');
const musicRestoreButton = document.getElementById('musicRestoreButton');
const youtubeAudioPlayer = document.getElementById('youtubeAudioPlayer');

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
    if (heroPhoneticIpa && phoneticPlayButton) {
        const wrapper = phoneticPlayButton.parentElement;
        if (data.phonetic_ipa && data.phonetic_ipa.trim() && wrapper) {
            heroPhoneticIpa.textContent = data.phonetic_ipa;
            wrapper.style.display = 'flex';
            // Store word for pronunciation
            wrapper.dataset.word = word;
            wrapper.dataset.phoneticIpa = data.phonetic_ipa;
            wrapper.dataset.phoneticLatin = data.phonetic_latin || word;
        } else if (wrapper) {
            wrapper.style.display = 'none';
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

// Music Player - YouTube IFrame API
let youtubePlayer = null;
let isPlaying = false;
let isPlayerReady = false;
const PLAYLIST_ID = 'PLS2AaukaGyNihFFJpBLYm7sPaXTK2BUGo';

// YouTube API callback - MUST be global
function initYouTubePlayer() {
    if (youtubePlayer) {
        console.log('Player already initialized');
        return;
    }
    
    if (!youtubeAudioPlayer) {
        console.error('Player element not found');
        return;
    }
    
    if (!window.YT || !window.YT.Player) {
        console.error('YouTube API not available');
        return;
    }
    
    console.log('Initializing YouTube player...');
    
    try {
        youtubePlayer = new YT.Player('youtubeAudioPlayer', {
            height: '0',
            width: '0',
            playerVars: {
                listType: 'playlist',
                list: PLAYLIST_ID,
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                enablejsapi: 1,
                fs: 0,
                iv_load_policy: 3,
                modestbranding: 1,
                playsinline: 1,
                rel: 0
            },
            events: {
                'onReady': function(event) {
                    console.log('✅ Player ready!');
                    isPlayerReady = true;
                    if (musicPlayButton) {
                        musicPlayButton.classList.remove('loading');
                    }
                },
                'onStateChange': function(event) {
                    const state = event.data;
                    const playIcon = musicPlayButton ? musicPlayButton.querySelector('.play-icon') : null;
                    
                    console.log('Player state changed:', state);
                    
                    if (state === YT.PlayerState.PLAYING || state === 1) {
                        isPlaying = true;
                        if (musicPlayButton) musicPlayButton.classList.add('playing');
                        if (playIcon) playIcon.textContent = '❚❚';
                        console.log('▶ Playing');
                    } else if (state === YT.PlayerState.PAUSED || state === 2) {
                        isPlaying = false;
                        if (musicPlayButton) musicPlayButton.classList.remove('playing');
                        if (playIcon) playIcon.textContent = '▶';
                        console.log('⏸ Paused');
                    } else if (state === YT.PlayerState.CUED || state === 5) {
                        isPlayerReady = true;
                        if (musicPlayButton) musicPlayButton.classList.remove('loading');
                        console.log('✅ Playlist cued and ready');
                    } else if (state === YT.PlayerState.BUFFERING || state === 3) {
                        console.log('⏳ Buffering...');
                    }
                },
                'onError': function(event) {
                    console.error('❌ Player error:', event.data);
                    if (musicPlayButton) {
                        const playIcon = musicPlayButton.querySelector('.play-icon');
                        if (playIcon) playIcon.textContent = '⚠';
                    }
                }
            }
        });
        console.log('Player initialization started');
        
        // Fallback: If onReady doesn't fire, wait a bit more and check player methods
        setTimeout(() => {
            if (!isPlayerReady && youtubePlayer) {
                console.log('⚠️ onReady did not fire, checking player methods...');
                // Check if player methods are available
                if (typeof youtubePlayer.getPlayerState === 'function' && 
                    typeof youtubePlayer.playVideo === 'function') {
                    console.log('✅ Player methods available, enabling...');
                    isPlayerReady = true;
                    if (musicPlayButton) {
                        musicPlayButton.classList.remove('loading');
                    }
                } else {
                    console.log('⏳ Player methods not ready yet, will retry...');
                    // Retry after another second
                    setTimeout(() => {
                        if (!isPlayerReady && youtubePlayer) {
                            if (typeof youtubePlayer.playVideo === 'function') {
                                console.log('✅ Player ready after retry');
                                isPlayerReady = true;
                                if (musicPlayButton) {
                                    musicPlayButton.classList.remove('loading');
                                }
                            }
                        }
                    }, 1000);
                }
            }
        }, 3000);
    } catch (error) {
        console.error('Error creating player:', error);
        youtubePlayer = null;
    }
}

// Set global callback for YouTube API
if (typeof window !== 'undefined') {
    window.onYouTubeIframeAPIReady = function() {
        console.log('YouTube API ready');
        // Wait a bit for DOM to be fully ready
        setTimeout(initYouTubePlayer, 100);
    };
}

// Music Player
function initMusicPlayer() {
    if (!musicPlayer || !musicPlayButton || !musicCloseButton || !musicRestoreButton) return;
    
    // Initially show loading state (but don't disable - allow clicks for debugging)
    if (musicPlayButton) {
        musicPlayButton.classList.add('loading');
        // Don't disable the button - just show loading state visually
        // Disabled buttons don't trigger click events
    }
    
    // Handle play button click
    musicPlayButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!youtubePlayer) return;
        
        // If not ready, check if methods are available anyway
        if (!isPlayerReady) {
            if (typeof youtubePlayer.playVideo === 'function') {
                isPlayerReady = true;
                if (musicPlayButton) musicPlayButton.classList.remove('loading');
            } else {
                return;
            }
        }
        
        try {
            if (isPlaying) {
                youtubePlayer.pauseVideo();
            } else {
                // Try playVideoAt(0) for playlists, fallback to playVideo()
                if (youtubePlayer.playVideoAt && typeof youtubePlayer.playVideoAt === 'function') {
                    youtubePlayer.playVideoAt(0);
                } else {
                    youtubePlayer.playVideo();
                }
            }
        } catch (error) {
            // Ignore postMessage errors (harmless)
            if (!error.message || !error.message.includes('postMessage')) {
                console.error('Error controlling player:', error);
            }
        }
    });
    
    // Function to hide player
    function hidePlayer() {
        musicPlayer.classList.remove('visible');
        musicPlayer.classList.add('hidden');
        musicRestoreButton.classList.remove('hidden');
        musicRestoreButton.classList.add('visible');
    }
    
    // Function to show player
    function showPlayer() {
        musicPlayer.classList.remove('hidden');
        musicPlayer.classList.add('visible');
        musicRestoreButton.classList.remove('visible');
        musicRestoreButton.classList.add('hidden');
    }
    
    // Handle close button click - hide player
    musicCloseButton.addEventListener('click', (e) => {
        e.stopPropagation();
        hidePlayer();
    });
    
    // Handle restore button click - show player
    musicRestoreButton.addEventListener('click', () => {
        showPlayer();
    });
    
    // Check if API is already loaded and initialize
    if (window.YT && window.YT.Player) {
        setTimeout(initYouTubePlayer, 100);
    }
}

// Phonetic Pronunciation with ElevenLabs + Supabase Storage Cache
const ELEVENLABS_API_KEY = 'sk_9a83e280dce6178924e52e1cba1099afb65eea57f70d5e4e';
const ELEVENLABS_VOICE_ID = 'wykE1oPxFaMrxdpOtFt6';
const AUDIO_BUCKET = 'pronunciations'; // Supabase Storage bucket name

// Generate a unique filename from text
function getAudioFileName(text, voiceId = ELEVENLABS_VOICE_ID) {
    // Normalize text: lowercase, remove special chars, replace spaces with underscores
    const normalized = text.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 50); // Limit length
    return `${normalized}_${voiceId}.mp3`;
}

// Check if audio exists in Supabase Storage
async function getCachedAudio(text, voiceId = ELEVENLABS_VOICE_ID) {
    try {
        const fileName = getAudioFileName(text, voiceId);
        const { data, error } = await supabaseClient.storage
            .from(AUDIO_BUCKET)
            .download(fileName);
        
        if (error) {
            // File doesn't exist
            return null;
        }
        
        // File exists, return blob URL
        return URL.createObjectURL(data);
    } catch (error) {
        console.error('Error checking cache:', error);
        return null;
    }
}

// Save audio to Supabase Storage
async function saveAudioToCache(text, audioBlob, voiceId = ELEVENLABS_VOICE_ID) {
    try {
        const fileName = getAudioFileName(text, voiceId);
        const { error } = await supabaseClient.storage
            .from(AUDIO_BUCKET)
            .upload(fileName, audioBlob, {
                contentType: 'audio/mpeg',
                upsert: true // Overwrite if exists
            });
        
        if (error) {
            console.error('Error saving to cache:', error);
        } else {
            console.log('Audio saved to cache:', fileName);
        }
    } catch (error) {
        console.error('Error in saveAudioToCache:', error);
    }
}

// Generate audio with ElevenLabs API
async function generateElevenLabsAudio(text, voiceId = ELEVENLABS_VOICE_ID) {
    if (!ELEVENLABS_API_KEY) {
        console.error('ElevenLabs API key not configured');
        return null;
    }
    
    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_API_KEY
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_multilingual_v3', // v3 might not be available, using v2
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75
                }
            })
        });
        
        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
                console.error('ElevenLabs API error details:', JSON.stringify(errorData, null, 2));
                
                // Check for quota exceeded error
                if (errorData.detail?.status === 'quota_exceeded') {
                    console.warn('ElevenLabs quota exceeded. Please check your plan or wait for quota reset.');
                }
            } catch (e) {
                const text = await response.text();
                console.error('ElevenLabs API error (text):', text);
                errorData = { message: text };
            }
            console.error('Response status:', response.status);
            return null;
        }
        
        const audioBlob = await response.blob();
        return audioBlob;
    } catch (error) {
        console.error('Error generating audio:', error);
        return null;
    }
}

// Get audio URL (from cache or generate new)
async function getAudioURL(text, voiceId = ELEVENLABS_VOICE_ID) {
    // First, check cache
    const cachedURL = await getCachedAudio(text, voiceId);
    if (cachedURL) {
        console.log('Using cached audio for:', text);
        return cachedURL;
    }
    
    // Not in cache, generate new
    console.log('Generating new audio for:', text);
    const audioBlob = await generateElevenLabsAudio(text, voiceId);
    
    if (audioBlob) {
        // Save to cache for future use
        await saveAudioToCache(text, audioBlob, voiceId);
        // Return blob URL
        return URL.createObjectURL(audioBlob);
    }
    
    return null;
}

// Phonetic Pronunciation
function initPhoneticPlayer() {
    if (!phoneticPlayButton) return;
    
    let currentAudio = null;
    
    phoneticPlayButton.addEventListener('click', async () => {
        const wrapper = phoneticPlayButton.parentElement;
        if (!wrapper) return;
        
        // Stop any currently playing audio
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
            phoneticPlayButton.classList.remove('playing');
        }
        
        // Get word to pronounce (prefer phonetic_latin, fallback to word)
        const wordToPronounce = wrapper.dataset.phoneticLatin || wrapper.dataset.word || '';
        
        if (!wordToPronounce) {
            console.warn('No word to pronounce');
            return;
        }
        
        // Show loading state
        phoneticPlayButton.classList.add('loading');
        phoneticPlayButton.disabled = true;
        
        try {
            // Get audio URL (from cache or generate new via getAudioURL)
            const audioURL = await getAudioURL(wordToPronounce);
            
            if (audioURL) {
                // Play the audio
                currentAudio = new Audio(audioURL);
                
                currentAudio.onplay = () => {
                    phoneticPlayButton.classList.remove('loading');
                    phoneticPlayButton.classList.add('playing');
                    phoneticPlayButton.disabled = false;
                };
                
                currentAudio.onended = () => {
                    phoneticPlayButton.classList.remove('playing');
                    currentAudio = null;
                    // Only revoke if it's a blob URL (starts with blob:)
                    if (audioURL.startsWith('blob:')) {
                        URL.revokeObjectURL(audioURL);
                    }
                };
                
                currentAudio.onerror = (error) => {
                    console.error('Audio playback error:', error);
                    phoneticPlayButton.classList.remove('loading', 'playing');
                    phoneticPlayButton.disabled = false;
                    currentAudio = null;
                    if (audioURL.startsWith('blob:')) {
                        URL.revokeObjectURL(audioURL);
                    }
                };
                
                // Start playing
                currentAudio.play().catch(error => {
                    console.error('Error playing audio:', error);
                    phoneticPlayButton.classList.remove('loading');
                    phoneticPlayButton.disabled = false;
                });
            } else {
                // No audio available (quota exceeded or other error)
                phoneticPlayButton.classList.remove('loading');
                phoneticPlayButton.disabled = false;
                phoneticPlayButton.classList.add('error');
                setTimeout(() => {
                    phoneticPlayButton.classList.remove('error');
                }, 2000);
            }
        } catch (error) {
            console.error('Error in phonetic player:', error);
            phoneticPlayButton.classList.remove('loading');
            phoneticPlayButton.disabled = false;
            phoneticPlayButton.classList.add('error');
            setTimeout(() => {
                phoneticPlayButton.classList.remove('error');
            }, 2000);
        }
    });
}

// Initialize theme and language on load
initTheme();
initLanguage();
initSearchLanguage();
initMusicPlayer();
initPhoneticPlayer();

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

