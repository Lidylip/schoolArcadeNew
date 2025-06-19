// 获取URL参数中的游戏ID
function getGameId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// 加载游戏数据
async function loadGameData() {
    try {
        const response = await fetch('/js/game-data.json');
        const data = await response.json();
        const gameId = getGameId();
        const game = data.games.find(g => g.id === gameId);
        
        if (!game) {
            console.error('Game not found');
            return;
        }

        // 更新页面标题
        document.title = `${game.title} - School Arcade`;
        document.getElementById('gameTitle').textContent = `${game.title} - School Arcade`;
        document.getElementById('gameMainTitle').textContent = game.title;
        
        // 更新游戏描述
        document.getElementById('gameDescription').content = game.shortDescription;
        document.getElementById('gameShortDescription').textContent = game.shortDescription;
        document.getElementById('gameFullDescription').innerHTML = game.fullDescription;
        
        // 更新游戏统计
        document.getElementById('gameRating').textContent = game.rating;
        document.getElementById('gameRatingDetail').textContent = `${game.rating} out of 5`;
        document.getElementById('gamePlays').textContent = game.plays.toLocaleString();
        
        // 更新游戏标签
        const tagsContainer = document.getElementById('gameTagsContainer');
        game.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800';
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });
        
        // 更新侧边栏标签
        const tagsSidebar = document.getElementById('gameTagsSidebar');
        game.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800';
            tagElement.textContent = tag;
            tagsSidebar.appendChild(tagElement);
        });
        
        // 更新游戏分类
        const categoriesContainer = document.getElementById('gameCategoriesContainer');
        game.categories.forEach(categoryId => {
            const category = data.gameCategories.find(c => c.id === categoryId);
            if (category) {
                const categoryElement = document.createElement('span');
                categoryElement.className = 'px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800';
                categoryElement.textContent = `${category.icon} ${category.name}`;
                categoriesContainer.appendChild(categoryElement);
            }
        });
        
        // 更新面包屑
        const category = data.gameCategories.find(c => c.id === game.categories[0]);
        if (category) {
            document.getElementById('breadcrumbCategory').textContent = category.name;
            document.getElementById('breadcrumbCategory').href = `category.html?cat=${category.id}`;
        }
        document.getElementById('breadcrumbGame').textContent = game.title;
        
        // 设置游戏iframe
        const gameFrame = document.getElementById('gameFrame');
        gameFrame.src = game.iframe;
        
        // 设置全屏按钮事件
        document.getElementById('fullscreenBtn').addEventListener('click', () => {
            const gameContainer = document.getElementById('gameContainer');
            if (gameContainer.requestFullscreen) {
                gameContainer.requestFullscreen();
            } else if (gameContainer.webkitRequestFullscreen) {
                gameContainer.webkitRequestFullscreen();
            } else if (gameContainer.msRequestFullscreen) {
                gameContainer.msRequestFullscreen();
            }
        });
        
    } catch (error) {
        console.error('Error loading game data:', error);
        document.getElementById('gameMainTitle').textContent = 'Error loading game';
        document.getElementById('gameShortDescription').textContent = 'There was an error loading the game. Please try again later.';
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadGameData); 