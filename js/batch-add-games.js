// Batch Add Games JavaScript
// Handles CSV upload and manual batch input functionality

// Global variables
let currentMethod = '';
let csvData = [];
let manualGamesData = [];
let selectedPlaceholderImage = '';

// Predefined placeholder images by category
const placeholderImages = {
    'puzzle': [
        'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Puzzle+Game',
        'https://via.placeholder.com/400x300/6366f1/ffffff?text=Brain+Teaser',
        'https://via.placeholder.com/400x300/7c3aed/ffffff?text=Logic+Game'
    ],
    'action': [
        'https://via.placeholder.com/400x300/ef4444/ffffff?text=Action+Game',
        'https://via.placeholder.com/400x300/dc2626/ffffff?text=Adventure',
        'https://via.placeholder.com/400x300/f97316/ffffff?text=Fighting'
    ],
    'racing': [
        'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Racing+Game',
        'https://via.placeholder.com/400x300/0ea5e9/ffffff?text=Speed+Racing',
        'https://via.placeholder.com/400x300/06b6d4/ffffff?text=Car+Racing'
    ],
    'casual': [
        'https://via.placeholder.com/400x300/10b981/ffffff?text=Casual+Game',
        'https://via.placeholder.com/400x300/059669/ffffff?text=Fun+Game',
        'https://via.placeholder.com/400x300/22c55e/ffffff?text=Easy+Game'
    ],
    'adventure': [
        'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Adventure+Game',
        'https://via.placeholder.com/400x300/7c3aed/ffffff?text=Exploration',
        'https://via.placeholder.com/400x300/6366f1/ffffff?text=Quest'
    ],
    'sports': [
        'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Sports+Game',
        'https://via.placeholder.com/400x300/d97706/ffffff?text=Ball+Game',
        'https://via.placeholder.com/400x300/ca8a04/ffffff?text=Competition'
    ],
    'dress-up': [
        'https://via.placeholder.com/400x300/ec4899/ffffff?text=Dress+Up',
        'https://via.placeholder.com/400x300/f472b6/ffffff?text=Fashion',
        'https://via.placeholder.com/400x300/be185d/ffffff?text=Style'
    ],
    'default': [
        'https://via.placeholder.com/400x300/6b7280/ffffff?text=Game',
        'https://via.placeholder.com/400x300/4b5563/ffffff?text=Play+Now',
        'https://via.placeholder.com/400x300/374151/ffffff?text=Online+Game'
    ]
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Batch Add Games page loaded');
    
    // Set up drag and drop for CSV
    setupDragAndDrop();
    
    // Set up file input event listener
    const csvFileInput = document.getElementById('csvFileInput');
    if (csvFileInput) {
        csvFileInput.addEventListener('change', handleCSVFile);
        console.log('CSV file input event listener added');
    }
});

// Method selection
function selectMethod(method) {
    currentMethod = method;
    
    // Hide all sections first
    document.getElementById('csvSection').classList.add('hidden');
    document.getElementById('manualSection').classList.add('hidden');
    document.getElementById('resultsSection').classList.add('hidden');
    
    if (method === 'csv') {
        document.getElementById('csvSection').classList.remove('hidden');
    } else if (method === 'manual') {
        document.getElementById('manualSection').classList.remove('hidden');
        // Add initial row
        addGameRow();
    }
    
    console.log('Selected method:', method);
}

// ================== CSV FUNCTIONALITY ==================

// Set up drag and drop functionality
function setupDragAndDrop() {
    const dropArea = document.querySelector('.border-dashed');
    if (!dropArea) return;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    dropArea.addEventListener('drop', handleDrop, false);
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight(e) {
        dropArea.classList.add('border-blue-400', 'bg-blue-50');
    }
    
    function unhighlight(e) {
        dropArea.classList.remove('border-blue-400', 'bg-blue-50');
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            handleCSVFile({ target: { files: files } });
        }
    }
}

// Handle CSV file selection
function handleCSVFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    console.log('Processing CSV file:', file.name);
    
    // Show processing message
    const dropZone = document.getElementById('csvDropZone');
    if (dropZone) {
        dropZone.innerHTML = `
            <div class="mb-4">
                <i class="fas fa-spinner fa-spin text-blue-600 text-4xl mb-4"></i>
                <p class="text-blue-600 mb-2">Processing CSV file: ${file.name}</p>
                <p class="text-sm text-gray-500">Please wait...</p>
            </div>
        `;
    }
    
    if (!file.name.toLowerCase().endsWith('.csv')) {
        alert('Please select a CSV file!');
        // Reset dropzone
        resetDropZone();
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const csvText = e.target.result;
        parseCSV(csvText);
    };
    reader.onerror = function() {
        alert('Error reading file!');
        resetDropZone();
    };
    reader.readAsText(file);
}

// Reset drop zone to original state
function resetDropZone() {
    const dropZone = document.getElementById('csvDropZone');
    if (dropZone) {
        dropZone.innerHTML = `
            <div class="mb-4">
                <i class="fas fa-upload text-gray-400 text-4xl mb-4"></i>
                <p class="text-gray-600 mb-2">Drag and drop your CSV file here, or</p>
                <button onclick="document.getElementById('csvFileInput').click()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                    Choose File
                </button>
            </div>
            <input type="file" id="csvFileInput" accept=".csv" class="hidden">
            <p class="text-sm text-gray-500 mt-4">Supported format: CSV (.csv)</p>
        `;
        
        // Re-bind the event listener
        const csvFileInput = document.getElementById('csvFileInput');
        if (csvFileInput) {
            csvFileInput.addEventListener('change', handleCSVFile);
        }
    }
}

// Parse CSV content
function parseCSV(csvText) {
    try {
        const lines = csvText.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
            alert('CSV file must contain at least a header row and one data row!');
            return;
        }
        
        console.log('Total lines in CSV:', lines.length);
        console.log('First few lines:', lines.slice(0, 5));
        
        // Parse header - use proper CSV parsing for quoted fields
        const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());
        console.log('Parsed headers:', headers);
        
        // Validate required columns
        const requiredColumns = ['title', 'category', 'iframe'];
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));
        
        if (missingColumns.length > 0) {
            alert(`Missing required columns: ${missingColumns.join(', ')}\nRequired: ${requiredColumns.join(', ')}\nFound headers: ${headers.join(', ')}`);
            return;
        }
        
        // Parse data rows
        csvData = [];
        let skippedRows = 0;
        
        for (let i = 1; i < lines.length; i++) {
            try {
                const values = parseCSVLine(lines[i]);
                console.log(`Row ${i} - Expected: ${headers.length}, Got: ${values.length}`, values.slice(0, 3));
                
                // More flexible column matching - allow some variance
                if (values.length < headers.length - 2) {
                    console.warn(`Skipping row ${i}: too few columns (${values.length}/${headers.length})`);
                    skippedRows++;
                    continue;
                }
                
                const rowData = {};
                headers.forEach((header, index) => {
                    rowData[header] = index < values.length ? values[index].trim() : '';
                });
                
                // Validate required fields
                if (rowData.title && rowData.category && rowData.iframe) {
                    csvData.push(rowData);
                    console.log(`Added game: ${rowData.title} (${rowData.category})`);
                } else {
                    console.warn(`Skipping row ${i}: missing required fields`, {
                        title: !!rowData.title,
                        category: !!rowData.category,
                        iframe: !!rowData.iframe
                    });
                    skippedRows++;
                }
            } catch (error) {
                console.error(`Error parsing row ${i}:`, error);
                skippedRows++;
            }
        }
        
        console.log(`Parsing complete: ${csvData.length} games parsed, ${skippedRows} rows skipped`);
        
        if (csvData.length === 0) {
            alert('No valid game data found in CSV file! Check console for details.');
            return;
        }
        
        if (skippedRows > 0) {
            alert(`Parsed ${csvData.length} games successfully. ${skippedRows} rows were skipped due to formatting issues. Check console for details.`);
        }
        
        displayCSVPreview();
        
        // Reset dropzone to show success
        const dropZone = document.getElementById('csvDropZone');
        if (dropZone) {
            dropZone.innerHTML = `
                <div class="mb-4">
                    <i class="fas fa-check-circle text-green-600 text-4xl mb-4"></i>
                    <p class="text-green-600 mb-2">CSV file processed successfully!</p>
                    <p class="text-sm text-gray-500">${csvData.length} games ready for import</p>
                    <button onclick="resetDropZone()" class="mt-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                        Upload Another File
                    </button>
                </div>
            `;
        }
        
    } catch (error) {
        console.error('Error parsing CSV:', error);
        alert('Error parsing CSV file. Please check the format and try again. See console for details.');
        resetDropZone();
    }
}

// Proper CSV line parser that handles quoted fields and commas within fields
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    let i = 0;
    
    while (i < line.length) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Escaped quote
                current += '"';
                i += 2;
                continue;
            } else {
                // Toggle quote state
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // Field separator
            result.push(current);
            current = '';
        } else {
            // Regular character
            current += char;
        }
        
        i++;
    }
    
    // Add the last field
    result.push(current);
    
    return result;
}

// Display CSV preview
function displayCSVPreview() {
    const preview = document.getElementById('csvPreview');
    const table = document.getElementById('csvPreviewTable');
    
    if (!preview || !table) return;
    
    // Create table header
    const headers = ['Title', 'Category', 'Iframe URL', 'Description', 'Image URL', 'Status'];
    table.innerHTML = `
        <thead class="bg-gray-100">
            <tr>
                ${headers.map(h => `<th class="px-4 py-2 text-left font-semibold text-gray-700">${h}</th>`).join('')}
            </tr>
        </thead>
        <tbody>
            ${csvData.map(row => `
                <tr class="border-t hover:bg-gray-50">
                    <td class="px-4 py-2 font-medium">${row.title || ''}</td>
                    <td class="px-4 py-2">
                        <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">${row.category || ''}</span>
                    </td>
                    <td class="px-4 py-2 text-sm text-blue-600 truncate max-w-xs">${row.iframe || ''}</td>
                    <td class="px-4 py-2 text-sm text-gray-600 truncate max-w-xs">${row.description || 'Auto-generated'}</td>
                    <td class="px-4 py-2 text-sm text-gray-600 truncate max-w-xs">${row.image || 'Placeholder'}</td>
                    <td class="px-4 py-2">
                        <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Ready</span>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
    
    preview.classList.remove('hidden');
}

// Process CSV games
function processCSVGames() {
    if (csvData.length === 0) {
        alert('No CSV data to process!');
        return;
    }
    
    console.log('Processing', csvData.length, 'games from CSV...');
    
    const processedGames = csvData.map(row => {
        return createGameFromData({
            title: row.title,
            category: row.category,
            iframe: row.iframe,
            description: row.description || `Experience the excitement of ${row.title}. Play this amazing ${row.category} game now!`,
            image: row.image || getDefaultPlaceholderImage(row.category)
        });
    });
    
    addGamesToDatabase(processedGames);
    showResults(processedGames);
}

// Clear CSV data
function clearCSV() {
    csvData = [];
    document.getElementById('csvPreview').classList.add('hidden');
    document.getElementById('csvFileInput').value = '';
}

// Download sample CSV
function downloadSampleCSV() {
    const sampleData = [
        ['title', 'category', 'iframe', 'description', 'image'],
        ['Super Mario Adventure', 'action', 'https://example.com/mario.html', 'Classic platformer adventure', ''],
        ['Puzzle Master', 'puzzle', 'https://example.com/puzzle.html', 'Brain-teasing puzzle game', ''],
        ['Speed Racer', 'racing', 'https://example.com/racing.html', 'High-speed racing excitement', 'https://example.com/racing.jpg']
    ];
    
    const csvContent = sampleData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_games.csv';
    a.click();
    
    window.URL.revokeObjectURL(url);
}

// ================== MANUAL INPUT FUNCTIONALITY ==================

// Add game row to manual input table
function addGameRow() {
    const tableBody = document.getElementById('manualGamesTable');
    if (!tableBody) return;
    
    const rowIndex = tableBody.children.length;
    const row = document.createElement('tr');
    row.className = 'border-t hover:bg-gray-50';
    
    row.innerHTML = `
        <td class="px-4 py-3">
            <input type="text" placeholder="Enter game title" 
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                   onchange="updateManualGameData(${rowIndex}, 'title', this.value)">
        </td>
        <td class="px-4 py-3">
            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onchange="updateManualGameData(${rowIndex}, 'category', this.value)">
                <option value="">Select category</option>
                ${gameCategories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('')}
            </select>
        </td>
        <td class="px-4 py-3">
            <input type="url" placeholder="https://example.com/game.html"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                   onchange="updateManualGameData(${rowIndex}, 'iframe', this.value)">
        </td>
        <td class="px-4 py-3">
            <textarea placeholder="Game description (optional)"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                     onchange="updateManualGameData(${rowIndex}, 'description', this.value)"></textarea>
        </td>
        <td class="px-4 py-3">
            <input type="url" placeholder="https://example.com/image.jpg (optional)"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                   onchange="updateManualGameData(${rowIndex}, 'image', this.value)">
        </td>
        <td class="px-4 py-3 text-center">
            <button onclick="removeGameRow(this)" 
                    class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold transition-colors">
                <i class="fas fa-trash mr-1"></i>Remove
            </button>
        </td>
    `;
    
    tableBody.appendChild(row);
    
    // Initialize data for this row
    manualGamesData[rowIndex] = {
        title: '',
        category: '',
        iframe: '',
        description: '',
        image: ''
    };
    
    console.log('Added game row', rowIndex);
}

// Update manual game data
function updateManualGameData(rowIndex, field, value) {
    if (!manualGamesData[rowIndex]) {
        manualGamesData[rowIndex] = {};
    }
    manualGamesData[rowIndex][field] = value;
    console.log('Updated row', rowIndex, field, ':', value);
}

// Remove game row
function removeGameRow(button) {
    const row = button.closest('tr');
    const rowIndex = Array.from(row.parentNode.children).indexOf(row);
    
    row.remove();
    manualGamesData.splice(rowIndex, 1);
    
    console.log('Removed game row', rowIndex);
}

// Process manual games
function processManualGames() {
    // Filter out incomplete games
    const validGames = manualGamesData.filter(game => 
        game && game.title && game.category && game.iframe
    );
    
    if (validGames.length === 0) {
        alert('Please add at least one complete game with title, category, and iframe URL!');
        return;
    }
    
    console.log('Processing', validGames.length, 'manual games...');
    
    const processedGames = validGames.map(gameData => {
        return createGameFromData({
            title: gameData.title,
            category: gameData.category,
            iframe: gameData.iframe,
            description: gameData.description || `Experience the excitement of ${gameData.title}. Play this amazing ${gameCategories.find(cat => cat.id === gameData.category)?.name || 'game'} now!`,
            image: gameData.image || getDefaultPlaceholderImage(gameData.category)
        });
    });
    
    addGamesToDatabase(processedGames);
    showResults(processedGames);
}

// ================== SHARED FUNCTIONALITY ==================

// Create game object from data
function createGameFromData(data) {
    const gameId = generateGameId(data.title);
    
    return {
        id: gameId,
        title: data.title,
        shortDescription: data.description,
        fullDescription: `
            <h3>About ${data.title}</h3>
            <p>${data.description}</p>
            <h4>Game Features:</h4>
            <ul>
                <li>🎮 Engaging gameplay</li>
                <li>🎯 Easy to learn, fun to master</li>
                <li>⚡ Instant play - no downloads required</li>
                <li>🆓 Completely free to play</li>
            </ul>
        `,
        image: data.image,
        iframe: data.iframe,
        categories: [data.category],
        tags: generateTags(data.title, data.category),
        rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10, // Random rating between 3.5-5.0
        plays: Math.floor(Math.random() * 50000) + 10000, // Random plays between 10k-60k
        featured: Math.random() > 0.7, // 30% chance of being featured
        playTime: getEstimatedPlayTime(data.category)
    };
}

// Generate unique game ID
function generateGameId(title) {
    const baseId = title.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 30);
    
    // Add random suffix to ensure uniqueness
    const suffix = Math.random().toString(36).substring(2, 6);
    return `${baseId}-${suffix}`;
}

// Generate tags based on title and category
function generateTags(title, category) {
    const categoryTags = {
        'puzzle': ['puzzle', 'brain', 'logic', 'thinking'],
        'action': ['action', 'adventure', 'fast-paced', 'exciting'],
        'racing': ['racing', 'speed', 'cars', 'competition'],
        'casual': ['casual', 'fun', 'easy', 'relaxing'],
        'adventure': ['adventure', 'exploration', 'story', 'quest'],
        'sports': ['sports', 'competition', 'athletic', 'team'],
        'dress-up': ['fashion', 'style', 'dress-up', 'creative']
    };
    
    let tags = [...(categoryTags[category] || ['game', 'online'])];
    
    // Add tags based on title keywords
    const titleWords = title.toLowerCase().split(' ');
    titleWords.forEach(word => {
        if (word.length > 3 && !tags.includes(word)) {
            tags.push(word);
        }
    });
    
    return tags.slice(0, 5); // Limit to 5 tags
}

// Get estimated play time based on category
function getEstimatedPlayTime(category) {
    const playTimes = {
        'puzzle': '10-25 minutes',
        'action': '5-15 minutes',
        'racing': '5-20 minutes',
        'casual': '5-10 minutes',
        'adventure': '15-30 minutes',
        'sports': '10-20 minutes',
        'dress-up': '10-20 minutes'
    };
    
    return playTimes[category] || '10-20 minutes';
}

// Get default placeholder image
function getDefaultPlaceholderImage(category) {
    const categoryImages = placeholderImages[category] || placeholderImages['default'];
    return categoryImages[Math.floor(Math.random() * categoryImages.length)];
}

// Add games to database (simulated - in real implementation would save to backend)
function addGamesToDatabase(newGames) {
    // In a real implementation, this would make API calls to save games
    // For now, we'll just add them to the local games array
    
    newGames.forEach(game => {
        games.push(game);
    });
    
    console.log('Added', newGames.length, 'games to database');
    console.log('Total games now:', games.length);
    
    // Show added games in the UI
    showAddedGames(newGames);
    
    // Generate the updated game-data.js content
    generateAndDownloadGameData(newGames);
}

// Generate updated game-data.js file with new games
function generateAndDownloadGameData(newGames) {
    console.log('Generating updated game-data.js file...');
    
    // Create the complete games array including existing and new games
    const allGames = [...games];
    
    // Generate the JavaScript file content
    const gameDataContent = generateGameDataFileContent(allGames);
    
    // Create and download the file
    const blob = new Blob([gameDataContent], { type: 'text/javascript' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game-data.js';
    a.click();
    
    window.URL.revokeObjectURL(url);
    
    // Show instructions to user
    showFileUpdateInstructions(newGames.length);
}

// Generate the complete game-data.js file content
function generateGameDataFileContent(allGames) {
    const content = `// PlayArcade Game Database
// Core game data file for your gaming website

// Game Categories Definition
const gameCategories = [
    {
        id: 'puzzle',
        name: 'Puzzle Games',
        icon: '🧩',
        color: 'from-purple-500 to-pink-600',
        description: 'Challenge your mind with brain-teasing puzzles and logic games'
    },
    {
        id: 'action',
        name: 'Action Games',
        icon: '⚔️',
        color: 'from-red-500 to-orange-600',
        description: 'Fast-paced adventures and thrilling combat experiences'
    },
    {
        id: 'racing',
        name: 'Racing Games',
        icon: '🏎️',
        color: 'from-blue-500 to-cyan-600',
        description: 'Speed through exciting tracks and compete for the finish line'
    },
    {
        id: 'casual',
        name: 'Casual Games',
        icon: '🎯',
        color: 'from-green-500 to-teal-600',
        description: 'Easy-to-play games perfect for quick entertainment'
    },
    {
        id: 'adventure',
        name: 'Adventure Games',
        icon: '🗺️',
        color: 'from-indigo-500 to-purple-600',
        description: 'Explore new worlds and embark on epic journeys'
    },
    {
        id: 'sports',
        name: 'Sports Games',
        icon: '🏀',
        color: 'from-orange-500 to-red-600',
        description: 'Compete in your favorite sports and athletic challenges'
    },
    {
        id: 'dress-up',
        name: 'Dress Up Games',
        icon: '👗',
        color: 'from-pink-500 to-rose-600',
        description: 'Fashion and styling games for creative expression'
    }
];

// Game Database - Enhanced version with multiple games per category
const games = [
${allGames.map(game => generateGameObject(game)).join(',\n')}
];

// Game Statistics - Auto-calculated
const gameStats = {
    totalGames: games.length,
    lastUpdated: new Date().toLocaleDateString(),
    featuredGames: games.filter(game => game.featured).length,
    totalPlays: games.reduce((sum, game) => sum + game.plays, 0),
    averageRating: (games.reduce((sum, game) => sum + game.rating, 0) / games.length).toFixed(1),
    categoryCounts: gameCategories.reduce((acc, category) => {
        acc[category.id] = games.filter(game => game.categories.includes(category.id)).length;
        return acc;
    }, {})
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { games, gameCategories, gameStats };
}

// Expose variables to global scope in browser environment
if (typeof window !== 'undefined') {
    window.games = games;
    window.gameCategories = gameCategories;
    window.gameStats = gameStats;
}`;

    return content;
}

// Generate a single game object string
function generateGameObject(game) {
    return `    {
        id: '${game.id}',
        title: '${escapeString(game.title)}',
        shortDescription: '${escapeString(game.shortDescription)}',
        fullDescription: \`${escapeBackticks(game.fullDescription)}\`,
        image: '${game.image}',
        iframe: '${game.iframe}',
        categories: [${game.categories.map(cat => `'${cat}'`).join(', ')}],
        tags: [${game.tags.map(tag => `'${escapeString(tag)}'`).join(', ')}],
        rating: ${game.rating},
        plays: ${game.plays},
        featured: ${game.featured},
        playTime: '${escapeString(game.playTime)}'
    }`;
}

// Escape strings for JavaScript
function escapeString(str) {
    if (!str) return '';
    return str.replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
}

// Escape backticks for template literals
function escapeBackticks(str) {
    if (!str) return '';
    return str.replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

// Show instructions for updating the file
function showFileUpdateInstructions(gameCount) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200">
                <h3 class="text-2xl font-bold text-gray-800 flex items-center">
                    <i class="fas fa-download text-green-600 mr-3"></i>
                    Database Update Complete!
                </h3>
            </div>
            
            <div class="p-6">
                <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div class="flex items-center mb-2">
                        <i class="fas fa-check-circle text-green-600 mr-2"></i>
                        <span class="font-semibold text-green-800">Successfully processed ${gameCount} games!</span>
                    </div>
                    <p class="text-green-700 text-sm">All games have been validated and added to the database with proper formatting.</p>
                </div>
                
                <div class="mb-6">
                    <h4 class="text-lg font-semibold text-gray-800 mb-3">📋 Installation Steps:</h4>
                    <ol class="list-decimal list-inside space-y-3 text-gray-700">
                        <li class="flex items-start">
                            <span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center justify-center mr-3 mt-0.5 font-bold">1</span>
                            <div>
                                <strong>Download Complete:</strong> The updated <code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">game-data.js</code> file has been downloaded to your computer
                            </div>
                        </li>
                        <li class="flex items-start">
                            <span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center justify-center mr-3 mt-0.5 font-bold">2</span>
                            <div>
                                <strong>Backup Original:</strong> Make a backup copy of your current <code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">PlayArcade/games/game-data.js</code> file
                            </div>
                        </li>
                        <li class="flex items-start">
                            <span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center justify-center mr-3 mt-0.5 font-bold">3</span>
                            <div>
                                <strong>Replace File:</strong> Replace the original file with the newly downloaded version
                            </div>
                        </li>
                        <li class="flex items-start">
                            <span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center justify-center mr-3 mt-0.5 font-bold">4</span>
                            <div>
                                <strong>Refresh Website:</strong> Clear your browser cache and refresh your website to see the new games
                            </div>
                        </li>
                    </ol>
                </div>
                
                <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                    <div class="flex items-start">
                        <i class="fas fa-exclamation-triangle text-amber-600 mr-2 mt-0.5"></i>
                        <div>
                            <p class="text-amber-800 font-semibold mb-1">Important Reminder:</p>
                            <p class="text-amber-700 text-sm">This is a client-side solution. For production websites, consider implementing a proper backend API to handle game data persistence automatically.</p>
                        </div>
                    </div>
                </div>
                
                <div class="grid grid-cols-3 gap-4 text-center">
                    <div class="bg-gray-50 rounded-lg p-4">
                        <div class="text-2xl font-bold text-gray-800">${games.length}</div>
                        <div class="text-sm text-gray-600">Total Games</div>
                    </div>
                    <div class="bg-green-50 rounded-lg p-4">
                        <div class="text-2xl font-bold text-green-800">+${gameCount}</div>
                        <div class="text-sm text-green-600">Just Added</div>
                    </div>
                    <div class="bg-blue-50 rounded-lg p-4">
                        <div class="text-2xl font-bold text-blue-800">${gameCategories.length}</div>
                        <div class="text-sm text-blue-600">Categories</div>
                    </div>
                </div>
            </div>
            
            <div class="p-6 border-t border-gray-200 flex justify-between">
                <button onclick="this.closest('.fixed').remove()" class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center">
                    <i class="fas fa-times mr-2"></i>
                    Close
                </button>
                <div class="space-x-3">
                    <button onclick="location.reload()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center">
                        <i class="fas fa-plus mr-2"></i>
                        Add More Games
                    </button>
                    <button onclick="window.open('index.html', '_blank')" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center">
                        <i class="fas fa-home mr-2"></i>
                        View Website
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Show processing results
function showResults(processedGames) {
    const resultsSection = document.getElementById('resultsSection');
    const resultsContent = document.getElementById('resultsContent');
    
    if (!resultsSection || !resultsContent) return;
    
    const successCount = processedGames.length;
    const totalOriginal = games.length - processedGames.length;
    
    resultsContent.innerHTML = `
        <div class="text-center mb-8">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-check text-green-600 text-3xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">Successfully Added ${successCount} Games!</h3>
            <p class="text-gray-600">Your games have been processed and added to the PlayArcade database.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <div class="text-3xl font-bold text-blue-600 mb-2">${successCount}</div>
                <div class="text-blue-700 font-semibold">Games Added</div>
            </div>
            <div class="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div class="text-3xl font-bold text-green-600 mb-2">${games.length}</div>
                <div class="text-green-700 font-semibold">Total Games</div>
            </div>
            <div class="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
                <div class="text-3xl font-bold text-purple-600 mb-2">${new Set(games.flatMap(g => g.categories)).size}</div>
                <div class="text-purple-700 font-semibold">Categories</div>
            </div>
        </div>
        
        <div class="mb-8">
            <h4 class="text-lg font-semibold text-gray-800 mb-4">Recently Added Games:</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                ${processedGames.slice(0, 6).map(game => `
                    <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div class="flex items-center space-x-3">
                            <img src="${game.image}" alt="${game.title}" 
                                 class="w-12 h-12 rounded object-cover"
                                 onerror="this.src='https://via.placeholder.com/48x48/6b7280/ffffff?text=🎮'">
                            <div class="flex-1 min-w-0">
                                <h5 class="font-medium text-gray-800 truncate">${game.title}</h5>
                                <p class="text-sm text-gray-500">${gameCategories.find(cat => cat.id === game.categories[0])?.name || 'Game'}</p>
                            </div>
                            <div class="flex items-center space-x-1 text-sm text-gray-500">
                                <i class="fas fa-star text-yellow-400"></i>
                                <span>${game.rating}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="flex justify-center space-x-4">
            <a href="index.html" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                <i class="fas fa-home mr-2"></i>
                View Homepage
            </a>
            <a href="category.html" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                <i class="fas fa-th-large mr-2"></i>
                Browse All Games
            </a>
            <button onclick="location.reload()" class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                <i class="fas fa-plus mr-2"></i>
                Add More Games
            </button>
        </div>
    `;
    
    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// ================== IMAGE PLACEHOLDER FUNCTIONALITY ==================

// Show image placeholder modal
function showImagePlaceholderModal(category = 'default') {
    const modal = document.getElementById('imagePlaceholderModal');
    const optionsContainer = document.getElementById('placeholderOptions');
    
    if (!modal || !optionsContainer) return;
    
    // Load placeholder options
    const categoryImages = placeholderImages[category] || placeholderImages['default'];
    const allImages = [...categoryImages, ...placeholderImages['default']];
    
    optionsContainer.innerHTML = allImages.map((imageUrl, index) => `
        <div class="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-400 transition-colors"
             onclick="selectPlaceholder('${imageUrl}', this)">
            <img src="${imageUrl}" alt="Placeholder ${index + 1}" 
                 class="w-full h-24 object-cover rounded mb-2">
            <p class="text-sm text-gray-600 text-center">Option ${index + 1}</p>
        </div>
    `).join('');
    
    modal.classList.remove('hidden');
}

// Select placeholder image
function selectPlaceholder(imageUrl, element) {
    // Remove previous selections
    document.querySelectorAll('#placeholderOptions > div').forEach(div => {
        div.classList.remove('border-blue-500', 'bg-blue-50');
    });
    
    // Highlight selected option
    element.classList.add('border-blue-500', 'bg-blue-50');
    selectedPlaceholderImage = imageUrl;
}

// Use selected placeholder
function useSelectedPlaceholder() {
    if (!selectedPlaceholderImage) {
        alert('Please select a placeholder image first!');
        return;
    }
    
    // This would be used when processing games without images
    console.log('Selected placeholder image:', selectedPlaceholderImage);
    closeImageModal();
}

// Close image modal
function closeImageModal() {
    const modal = document.getElementById('imagePlaceholderModal');
    if (modal) {
        modal.classList.add('hidden');
    }
    selectedPlaceholderImage = '';
}

// Show added games in the UI
function showAddedGames(newGames) {
    const addedGamesSection = document.getElementById('addedGamesSection');
    const addedGamesList = document.getElementById('addedGamesList');
    const addedGamesCount = document.getElementById('addedGamesCount');
    
    // Update count
    addedGamesCount.textContent = newGames.length;
    
    // Clear previous games
    addedGamesList.innerHTML = '';
    
    // Add each game card
    newGames.forEach(game => {
        const gameCard = createGameCard(game);
        addedGamesList.appendChild(gameCard);
    });
    
    // Show the section
    addedGamesSection.style.display = 'block';
    
    // Scroll to the section
    addedGamesSection.scrollIntoView({ behavior: 'smooth' });
    
    console.log('Successfully displayed', newGames.length, 'added games');
}

// Create a game card element
function createGameCard(game) {
    const gameCard = document.createElement('div');
    gameCard.className = 'bg-white rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-all duration-300 game-card-hover';
    
    gameCard.innerHTML = `
        <div class="flex items-center mb-3">
            <img src="${game.image}" alt="${game.title}" class="w-12 h-12 rounded-lg object-cover mr-3 border border-gray-200" onerror="this.src='https://via.placeholder.com/64x64/e5e7eb/6b7280?text=Game'">
            <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-800 truncate">${game.title}</h3>
                <div class="flex items-center text-sm text-gray-500">
                    <span class="flex items-center mr-3">
                        <i class="fas fa-star text-yellow-500 mr-1"></i>
                        ${game.rating}/5
                    </span>
                    <span class="flex items-center">
                        <i class="fas fa-clock text-gray-400 mr-1"></i>
                        ${game.playTime}
                    </span>
                </div>
            </div>
        </div>
        
        <p class="text-sm text-gray-600 mb-3 line-clamp-2">${game.shortDescription}</p>
        
        <div class="flex flex-wrap gap-1 mb-3">
            ${game.categories.map(cat => 
                `<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">${getCategoryName(cat)}</span>`
            ).join('')}
        </div>
        
        <div class="flex flex-wrap gap-1">
            ${game.tags.slice(0, 3).map(tag => 
                `<span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-medium">${tag}</span>`
            ).join('')}
            ${game.tags.length > 3 ? `<span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-medium">+${game.tags.length - 3} more</span>` : ''}
        </div>
        
        <div class="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
            <span class="font-mono">ID: ${game.id}</span>
            <span>${game.featured ? '<i class="fas fa-star text-yellow-500 mr-1"></i>Featured' : '<i class="fas fa-gamepad text-gray-400 mr-1"></i>Regular'}</span>
        </div>
    `;
    
    return gameCard;
}

// Get category name by ID
function getCategoryName(categoryId) {
    const categoryNames = {
        'puzzle': 'Puzzle',
        'action': 'Action',
        'racing': 'Racing',
        'casual': 'Casual',
        'adventure': 'Adventure',
        'sports': 'Sports',
        'dress-up': 'Dress Up'
    };
    return categoryNames[categoryId] || categoryId;
}

function downloadTemplate() {
    const csvContent = 'title,category,iframe,description,image\n' +
                      'Sample Game,puzzle,https://example.com/game,A fun puzzle game,https://example.com/image.jpg\n' +
                      'Action Adventure,action,https://example.com/action,An exciting action game,https://example.com/action.jpg';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'school-arcade-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
} 