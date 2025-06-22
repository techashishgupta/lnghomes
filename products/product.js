
const products = [
    {
        id: "faucets",
        title: "Dummy faucets",
        price: 13499,
        description: "Our premium ceramic wash basin combines elegance with durability. Made from high-quality ceramic material, this basin is resistant to stains and scratches while maintaining its glossy finish for years.",
        features: [
            "faucets description"
        ],
        images: [
            "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                ]
    },
    {
        id: "faucets2",
        title: "Test Dummy faucets",
        price: 5499,
        description: "Our premium ceramic wash basin combines elegance with durability. Made from high-quality ceramic material, this basin is resistant to stains and scratches while maintaining its glossy finish for years.",
        features: [
            "faucets description"
        ],
        images: [
            "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                ]
    }
];

// // Generate more products to reach 100
// for (let i = 6; i <= 100; i++) {
//     const baseProduct = products[i % 5]; // Cycle through the first 5 products as templates
//     products.push({
//         id: `CW-2023-${i.toString().padStart(3, '0')}`,
//         title: `Ceramic Wash Basin ${String.fromCharCode(64 + i)}`,
//         price: baseProduct.price + (Math.floor(Math.random() * 1000) - 500), // Randomize price ±500
//         description: baseProduct.description,
//         features: [...baseProduct.features],
//         images: [...baseProduct.images]
//     });
// }

// DOM elements
const productsGrid = document.getElementById('productsGrid');
const productDetails = document.getElementById('productDetails');
const backToProducts = document.getElementById('backToProducts');
const searchInput = document.getElementById('search');
const productIdFilter = document.getElementById('productId');
const minPriceInput = document.getElementById('minPrice');
const maxPriceInput = document.getElementById('maxPrice');
const resetFiltersBtn = document.getElementById('resetFilters');

// Details page elements
const mainImage = document.getElementById('mainImage');
const thumbnailContainer = document.getElementById('thumbnailContainer');
const detailProductTitle = document.getElementById('detailProductTitle');
const detailProductId = document.getElementById('detailProductId');
const detailProductPrice = document.getElementById('detailProductPrice');
const detailProductDesc = document.getElementById('detailProductDesc');
const detailProductFeatures = document.getElementById('detailProductFeatures');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    populateProductIdFilter();
    setupEventListeners();
});

// Render products to the grid
function renderProducts(productsToRender) {
    productsGrid.innerHTML = '';

    if (productsToRender.length === 0) {
        productsGrid.innerHTML = '<div class="no-results">No products match your filters. Please try different criteria.</div>';
        return;
    }


//     <div class="product-actions">
//     <button class="btn view-details" data-product-id="${product.id}">View Details</button>
// </div>
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.images[0]}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-id">Product Category: ${product.id}</div>
                <div class="product-price">₹${product.price.toLocaleString()}</div>
                <p class="product-description">${product.description}</p>
               
            </div>
        `;
        productsGrid.appendChild(productCard);
    });

    // Add event listeners to view details buttons
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', () => viewProductDetails(button.dataset.productId));
    });
}

// Populate the product ID filter dropdown
function populateProductIdFilter() {
    // Get all unique IDs using Set and spread operator
    const uniqueIds = [...new Set(products.map(product => product.id))];
    
    // Clear existing options
    productIdFilter.innerHTML = '';
    
    // Add default option
    productIdFilter.innerHTML = '<option value="">Select Product ID</option>';
    
    // Add unique IDs
    uniqueIds.forEach(id => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = id;
        productIdFilter.appendChild(option);
    });
}

// View product details
function viewProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Update details page
    mainImage.src = product.images[0];
    mainImage.alt = product.title;
    
    // Clear and repopulate thumbnails
    thumbnailContainer.innerHTML = '';
    product.images.forEach((image, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = image;
        thumbnail.alt = `Thumbnail ${index + 1}`;
        thumbnail.className = 'thumbnail';
        thumbnail.addEventListener('click', () => {
            mainImage.src = image;
        });
        thumbnailContainer.appendChild(thumbnail);
    });

    detailProductTitle.textContent = product.title;
    detailProductId.textContent = `Product ID: ${product.id}`;
    detailProductPrice.textContent = `₹${product.price.toLocaleString()}`;
    detailProductDesc.textContent = product.description;

    // Clear and repopulate features
    detailProductFeatures.innerHTML = '';
    product.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        detailProductFeatures.appendChild(li);
    });

    // Show details and hide grid
    document.getElementById('products').style.display = 'none';
    productDetails.style.display = 'block';

    // Scroll to top
    window.scrollTo(0, 0);
}

// Back to products
backToProducts.addEventListener('click', () => {
    productDetails.style.display = 'none';
    document.getElementById('products').style.display = 'block';
});

// Filter products based on criteria
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedProductId = productIdFilter.value;
    const minPrice = minPriceInput.value ? parseInt(minPriceInput.value) : 0;
    const maxPrice = maxPriceInput.value ? parseInt(maxPriceInput.value) : Infinity;

    const filtered = products.filter(product => {
        // Search term filter
        const matchesSearch = product.title.toLowerCase().includes(searchTerm) || 
                              product.description.toLowerCase().includes(searchTerm);

        // Product ID filter
        const matchesId = selectedProductId ? product.id === selectedProductId : true;

        // Price range filter
        const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

        return matchesSearch && matchesId && matchesPrice;
    });

    renderProducts(filtered);
}

// Reset all filters
function resetFilters() {
    searchInput.value = '';
    productIdFilter.value = '';
    minPriceInput.value = '';
    maxPriceInput.value = '';
    filterProducts();
}

// Set up event listeners
function setupEventListeners() {
    searchInput.addEventListener('input', filterProducts);
    productIdFilter.addEventListener('change', filterProducts);
    minPriceInput.addEventListener('input', filterProducts);
    maxPriceInput.addEventListener('input', filterProducts);
    resetFiltersBtn.addEventListener('click', resetFilters);
}

// Change main image when thumbnail is clicked
function changeImage(src) {
    mainImage.src = src;
}

 

function toggleFilter() {
    const filterSection = document.getElementById('filterSection');
    if (filterSection.style.display === 'none' || filterSection.style.display === '') {
        filterSection.style.display = 'flex';
    } else {
        filterSection.style.display = 'none';
    }
}