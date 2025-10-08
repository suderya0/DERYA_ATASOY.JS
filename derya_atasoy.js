//Homepage Check
if (!(!location.pathname || location.pathname === "/")) {
    console.log("wrong page");
} 

// Get Products
function getProducts() {
    const cachedProducts = localStorage.getItem("cachedProducts");
    const cacheTimestamp = localStorage.getItem("cacheTimestamp");
    const now = Date.now(); 
    const oneHour = 60 * 60 * 1000;

    if (cachedProducts && cacheTimestamp && now - parseInt(cacheTimestamp) < oneHour) {
        return Promise.resolve(JSON.parse(cachedProducts));
    } else {
        return fetch(
            "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json"
        )
        .then((response) => response.json())
        .then((data) => {
            localStorage.setItem("cachedProducts", JSON.stringify(data));
            localStorage.setItem("cacheTimestamp", now.toString());
            return data;
        });
    }
}

// Price format function
function formatPrice(price) {
    const parts = price.toString().split(".");
    const wholePart = parts[0];
    const decimalPart = parts[1] ? `,${parts[1]}` : ",00";
    return { wholePart, decimalPart };
}

// User Interface Design
const buildUI = (products) => {
    const container = document.createElement("div");
    container.id = "product-container";
    container.innerHTML = `
        <h2 style="margin-bottom: 10px; margin-left:10px; justify-content: left;">Sizin için Seçtiklerimiz</h2>
        <div id="product-list-wrapper" style="margin-left: 10px; margin-right: 10px;">
            <ul id="product-list"></ul>
        </div>
            
        <button aria-label="back" class="scroll-prev">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
        </button>

        <button aria-label="next" class="scroll-next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
        </button>
    `;

    const bannerDiv = document.querySelector("main eb-product-carousel .banner");

    if (bannerDiv) {
        const parent = bannerDiv.parentNode;
        parent.replaceChild(container, bannerDiv);
    } else {
        document.body.appendChild(container);
    }

    // CSS Styles
    const style = document.createElement("style");
    style.textContent = `
        #product-list-wrapper { position: relative; }
        #product-list {
        font-family: 'Quicksand', sans-serif;
        display: flex;
        margin-left: 6px;
        margin-right: 6px;
        gap: 3px;
        scroll-behavior: smooth;
        padding: 5px 0;
        -ms-overflow-style: none;
        scrollbar-width: none;
        overflow-x: auto;
        
        }
        #product-list::-webkit-scrollbar { display: none; }

        .brand {
        font-weight: bold;
        font-family: 'Quicksand', sans-serif;
        }
        #product-container {
        max-width: 1380px;
        font-family: 'Quicksand', sans-serif;
        position: relative;
        margin: 1rem auto;
        padding: 1rem;
        }
        #product-list li {
        font-family: 'Quicksand', sans-serif;
        flex: 0 0 240px;
        display: flex;
        margin-left: 10px;
        margin-right: 10px;
        flex-direction: column;
        background-color: #fff;
        border-radius: 10px;
        border: 1px solid #6b6b6b2d;
        padding: 12px;
        cursor: pointer;
        position: relative;
        }

        #product-list li:hover {
        border-color: #828282db;
        }
        .product-info { 
        font-size: 12px; 
        font-family: 'Quicksand', sans-serif;
        }
        #product-list img {
        width: 100%;
        height: 240px;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 10px;
        }
        
        .price-container {
            margin-top: auto;
        }
        
        .original-price {
            font-size: 11px;
            color: #9ca3af;
            margin-bottom: 2px;
        }
        
        .discount-badge {
            background: #00a365;
            color: white;
            font-size: 11px;
            font-weight: bold;
            padding: 2px 6px;
            border-radius: 10px;
            display: inline-block;
            margin-right: 4px;      
             }
        
        .price {
        font-family: 'Quicksand', sans-serif;
        color: #212738;
        margin-bottom: 8px;
        display: flex;
        align-items: baseline;
        }
        .price-whole { font-size: 1.2em; font-weight: 550; }
        .price-decimal { font-size: 0.9em; font-weight: 40; }

        .price.has-discount {
            color: #00a365; 
        }

        .favorite-btn {
        border: none;
        color: white;
        background: white;
        position: absolute;
        top: 10px;
        right: 10px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 18px;
        transition: all 0.3s ease;
        -webkit-text-stroke: 1px #ccc;
        text-stroke: 1px #ccc;
        }
        .favorite-btn:hover {
        background: white;
        transform: scale(1.1);
        -webkit-text-stroke: 1px #ff9800;
        text-stroke: 1px #ff9800;
        }
        .favorite-btn.active {
        color: #ff9800;
        -webkit-text-stroke: 1px #ff9800;
        text-stroke: 1px #ff9800;
        }
        .favorite-btn.active:hover {
        color: #f57c00;
        -webkit-text-stroke: 1px #ff9800;
        text-stroke: 1px #ff9800;
        }

        .scroll-prev, .scroll-next {
        background: #fff;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        cursor: pointer;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        z-index: 10;
        }
        .scroll-prev:hover, .scroll-next:hover { background-color: #ffefcc; }
        .scroll-prev { left: -20px; }
        .scroll-next { right: -20px; }

        .add-to-cart {
        position: absolute;
        bottom: 10px;
        right: 10px;
        background: #fff;
        color: #1976d2;
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 20px;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .add-to-cart:hover {
        background: #1976d2;
        color: #fff;
        border: 2px solid #1976d2;
        }

        /* Responsive discount styles */
        @media (max-width: 1380px) { 
            #product-list li { flex: 0 0 220px;  } 
            #product-list img { height: 220px; } 
        }
        @media (max-width: 1200px) { 
            #product-list li { flex: 0 0 200px; } 
            #product-list img { height: 200px; } 
        }
        @media (max-width: 1024px) { 
            #product-list li { flex: 0 0 180px; } 
            #product-list img { height: 180px; } 
        }
        @media (max-width: 900px) { 
            #product-list li { flex: 0 0 160px; } 
            #product-list img { height: 160px; } 
        }
        @media (max-width: 768px) { 
            #product-list li { flex: 0 0 150px; min-width: 130px} 
            #product-list img { height: 150px; } 
            .original-price { font-size: 10px; }
            .discount-badge { font-size: 10px; padding: 1px 4px; }
        }
        @media (max-width: 600px) { 
            #product-list li { flex: 0 0 140px; min-width: 130px} 
            #product-list img { height: 140px; } 
        }
        @media (max-width: 480px) {
            #product-list li { min-width: 130px; flex: 0 0 130px; }
            #product-list img { height: 130px; }
            .price { font-size: 0.85em; }
            .brand { font-size: 0.8em; }
            .product-info { font-size: 0.75em; }
            .original-price { font-size: 9px; }
            .discount-badge { font-size: 9px; padding: 1px 3px; }
        }
    `;
    document.head.appendChild(style);

    // Get favorite product IDs from LocalStorage
    let favorites = JSON.parse(localStorage.getItem("productFavorites")) || [];

    function updateFavoriteCount() {
        const favoriteCount = document.getElementById("favorite-count");
        if (favoriteCount) {
            favoriteCount.textContent = favorites.length;
        }
    }

    // Add products to the list
    const list = document.getElementById("product-list");
    products.forEach((product) => {
        const li = document.createElement("li");

        const isFavorite = favorites.includes(String(product.id));
        const { wholePart, decimalPart } = formatPrice(product.price);

        // Check if there's a discount
        const hasDiscount = product.original_price && product.original_price !== product.price;
        let discountHTML = '';
        
        if (hasDiscount) {
            const { wholePart: originalWhole, decimalPart: originalDecimal } = formatPrice(product.original_price);
            const discount = Math.round(((product.original_price - product.price) / product.original_price) * 100);
            
            discountHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <span class="original-price">${originalWhole}${originalDecimal} TL</span>
                    <span class="discount-badge">%${discount}</span>
                </div>
            `;
        }

        li.innerHTML = `
            <button class="favorite-btn ${isFavorite ? "active" : ""}" data-product-id="${product.id}">♥</button>
            <img src="${product.img}" alt="${product.name}" />
            <span class="product-info">
                <span class="brand">${product.brand}</span> - <span>${product.name}</span>
            </span>
            <div class="price-container">
                ${discountHTML}
                <span class="price ${hasDiscount ? 'has-discount' : ''}">
                    <span class="price-whole">${wholePart}</span>
                    <span class="price-decimal">${decimalPart}</span>
                    <span>TL</span>
                </span>
            </div>
            <button class="add-to-cart" data-product-id="${product.id}">+</button>
        `;

        li.addEventListener("click", (e) => {
            if (!e.target.closest(".favorite-btn") && !e.target.closest(".add-to-cart")) {
                window.open(product.url, "_blank");
            }
        });

        list.appendChild(li);
    });

    // Favorite button click handling
    setTimeout(() => {
        const favoriteBtns = document.querySelectorAll(".favorite-btn");

        favoriteBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const productId = btn.getAttribute("data-product-id");
                toggleFavorite(productId, btn);
            });
        });

        function toggleFavorite(productId, button) {
            let favorites = JSON.parse(localStorage.getItem("productFavorites")) || [];

            if (favorites.includes(String(productId))) {
                favorites = favorites.filter((id) => id !== String(productId));
                button.classList.remove("active");
            } else {
                favorites.push(String(productId));
                button.classList.add("active");
            }

            localStorage.setItem("productFavorites", JSON.stringify(favorites));
            updateFavoriteCount();
        }

        updateFavoriteCount();
    }, 100);

    // Scroll button events
    setTimeout(() => {
        const prevBtn = document.querySelector(".scroll-prev");
        const nextBtn = document.querySelector(".scroll-next");
        const productList = document.getElementById("product-list");

        const scrollAmount = 260;
        prevBtn.addEventListener("click", () => {
            productList.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        });
        nextBtn.addEventListener("click", () => {
            productList.scrollBy({ left: scrollAmount, behavior: "smooth" });
        });
    }, 100);

};

// RUN
getProducts()
    .then((products) => {
        buildUI(products);
    })
    .catch((error) => console.error("Hata:", error));