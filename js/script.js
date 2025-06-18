// School Arcade - Free Online Games
// Interactive features for the gaming website

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page DOM loaded successfully');
    console.log('Game data:', typeof games !== 'undefined' ? games.length + ' games found' : 'Game data not found');
    console.log('Category data:', typeof gameCategories !== 'undefined' ? gameCategories.length + ' categories found' : 'Category data not found');
    
    loadCategoriesWithGames();
    loadFeaturedGames();
    loadLatestGames();
    updateGameStats();
    setupSearch();
});

// Category background image configuration - Y8.com style
const categoryBackgrounds = {
    'puzzle': {
        gradient: 'from-purple-600 via-blue-600 to-purple-800',
        image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=200&fit=crop&q=80',
        icon: '🧩'
    },
    'action': {
        gradient: 'from-red-600 via-orange-600 to-red-800',
        image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=200&fit=crop&q=80',
        icon: '⚔️'
    },
    'racing': {
        gradient: 'from-blue-600 via-cyan-600 to-blue-800',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=200&fit=crop&q=80',
        icon: '🏎️'
    },
    'casual': {
        gradient: 'from-green-600 via-teal-600 to-green-800',
        image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=200&fit=crop&q=80',
        icon: '🎯'
    },
    'adventure': {
        gradient: 'from-indigo-600 via-purple-600 to-indigo-800',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop&q=80',
        icon: '🗺️'
    },
    'sports': {
        gradient: 'from-yellow-600 via-orange-600 to-yellow-800',
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=200&fit=crop&q=80',
        icon: '⚽'
    },
    'dress-up': {
        gradient: 'from-pink-600 via-rose-600 to-pink-800',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=200&fit=crop&q=80',
        icon: '👗'
    }
};

// Load categories and games - Foldable layout
function loadCategoriesWithGames() {
    console.log('Starting to load category games...');
    const container = document.getElementById('categoriesWithGamesContainer');
    if (!container) {
        console.error('Cannot find categoriesWithGamesContainer element');
        return;
    }

    container.innerHTML = '';

    gameCategories.forEach(category => {
        const categoryGames = games.filter(game => game.categories.includes(category.id));
        console.log(`${category.name} category has ${categoryGames.length} games`);
        if (categoryGames.length === 0) return; // Skip categories with no games

        const bg = categoryBackgrounds[category.id] || categoryBackgrounds['puzzle'];
        
        // Create category area container
        const categorySection = document.createElement('div');
        categorySection.className = 'mb-12';
        
        categorySection.innerHTML = `
            <!-- Category title area -->
            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center space-x-4">
                    <div class="w-16 h-16 bg-gradient-to-br ${bg.gradient} rounded-2xl flex items-center justify-center text-2xl shadow-lg transform hover:scale-110 transition-transform">
                        ${bg.icon}
                    </div>
                    <div>
                        <h3 class="text-2xl font-bold text-gray-800 mb-1">${category.name}</h3>
                        <p class="text-gray-600">${category.description} · ${categoryGames.length} games</p>
                    </div>
                </div>
                <a href="category.html?cat=${category.id}" class="bg-gradient-to-r ${bg.gradient} text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105 flex items-center space-x-2">
                    <span>View all</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </a>
            </div>
            
            <!-- Game grid display area -->
            <div class="relative">
                <!-- First row of games (default display) -->
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4" id="category-${category.id}-row1">
                    <!-- First row of 6 games -->
                </div>
                
                <!-- Remaining games (foldable) -->
                <div class="hidden" id="category-${category.id}-more">
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4" id="category-${category.id}-additional">
                        <!-- Remaining games -->
                    </div>
                </div>
                
                <!-- Expand/collapse button -->
                ${categoryGames.length > 6 ? `
                    <div class="text-center">
                        <button onclick="window.toggleCategoryGames('${category.id}')" 
                                id="toggle-${category.id}" 
                                class="bg-gradient-to-r ${bg.gradient} text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all transform hover:scale-105 flex items-center space-x-2 mx-auto">
                            <span id="toggle-text-${category.id}">Show more ${categoryGames.length - 6} games</span>
                            <svg id="toggle-icon-${category.id}" class="w-4 h-4 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                            </svg>
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
        
        container.appendChild(categorySection);
        
        // Load games for this category
        loadCategoryGames(category.id, categoryGames);
    });
    
    console.log('Category games loaded successfully');
}

// Load games for a specific category
function loadCategoryGames(categoryId, categoryGames) {
    const row1Container = document.getElementById(`category-${categoryId}-row1`);
    const additionalContainer = document.getElementById(`category-${categoryId}-additional`);
    
    if (!row1Container) return;
    
    // Clear container
    row1Container.innerHTML = '';
    if (additionalContainer) additionalContainer.innerHTML = '';
    
    // First row displays 6 games
    const firstRowGames = categoryGames.slice(0, 6);
    const additionalGames = categoryGames.slice(6);
    
    // Load first row games
    firstRowGames.forEach(game => {
        const gameCard = createCompactGameCard(game);
        row1Container.appendChild(gameCard);
    });
    
    // Load remaining games
    if (additionalContainer && additionalGames.length > 0) {
        additionalGames.forEach(game => {
            const gameCard = createCompactGameCard(game);
            additionalContainer.appendChild(gameCard);
        });
    }
}

// Create a compact game card (only image, rating, title)
function createCompactGameCard(game) {
    const gameCard = document.createElement('div');
    gameCard.className = 'group cursor-pointer transform transition-all duration-300 hover:scale-105';
    
    gameCard.innerHTML = `
        <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <!-- 游戏图片 -->
            <div class="relative bg-gradient-to-br from-purple-100 to-pink-100 h-24 overflow-hidden">
                <img src="${game.image || 'https://via.placeholder.com/200x150/8B5CF6/FFFFFF?text=' + encodeURIComponent(game.title)}" 
                     alt="${game.title}" 
                     class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                     onerror="this.src='https://via.placeholder.com/200x150/6B7280/FFFFFF?text=🎮'">
                     
                ${game.rating ? `
                    <div class="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                        <span>⭐</span>
                        <span>${game.rating}</span>
                    </div>
                ` : ''}
                
                ${game.featured ? `
                    <div class="absolute top-2 left-2 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        🔥 热门
                    </div>
                ` : ''}
            </div>
            
            <!-- 游戏标题 (compact) -->
            <div class="p-2">
                <h4 class="font-medium text-gray-800 text-sm hover:text-blue-600 transition-colors truncate text-center">
                    ${game.title}
                </h4>
            </div>
        </div>
    `;
    
    gameCard.addEventListener('click', () => {
        window.location.href = `game.html?id=${game.id}`;
    });
    
    return gameCard;
}

// Toggle display/hide of category games - Global function
window.toggleCategoryGames = function(categoryId) {
    const moreContainer = document.getElementById(`category-${categoryId}-more`);
    const toggleText = document.getElementById(`toggle-text-${categoryId}`);
    const toggleIcon = document.getElementById(`toggle-icon-${categoryId}`);
    
    if (!moreContainer || !toggleText || !toggleIcon) return;
    
    const isHidden = moreContainer.classList.contains('hidden');
    
    if (isHidden) {
        // Expand
        moreContainer.classList.remove('hidden');
        toggleText.textContent = 'Collapse';
        toggleIcon.style.transform = 'rotate(180deg)';
        
        // Smooth scroll to expanded content
        setTimeout(() => {
            moreContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 100);
    } else {
        // Collapse
        moreContainer.classList.add('hidden');
        const categoryGames = games.filter(game => game.categories.includes(categoryId));
        toggleText.textContent = `Show more ${categoryGames.length - 6} games`;
        toggleIcon.style.transform = 'rotate(0deg)';
        
        // Smooth scroll back to category title
        const categorySection = document.getElementById(`category-${categoryId}-row1`).closest('.mb-12');
        if (categorySection) {
            categorySection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }
};

// Load featured games - 4-column layout
function loadFeaturedGames() {
    const container = document.getElementById('featuredGamesContainer');
    if (!container) return;

    const featuredGames = games.filter(game => game.featured).slice(0, 8);
    container.innerHTML = '';

    featuredGames.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'group cursor-pointer transform transition-all duration-300 hover:scale-105';
        
        gameCard.innerHTML = `
            <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                <!-- 游戏图片 -->
                <div class="relative h-40 overflow-hidden">
                    <img src="${game.image || 'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=' + encodeURIComponent(game.title)}" 
                         alt="${game.title}" 
                         class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                         onerror="this.src='https://via.placeholder.com/400x300/6B7280/FFFFFF?text=🎮'">
                         
                    ${game.rating ? `
                        <div class="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                            <span>⭐</span>
                            <span>${game.rating}</span>
                        </div>
                    ` : ''}
                    
                    ${game.featured ? `
                        <div class="absolute top-2 left-2 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            🔥 热门
                        </div>
                    ` : ''}
                </div>
                
                <!-- Game information -->
                <div class="p-4">
                    <h3 class="font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                        ${game.title}
                    </h3>
                    <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                        ${game.shortDescription}
                    </p>
                    
                    <!-- Tags and statistics -->
                    <div class="flex items-center justify-between">
                        <div class="flex flex-wrap gap-1">
                            ${(game.tags || game.category || []).slice(0, 2).map(tag => 
                                `<span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">${tag}</span>`
                            ).join('')}
                        </div>
                        <div class="text-xs text-gray-500">
                            🎮 ${formatNumber(game.plays)}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        gameCard.addEventListener('click', () => {
            window.location.href = `game.html?id=${game.id}`;
        });
        
        container.appendChild(gameCard);
    });
}

// Load latest games - Horizontal scroll
function loadLatestGames() {
    const container = document.getElementById('latestGamesContainer');
    if (!container) return;

    // Sort by addition order in reverse order, display the latest 8 games
    const latestGames = [...games].reverse().slice(0, 10);
    container.innerHTML = '';

    latestGames.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'flex-shrink-0 w-64 cursor-pointer transform transition-all duration-300 hover:scale-105';
        
        gameCard.innerHTML = `
            <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <!-- 游戏图片 -->
                <div class="relative h-36 overflow-hidden">
                    <img src="${game.image || 'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=' + encodeURIComponent(game.title)}" 
                         alt="${game.title}" 
                         class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                         onerror="this.src='https://via.placeholder.com/400x300/6B7280/FFFFFF?text=🎮'">
                         
                    <!-- NEW徽章 -->
                    <div class="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                        NEW
                    </div>
                </div>
                
                <div class="p-4">
                    <h3 class="font-bold text-gray-800 mb-2 line-clamp-1">${game.title}</h3>
                    <p class="text-gray-600 text-sm mb-2 line-clamp-2">${game.shortDescription}</p>
                    <div class="flex items-center justify-between text-xs text-gray-500">
                        <span>⭐ ${game.rating}</span>
                        <span>🎮 ${formatNumber(game.plays)}</span>
                    </div>
                </div>
            </div>
        `;
        
        gameCard.addEventListener('click', () => {
            window.location.href = `game.html?id=${game.id}`;
        });
        
        container.appendChild(gameCard);
    });
}

// Refresh featured games
function refreshFeaturedGames() {
    const button = event.target;
    button.innerHTML = '🔄 Refreshing...';
    button.disabled = true;
    
    // Shuffle algorithm
    const shuffled = [...games].sort(() => 0.5 - Math.random());
    const newFeatured = shuffled.slice(0, 8);
    
    setTimeout(() => {
        loadFeaturedGames();
        button.innerHTML = 'Change batch';
        button.disabled = false;
    }, 800);
}

// Update game statistics
function updateGameStats() {
    const totalGamesElement = document.getElementById('totalGames');
    if (totalGamesElement) {
        totalGamesElement.textContent = games.length;
    }
}

// Search functionality setup
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchInputMobile = document.getElementById('searchInputMobile');
    const searchResults = document.getElementById('searchResults');
    const searchResultsContainer = document.getElementById('searchResultsContainer');

    // 搜索处理函数
    function handleSearch(inputElement) {
        const query = inputElement.value.trim().toLowerCase();
        
        if (query.length < 2) {
            // 隐藏搜索结果，显示其他内容
            const searchResults = document.getElementById('searchResults');
            if (searchResults) {
                searchResults.classList.add('hidden');
            }
            
            // 恢复其他内容区域显示
            const categoriesSection = document.querySelector('section.pt-6.pb-8.bg-white');
            const featuredSection = document.getElementById('featuredGames');
            const latestSection = document.querySelector('section.py-8.bg-gradient-to-br');
            
            if (categoriesSection) categoriesSection.style.display = 'block';
            if (featuredSection) featuredSection.style.display = 'block';
            if (latestSection) latestSection.style.display = 'block';
            return;
        }

        const results = games.filter(game => 
            game.title.toLowerCase().includes(query) ||
            game.shortDescription.toLowerCase().includes(query) ||
            game.tags.some(tag => tag.toLowerCase().includes(query))
        );

        displaySearchResults(results);
    }

    // 绑定桌面端搜索框
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            handleSearch(this);
            // 同步到移动端搜索框
            if (searchInputMobile) {
                searchInputMobile.value = this.value;
            }
        });
    }

    // 绑定移动端搜索框
    if (searchInputMobile) {
        searchInputMobile.addEventListener('input', function() {
            handleSearch(this);
            // 同步到桌面端搜索框
            if (searchInput) {
                searchInput.value = this.value;
            }
        });
    }
}

// Display search results
function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    
    if (!searchResults || !searchResultsContainer) return;

    // 隐藏其他内容区域
    const categoriesSection = document.querySelector('section.pt-6.pb-8.bg-white');
    const featuredSection = document.getElementById('featuredGames');
    const latestSection = document.querySelector('section.py-8.bg-gradient-to-br');
    
    if (categoriesSection) categoriesSection.style.display = 'none';
    if (featuredSection) featuredSection.style.display = 'none';
    if (latestSection) latestSection.style.display = 'none';

    searchResultsContainer.innerHTML = '';
    
    if (results.length === 0) {
        searchResultsContainer.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-6xl mb-4">🔍</div>
                <h3 class="text-xl font-semibold text-gray-600">No games found related to your search</h3>
                <p class="text-gray-500 mt-2">Try different keywords!</p>
            </div>
        `;
    } else {
        results.forEach(game => {
            const gameCard = createGameCard(game);
            searchResultsContainer.appendChild(gameCard);
        });
    }
    
    searchResults.classList.remove('hidden');
}

// Create game card
function createGameCard(game) {
    const gameCard = document.createElement('div');
    gameCard.className = 'group cursor-pointer transform transition-all duration-300 hover:scale-105';
    
    gameCard.innerHTML = `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
            <!-- 游戏图片 -->
            <div class="relative h-48 overflow-hidden">
                <img src="${game.image || 'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=' + encodeURIComponent(game.title)}" 
                     alt="${game.title}" 
                     class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                     onerror="this.src='https://via.placeholder.com/400x300/6B7280/FFFFFF?text=🎮'">
                     
                ${game.rating ? `
                    <div class="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                        <span>⭐</span>
                        <span>${game.rating}</span>
                    </div>
                ` : ''}
                
                ${game.featured ? `
                    <div class="absolute top-2 left-2 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        🔥 热门
                    </div>
                ` : ''}
            </div>
            
            <!-- Game content -->
            <div class="p-6">
                <h3 class="font-bold text-xl text-gray-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-1">
                    ${game.title}
                </h3>
                <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                    ${game.shortDescription}
                </p>
                
                <!-- Game categories -->
                <div class="flex flex-wrap gap-2 mb-4">
                    ${(game.category || game.categories || []).slice(0, 3).map(cat => {
                        const categoryMap = {
                            puzzle: '🧩 解谜',
                            action: '⚔️ 动作',
                            racing: '🏎️ 竞速',
                            casual: '🎯 休闲',
                            adventure: '🗺️ 冒险',
                            sports: '⚽ 体育'
                        };
                        return `<span class="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm px-3 py-1 rounded-full font-medium border border-purple-200">
                            ${categoryMap[cat] || cat}
                        </span>`;
                    }).join('')}
                </div>
                
                <!-- Statistics -->
                <div class="flex items-center justify-between text-sm text-gray-500">
                    <div class="flex items-center space-x-4">
                        <span class="flex items-center">
                            <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                            ${game.rating}
                        </span>
                        <span>🎮 ${formatNumber(game.plays)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    gameCard.addEventListener('click', () => {
        window.location.href = `game.html?id=${game.id}`;
    });
    
    return gameCard;
}

// Utility function
function getRandomGradient() {
    const gradients = [
        'from-blue-500 to-purple-600',
        'from-purple-500 to-pink-600',
        'from-green-500 to-blue-600',
        'from-yellow-500 to-red-600',
        'from-indigo-500 to-purple-600',
        'from-pink-500 to-rose-600'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
}

function formatNumber(num) {
    return num >= 1000000 ? (num / 1000000).toFixed(1) + 'M' : 
           num >= 1000 ? (num / 1000).toFixed(1) + 'K' : 
           num.toString();
}

// CSS utility class - Added to head
if (!document.querySelector('#utility-styles')) {
    const style = document.createElement('style');
    style.id = 'utility-styles';
    style.textContent = `
        .line-clamp-1 {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        /* Horizontal scrollbar style */
        .overflow-x-auto::-webkit-scrollbar {
            height: 6px;
        }
        .overflow-x-auto::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
    `;
    document.head.appendChild(style);
}

// Category sidebar navigation functionality
window.openCategorySidebar = function() {
    const sidebar = document.getElementById('categorySidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    // Load category list
    loadCategoryListInSidebar();
    
    // Show sidebar and overlay
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
};

window.closeCategorySidebar = function() {
    const sidebar = document.getElementById('categorySidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    // Hide sidebar and overlay
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
    
    // Restore background scrolling
    document.body.style.overflow = 'auto';
};

// Load category list in sidebar
function loadCategoryListInSidebar() {
    const categoryList = document.getElementById('categoryList');
    if (!categoryList) return;
    
    categoryList.innerHTML = '';
    
    gameCategories.forEach(category => {
        const categoryGames = games.filter(game => game.categories.includes(category.id));
        if (categoryGames.length === 0) return;
        
        const bg = categoryBackgrounds[category.id] || categoryBackgrounds['puzzle'];
        
        const categoryItem = document.createElement('div');
        categoryItem.className = 'group cursor-pointer';
        
        categoryItem.innerHTML = `
            <div class="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors" onclick="scrollToCategory('${category.id}')">
                <!-- Category icon -->
                <div class="w-12 h-12 bg-gradient-to-br ${bg.gradient} rounded-xl flex items-center justify-center text-lg shadow-md group-hover:scale-110 transition-transform">
                    ${bg.icon}
                </div>
                
                <!-- Category information -->
                <div class="flex-1">
                    <h4 class="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                        ${category.name}
                    </h4>
                    <p class="text-gray-500 text-sm">
                        ${categoryGames.length} games
                    </p>
                </div>
                
                <!-- Right arrow -->
                <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
            </div>
        `;
        
        categoryList.appendChild(categoryItem);
    });
}

// Scroll to specified category position
window.scrollToCategory = function(categoryId) {
    // Close sidebar
    closeCategorySidebar();
    
    // Wait for sidebar close animation to complete before scrolling
    setTimeout(() => {
        const categoryElement = document.getElementById(`category-${categoryId}-row1`);
        if (categoryElement) {
            const categorySection = categoryElement.closest('.mb-12');
            if (categorySection) {
                // Scroll to category position, leaving some top space
                const offsetTop = categorySection.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Add highlight effect
                categorySection.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50');
                setTimeout(() => {
                    categorySection.classList.remove('ring-2', 'ring-blue-500', 'ring-opacity-50');
                }, 2000);
            }
        }
    }, 300);
};

// ==================== Game details page functionality ====================

// Check if it's a game details page
if (window.location.pathname.includes('game.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        initGameDetailsPage();
    });
}

// Initialize game details page
function initGameDetailsPage() {
    console.log('Initializing game details page...');
    
    // Get game ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');
    
    if (!gameId) {
        console.error('Game ID parameter not found');
        showGameNotFound();
        return;
    }
    
    console.log('Loading game:', gameId);
    
    // Find game data
    const game = games.find(g => g.id === gameId);
    
    if (!game) {
        console.error('Game data not found:', gameId);
        showGameNotFound();
        return;
    }
    
    console.log('Found game data:', game.title);
    
    // Load game details
    loadGameDetails(game);
    loadRelatedGames(game);
    setupGameInteractions(game);
}

// Load game details
function loadGameDetails(game) {
    console.log('Loading game details:', game.title);
    
    // Update page title
    document.title = `${game.title} - School Arcade`;
    document.getElementById('gameTitle').textContent = `${game.title} - School Arcade`;
    document.getElementById('gameDescription').content = game.shortDescription;
    
    // Update breadcrumb navigation
    updateBreadcrumb(game);
    
    // Update game main information
    document.getElementById('gameMainTitle').textContent = game.title;
    document.getElementById('gameRating').textContent = game.rating;
    document.getElementById('gamePlays').textContent = formatNumber(game.plays);
    document.getElementById('gameShortDescription').textContent = game.shortDescription;
    
    // Update game rating details
    document.getElementById('gameRatingDetail').textContent = `${game.rating} out of 5`;
    
    // Update game full description
    const fullDescElement = document.getElementById('gameFullDescription');
    if (game.fullDescription) {
        fullDescElement.innerHTML = game.fullDescription;
    } else {
        fullDescElement.innerHTML = `
            <p>${game.shortDescription}</p>
            <p class="mt-4">这是一个精彩的在线游戏，立即开始游玩吧！</p>
        `;
    }
    
    // Load game tags
    loadGameTags(game);
    
    // Load game categories
    loadGameCategories(game);
    
    // Load game iframe
    loadGameFrame(game);
    
    console.log('Game details loaded successfully');
}

// Update breadcrumb navigation
function updateBreadcrumb(game) {
    const categoryId = game.categories[0]; // Get first category
    const category = gameCategories.find(cat => cat.id === categoryId);
    
    if (category) {
        const breadcrumbCategory = document.getElementById('breadcrumbCategory');
        breadcrumbCategory.textContent = category.name;
        breadcrumbCategory.href = `category.html?cat=${categoryId}`;
    }
    
    document.getElementById('breadcrumbGame').textContent = game.title;
}

// Load game tags
function loadGameTags(game) {
    const tagsContainer = document.getElementById('gameTagsContainer');
    const tagsSidebar = document.getElementById('gameTagsSidebar');
    
    tagsContainer.innerHTML = '';
    tagsSidebar.innerHTML = '';
    
    game.tags.forEach(tag => {
        // Main area tag
        const tagElement = document.createElement('span');
        tagElement.className = 'bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
        
        // Sidebar tag
        const sidebarTagElement = document.createElement('span');
        sidebarTagElement.className = 'bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm';
        sidebarTagElement.textContent = tag;
        tagsSidebar.appendChild(sidebarTagElement);
    });
}

// Load game categories
function loadGameCategories(game) {
    const categoriesContainer = document.getElementById('gameCategoriesContainer');
    categoriesContainer.innerHTML = '';
    
    game.categories.forEach(categoryId => {
        const category = gameCategories.find(cat => cat.id === categoryId);
        if (category) {
            const categoryElement = document.createElement('a');
            categoryElement.href = `category.html?cat=${categoryId}`;
            categoryElement.className = 'bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors';
            categoryElement.textContent = category.name;
            categoriesContainer.appendChild(categoryElement);
        }
    });
}

// Load game iframe
function loadGameFrame(game) {
    const gameFrame = document.getElementById('gameFrame');
    
    if (game.iframe) {
        gameFrame.src = game.iframe;
        console.log('Game iframe loaded:', game.iframe);
    } else {
        // If there's no iframe, display placeholder content
        const gameContainer = document.getElementById('gameContainer');
        gameContainer.innerHTML = `
            <div class="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <div class="text-center">
                    <div class="text-6xl mb-4">🎮</div>
                    <h3 class="text-xl font-bold text-gray-700 mb-2">${game.title}</h3>
                    <p class="text-gray-600">游戏即将上线，敬请期待！</p>
                </div>
            </div>
        `;
    }
}

// Load related games
function loadRelatedGames(currentGame) {
    const container = document.getElementById('relatedGamesContainer');
    if (!container) return;
    
    // Get other games in the same category
    const relatedGames = games.filter(game => 
        game.id !== currentGame.id && 
        game.categories.some(cat => currentGame.categories.includes(cat))
    ).slice(0, 4);
    
    // If there are not enough games in the same category, use other games to supplement
    if (relatedGames.length < 4) {
        const otherGames = games.filter(game => 
            game.id !== currentGame.id && 
            !relatedGames.includes(game)
        );
        relatedGames.push(...otherGames.slice(0, 4 - relatedGames.length));
    }
    
    container.innerHTML = '';
    
    relatedGames.forEach(game => {
        const gameCard = createRelatedGameCard(game);
        container.appendChild(gameCard);
    });
}

// Create related game card
function createRelatedGameCard(game) {
    const gameCard = document.createElement('div');
    gameCard.className = 'flex-shrink-0 w-48 cursor-pointer transform transition-all duration-300 hover:scale-105';
    
    gameCard.innerHTML = `
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <!-- 游戏图片 -->
            <div class="relative h-28 overflow-hidden">
                <img src="${game.image || 'https://via.placeholder.com/200x150/8B5CF6/FFFFFF?text=' + encodeURIComponent(game.title)}" 
                     alt="${game.title}" 
                     class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                     onerror="this.src='https://via.placeholder.com/200x150/6B7280/FFFFFF?text=🎮'">
                     
                ${game.rating ? `
                    <div class="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                        <span>⭐</span>
                        <span>${game.rating}</span>
                    </div>
                ` : ''}
                
                ${game.featured ? `
                    <div class="absolute top-2 left-2 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        🔥 热门
                    </div>
                ` : ''}
            </div>
            
            <div class="p-3">
                <h4 class="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">${game.title}</h4>
                <p class="text-gray-600 text-xs mb-2 line-clamp-2">${game.shortDescription}</p>
                <div class="flex items-center justify-between text-xs text-gray-500">
                    <span>⭐ ${game.rating}</span>
                    <span>🎮 ${formatNumber(game.plays)}</span>
                </div>
            </div>
        </div>
    `;
    
    gameCard.addEventListener('click', () => {
        window.location.href = `game.html?id=${game.id}`;
    });
    
    return gameCard;
}

// Set game interactions
function setupGameInteractions(game) {
    // Fullscreen button
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', function() {
            const gameContainer = document.getElementById('gameContainer');
            if (gameContainer.requestFullscreen) {
                gameContainer.requestFullscreen();
            } else if (gameContainer.webkitRequestFullscreen) {
                gameContainer.webkitRequestFullscreen();
            } else if (gameContainer.msRequestFullscreen) {
                gameContainer.msRequestFullscreen();
            }
        });
    }
    
    console.log('Game interactions setup completed');
}

// Show game not found page
function showGameNotFound() {
    document.title = 'Game not found - School Arcade';
    
    const mainContent = document.querySelector('.max-w-7xl');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="text-center py-16">
                <div class="text-8xl mb-8">🎮</div>
                <h1 class="text-4xl font-bold text-gray-800 mb-4">Game not found</h1>
                <p class="text-xl text-gray-600 mb-8">Sorry, the game you're trying to access doesn't exist or has been removed.</p>
                <div class="space-x-4">
                    <a href="index.html" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                        Return to homepage
                    </a>
                    <a href="category.html" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                        Browse games
                    </a>
                </div>
            </div>
        `;
    }
} 