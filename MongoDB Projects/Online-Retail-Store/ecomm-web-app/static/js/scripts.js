$(document).ready(function () {
    // Initialize filters and set up event listeners for filter changes
    initializeFilters();

    // Event listener for filter form submission
    $('#filters').submit(function (event) {
        event.preventDefault(); // Prevent default form submission
        loadProducts(1); // Load products with filters applied, starting from page 1
    });

    // Event listener for search input changes to handle autocomplete
    $('#search').on('input', debounce(handleAutocomplete, 300));

    // Event delegation for click events on autocomplete suggestions
    $(document).on('click', '.autocomplete-suggestion', function () {
        const name = $(this).data('name');
        $('#search').val(name);
        $('#autocomplete-suggestions').hide();
        loadProducts(1); // Load products based on the selected suggestion
    });

    // Event listener to hide autocomplete suggestions when clicking outside
    $(document).click(function (event) {
        if (!$(event.target).closest('#search, #autocomplete-suggestions').length) {
            $('#autocomplete-suggestions').hide();
        }
    });

    // Event delegation for pagination link clicks
    $(document).on('click', '.page-link', function (e) {
        e.preventDefault();
        const page = parseInt($(this).data('page'));
        loadProducts(page); // Load products for the selected page
    });

    // Event delegation for product card clicks
    $(document).on('click', '.product-card', function () {
        const productId = $(this).data('id');
        loadProductDetails(productId); // Load details for the selected product
    });

    // Event delegation for thumbnail product clicks
    $(document).on('click', '.thumbnail-product', function () {
        const productId = $(this).data('id');
        loadProductDetails(productId); // Load details for the selected product from thumbnails
    });

    // Event listener for "Back to Products" button click
    $('#back-to-products').click(function () {
        $('#product-details').hide();
        $('#products').show();
        $('#products-title').show(); // Show the Products title
        $('#pagination').show(); // Show pagination controls
        $('#talk-to-fashionbot').hide(); // Hide FashionBot button
        window.scrollTo(0, 0); // Scroll to top
    });

    // Event listener for "Talk to FashionBot" button click
    $('#talk-to-fashionbot').click(function () {
        $('#fashionbot-chat').toggle(); // Toggle visibility of FashionBot chat
        adjustChatWindowHeight(); // Adjust chat window height initially
    });

    // Event listener for sending chat messages
    $('#send-chat').click(function () {
        const question = $('#chat-input').val();
        if (question) {
            sendChatMessage(question); // Send the chat message to FashionBot
            $('#chat-input').val('');
        }
    });

    // Initial load of products
    loadProducts(1);
});

// Debounce function to limit the rate at which a function can fire
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Data for categories and brands
const categories = {
    'Women': {
        'Clothing': ['Dresses', 'T-shirts & tops', 'Trousers', 'Jeans', 'Shirts & Blouses', 'Jackets & Blazers', 'Sweatshirts & Hoodies', 'Skirts', 'Coats'],
        'Shoes': ['Sneakers', 'Sandals', 'Pumps', 'High heels', 'Flat shoes', 'Mules', 'Ankle boots', 'Ballerinas', 'Boots', 'Sports shoes', 'Beach shoes', 'Bridal shoes', 'House Shoes', 'Outdoor shoes'],
        'Accessories': ['Bags & cases', 'Jewellery', 'Sunglasses', 'Hats & headscarves', 'Belts', 'Watches', 'Wallets & card holders', 'Scarves', 'Blue-light glasses', 'Gloves', 'Umbrellas']
    },
    'Men': {
        'Clothing': ['T-shirts & Polos', 'Shirts', 'Sweatshirts & Hoodies', 'Trousers', 'Jeans', 'Shorts', 'Jackets', 'Suits & Tailoring', 'Coats'],
        'Shoes': ['Sneakers', 'Open shoes', 'Lace-up shoes', 'Loafers', 'Business shoes', 'Boots', 'Sports shoes', 'Outdoor shoes', 'Slippers'],
        'Accessories': ['Bags & cases', 'Jewellery', 'Sunglasses', 'Hats & headscarves', 'Belts', 'Watches', 'Wallets & card holders', 'Scarves', 'Blue-light glasses', 'Gloves', 'Umbrellas']
    }
};

const brands = {
    'Men': ['Carhartt', 'Polo Ralph Lauren', 'Armani', 'Calvin Klein', 'Diesel', 'G-Star', 'GAP', 'Helly Hansen', 'Hugo Boss', 'Lacoste', 'Levi\'s', 'Ted Baker', 'The North Face', 'Timberland', 'Tommy Hilfiger'],
    'Women': ['Anna Field', 'Levi\'s®', 'The North Face', 'Hoka', 'Rapha', 'Ciele', 'Polo Ralph Lauren', 'ARKET', 'Missoni', 'Proenza Schouler', 'The Kooples', 'MM6 Maison Margiela']
};

const designer_brands = {
    'Men': ['Dolce&Gabbana', 'Mont Blanc', 'Paul Smith', 'Prada', 'rag & bone', 'Versace', 'Vivienne Westwood'],
    'Women': ['Alexander McQueen', 'Gucci', 'Loren Stewart', 'Victoria Beckham', 'Vivienne Westwood']
};

// Initialize filters by setting up event listeners for filter changes
function initializeFilters() {
    $('#gender').change(function () {
        const gender = $(this).val();
        updateCategoryAndBrandOptions(gender); // Update category and brand options based on selected gender
    });

    $('#main-category').change(function () {
        const gender = $('#gender').val();
        const mainCat = $(this).val();
        updateSubCategoryOptions(gender, mainCat); // Update sub-category options based on selected main category
    });
}

// Update category and brand options based on the selected gender
function updateCategoryAndBrandOptions(gender) {
    $('#main-category').empty().append('<option value="">All</option>');
    $('#sub-category').empty().append('<option value="">All</option>');
    $('#brand').empty().append('<option value="">All</option>');

    if (gender && categories[gender]) {
        for (const mainCat in categories[gender]) {
            $('#main-category').append(`<option value="${mainCat}">${mainCat}</option>`);
        }

        const allBrands = brands[gender].concat(designer_brands[gender]);
        allBrands.forEach(brand => {
            $('#brand').append(`<option value="${brand}">${brand}</option>`);
        });
    }
}

// Update sub-category options based on the selected main category
function updateSubCategoryOptions(gender, mainCat) {
    $('#sub-category').empty().append('<option value="">All</option>');

    if (gender && mainCat && categories[gender] && categories[gender][mainCat]) {
        categories[gender][mainCat].forEach(subCat => {
            $('#sub-category').append(`<option value="${subCat}">${subCat}</option>`);
        });
    }
}

// Handle autocomplete suggestions for the search input
function handleAutocomplete() {
    const query = $('#search').val();
    if (query.length > 1) {
        $.ajax({
            url: '/autocomplete',
            data: { q: query },
            success: function (data) {
                $('#autocomplete-suggestions').empty();
                data.forEach(function (item) {
                    $('#autocomplete-suggestions').append(`
                        <li class="autocomplete-suggestion" data-id="${item.id}" data-name="${item.name}">
                            ${item.name}
                        </li>
                    `);
                });
                $('#autocomplete-suggestions').show();
            },
            error: function (xhr, status, error) {
                const message = xhr.responseJSON && xhr.responseJSON.error ? xhr.responseJSON.error : 'An unexpected error occurred. Please try again later.';
                showError(message);
            }
        });
    } else {
        $('#autocomplete-suggestions').hide();
    }
}

// Load products based on filters and pagination
function loadProducts(page) {
    let search = $('#search').val();
    let mainCategory = $('#main-category').val();
    let subCategory = $('#sub-category').val();
    let gender = $('#gender').val();
    let brand = $('#brand').val();

    showLoadingSpinner(true); // Show loading spinner

    $.ajax({
        url: '/products',
        data: {
            q: search,
            category: mainCategory,
            sub_category: subCategory,
            gender: gender,
            brand: brand,
            page: page
        },
        success: function (data) {
            renderProducts(data.products); // Render the products
            setupPagination(data.current_page, data.total_pages); // Setup pagination
            showLoadingSpinner(false); // Hide loading spinner
            window.scrollTo(0, 0); // Scroll to top
        },
        error: function (xhr, status, error) {
            showLoadingSpinner(false); // Hide loading spinner
            const message = xhr.responseJSON && xhr.responseJSON.error ? xhr.responseJSON.error : 'An unexpected error occurred. Please try again later.';
            showError(message);
        }
    });
}

// Render products on the page
function renderProducts(products) {
    $('#products').empty();
    $('#product-details').hide();
    $('#products').show();
    if (products.length === 0) {
        $('#products').append('<p>No products found.</p>');
    } else {
        products.forEach(function (product) {
            $('#products').append(`
                <div class="col-md-4">
                    <div class="card mb-4 shadow-sm product-card" data-id="${product._id}">
                        <img src="${product.images[0]}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="card-text"><strong>€${product.price}</strong></p>
                            <p class="card-text">Score: ${product.score ? product.score.toFixed(2) : 'N/A'}</p>
                            <p class="card-text">Sponsored: ${product.sponsored ? 'Yes' : 'No'}</p>
                        </div>
                    </div>
                </div>
            `);
        });
    }
}

// Setup pagination based on current page and total pages
function setupPagination(currentPage, totalPages) {
    $('#pagination').empty();
    if (totalPages > 1) {
        if (currentPage > 1) {
            $('#pagination').append(`
                <li class="page-item">
                    <a class="page-link" href="#" data-page="1">First</a>
                </li>
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
                </li>
            `);
        }

        if (currentPage < totalPages) {
            $('#pagination').append(`
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
                </li>
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${totalPages}">Last</a>
                </li>
            `);
        }
    }
}

// Load product details based on product ID
function loadProductDetails(productId) {
    showLoadingSpinner(true); // Show loading spinner

    $.ajax({
        url: `/products/${productId}`,
        success: function (data) {
            $('#products').hide();
            $('#products-title').hide(); // Hide the Products title
            $('#pagination').hide(); // Hide pagination controls
            $('#product-details').data('product-id', data._id);
            $('#product-details-content').empty().append(`
                <img src="${data.images[0]}" class="img-fluid" alt="${data.name}">
                <h5>${data.name}</h5>
                <p><strong>Price:</strong> €${data.price}</p>
                <p><strong>Description:</strong> ${data.description}</p>
                <p><strong>Brand:</strong> ${data.brand}</p>
                <p><strong>Category:</strong> ${data.main_category} > ${data.sub_category}</p>
                <p><strong>Sizes:</strong> ${data.sizes.join(', ')}</p>
                <p><strong>Colors:</strong> ${data.colors.join(', ')}</p>
                <p><strong>Material:</strong> ${data.material}</p>
                <p><strong>Stock:</strong> ${data.stock}</p>
                <p><strong>Availability:</strong> ${data.availability}</p>
                <p><strong>Rating:</strong> ${data.rating}</p>
                <p><strong>Reviews:</strong></p>
                <ul>
                    ${data.reviews.map(review => `<li>${review.author}: ${review.comment} (${review.rating} stars)</li>`).join('')}
                </ul>
                <p><strong>Created At:</strong> ${new Date(data.created_at).toLocaleString()}</p>
                <p><strong>Updated At:</strong> ${new Date(data.updated_at).toLocaleString()}</p>
                <p><strong>On Sale:</strong> ${data.on_sale}</p>
                <p><strong>Pre-Owned:</strong> ${data.pre_owned}</p>
                <p><strong>Condition:</strong> ${data.condition}</p>
                <p><strong>Sponsored:</strong> ${data.sponsored}</p>
                <p><strong>New In:</strong> ${data.new_in}</p>
            `);
            $('#product-details').show();
            $('#talk-to-fashionbot').show();  // Show the FashionBot button here
            loadRecommendations(productId);
            showLoadingSpinner(false); // Hide loading spinner
            window.scrollTo(0, 0); // Scroll to top
        },
        error: function (xhr, status, error) {
            showLoadingSpinner(false); // Hide loading spinner
            const message = xhr.responseJSON && xhr.responseJSON.error ? xhr.responseJSON.error : 'An unexpected error occurred. Please try again later.';
            showError(message);
        }
    });
}

// Load recommendations based on the selected product ID
function loadRecommendations(productId) {
    $.ajax({
        url: `/products/${productId}/recommendations`,
        success: function (data) {
            $('#recommendations-thumbnails').empty();
            if (data.length === 0) {
                $('#recommendations-thumbnails').append('<p>No recommendations found.</p>');
            } else {
                data.slice(0, 3).forEach((item) => {
                    $('#recommendations-thumbnails').append(`
                        <img src="${item.images[0]}" class="thumbnail-product" alt="${item.name}" data-id="${item._id}">
                    `);
                });
            }
        },
        error: function (xhr, status, error) {
            const message = xhr.responseJSON && xhr.responseJSON.error ? xhr.responseJSON.error : 'An unexpected error occurred. Please try again later.';
            showError(message);
        }
    });
}

// Send chat message to FashionBot
function sendChatMessage(question) {
    const productId = $('#product-details').data('product-id');
    $('#chat-messages').append(`<div class="message-bubble user-message"><strong>You:</strong> ${escapeHtml(question)}</div>`);
    scrollToLatestMessage();
    showLoadingIndicator(true);
    $.ajax({
        url: `/fashionbot`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ product_id: productId, question: question }),
        success: function (response) {
            const formattedAnswer = formatChatMessage(response.answer);
            $('#chat-messages').append(`<div class="message-bubble bot-message"><strong>FashionBot:</strong> ${formattedAnswer}</div>`);
            displayChatRecommendations(response.recommendations);
            showLoadingIndicator(false);
            scrollToLatestMessage();
        },
        error: function (xhr, status, error) {
            showLoadingIndicator(false);
            const message = xhr.responseJSON && xhr.responseJSON.error ? xhr.responseJSON.error : 'An unexpected error occurred. Please try again later.';
            showError(message);
            $('#chat-messages').append('<div class="message-bubble bot-message"><strong>FashionBot:</strong> Sorry, something went wrong. Please try again later.</div>');
            scrollToLatestMessage();
        }
    });
}

// Function to move the chat window to the latest message.
function scrollToLatestMessage() {
    const chatContainer = $('#chat-messages');
    chatContainer.scrollTop(chatContainer.prop("scrollHeight"));
}

// Function to escape HTML to prevent XSS attacks
function escapeHtml(text) {
    return text.replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}

// Function to format chat messages with HTML content
function formatChatMessage(text) {
    // Replace newlines with <br>
    text = text.replace(/\n/g, '<br>');
    
    // Handle markdown-like list items
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold text
    text = text.replace(/1\.\s(.*?)\n/g, '<li>$1</li>'); // List items starting with numbers
    
    // Wrap list items with <ul> tag
    text = '<ul>' + text + '</ul>';
    
    return text;
}

// Entity map for escaping HTML
const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
};

// Display chat recommendations based on FashionBot's response
function displayChatRecommendations(recommendations) {
    $('#chat-recommendations').empty();
    recommendations.forEach(function (item) {
        $('#chat-recommendations').append(`
            <img src="${item.images[0]}" class="thumbnail-product" alt="${item.name}" data-id="${item._id}">
        `);
    });
    adjustChatWindowHeight(); // Adjust chat window height after recommendations are added
}

// Adjust the chat window height
function adjustChatWindowHeight() {
    const chatContainer = $('#fashionbot-chat');
    const newHeight = 500; // Fixed height
    chatContainer.css('max-height', `${newHeight}px`);
    chatContainer.css('height', `${newHeight}px`);
}

// Show or hide the loading indicator
function showLoadingIndicator(show) {
    if (show) {
        $('.loading-indicator').show();
    } else {
        $('.loading-indicator').hide();
    }
}

// Show or hide the loading spinner
function showLoadingSpinner(show) {
    if (show) {
        $('#loading-spinner').show();
    } else {
        $('#loading-spinner').hide();
    }
}

// Show an error message and hide it after a few seconds
function showError(message) {
    $('#error-message').text(message).show();
    setTimeout(function () {
        $('#error-message').hide();
    }, 5000);
}