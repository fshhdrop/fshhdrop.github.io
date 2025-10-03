document.addEventListener('DOMContentLoaded', () => {
    const fishListContainer = document.getElementById('fish-list');
    const searchInput = document.getElementById('searchInput');
    const rarityFilter = document.getElementById('rarityFilter');
    let allFishData = []; // To store the fetched fish data

    // Function to set rarity color for the text
    const getRarityColor = (rarity) => {
        const colors = {
            'Trash': '#9ca3af',
            'Common': '#9ca3af',
            'Uncommon': '#22c55e',
            'Rare': '#3b82f6',
            'Epic': '#a855f7',
            'Legendary': '#f97316',
            'Mythic': '#ef4444'
        };
        return colors[rarity] || '#333';
    };

    // Function to display fish data on the page
    const displayFish = (fishData) => {
        fishListContainer.innerHTML = ''; // Clear loader or previous content
        if (fishData.length === 0) {
            fishListContainer.innerHTML = '<p class="loader">No fish matching the criteria.</p>';
            return;
        }

        fishData.forEach(fish => {
            const card = document.createElement('div');
            card.className = 'fish-card';
            card.setAttribute('data-rarity', fish.rarity);

            card.innerHTML = `
                <div class="fish-image-container">
                    <img src="${fish.image_url}" alt="${fish.name}" loading="lazy">
                </div>
                <div class="fish-info">
                    <h3 class="fish-name">${fish.name}</h3>
                    <div class="fish-details">
                        <div class="fish-rarity" style="color: ${getRarityColor(fish.rarity)};">
                            ${fish.rarity}
                            <span>Rarity</span>
                        </div>
                        <div class="fish-price">
                            ${fish.price} $FSHH
                            <span>Price</span>
                        </div>
                    </div>
                </div>
            `;
            fishListContainer.appendChild(card);
        });
    };
    
    // Function to filter and search fish
    const filterAndSearch = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedRarity = rarityFilter.value;

        const filteredFish = allFishData.filter(fish => {
            const matchesSearch = fish.name.toLowerCase().includes(searchTerm);
            const matchesRarity = (selectedRarity === 'all') || (fish.rarity === selectedRarity);
            return matchesSearch && matchesRarity;
        });

        displayFish(filteredFish);
    };

    // Fetch fish data from the JSON file
    fetch('fish_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            allFishData = data; // Save data globally
            displayFish(allFishData); // Initial display
            
            // Add event listeners for controls
            searchInput.addEventListener('input', filterAndSearch);
            rarityFilter.addEventListener('change', filterAndSearch);
        })
        .catch(error => {
            console.error('Error fetching fish data:', error);
            fishListContainer.innerHTML = '<p class="loader">Failed to load fish data. Please try again later.</p>';
        });
});
