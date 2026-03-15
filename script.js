const cartCount = document.getElementById('cart-count');
const wishlistCount = document.getElementById('wishlist-count');
const sidebar = document.getElementById('cart-sidebar');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

// Load data from LocalStorage or start empty
let cart = JSON.parse(localStorage.getItem('vaultCart')) || [];
let saved = JSON.parse(localStorage.getItem('vaultWishlist')) || [];

// 1. OPEN/CLOSE CART
function toggleCart() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

// Close via overlay
overlay.addEventListener('click', toggleCart);

// 2. PRODUCT DATA MAP (Matches your HTML IDs)
const productInfo = {
    jeans: { title: "True Religion 'Joey' Jeans", price: "119€", img: "https://images1.vinted.net/t/05_020fc_dx7GEawe9mgn4zsFtEXhfAYW/f800/1771499936.webp?s=199378153d9d8bf17c84dc2f824d4278d86e0fb3" },
    polo: { title: "Polo RL 'Los Angeles' Polo", price: "179€", img: "https://i.ebayimg.com/images/g/RSsAAOSwxC1mnr6A/s-l1200.jpg" },
    shoes: { title: "Maison Margiela 'GAT' Navy", price: "399€", img: "https://www.maisonmargiela.com/dw/image/v2/AAPK_PRD/on/demandware.static/-/Sites-margiela-master-catalog/default/dwe46c6f08/images/large/S57WS0236_P1895_T6065_D.jpg?sw=1024&q=80" },
    shirt: { title: "AMI PARIS 'HEART' TEE", price: "79€", img: "https://i.ibb.co/YTPs5k3P/IMG-9489.jpg" },
    navyhoodie: { title: "Polo Ralph Lauren Hoodie", price: "79€", img: "https://cdn.plick.es/item_image/yaxABJPzkYNLqDOvXGjz8p6543R2nKGrMZgmpoVb/w1125_q90.webp" },
    'shoes-heel': { title: "Maison Margiela 'GAT' Heel", price: "399€", img: "https://www.maisonmargiela.com/dw/image/v2/AAPK_PRD/on/demandware.static/-/Sites-margiela-master-catalog/default/dw357ce1f5/images/large/S57WS0236_P1895_T6065_R.jpg?sw=1024&q=80" }
};

// 3. ADD TO VAULT LOGIC
function quickAddToVault(id) {
    const item = productInfo[id];
    if (item) {
        cart.push(item);
        localStorage.setItem('vaultCart', JSON.stringify(cart));
        renderCart();
        showToast("Added to Vault");
    }
}

// 4. RENDER CART ITEMS
function renderCart() {
    if (!cartItemsContainer) return;

    cartCount.innerText = `(${cart.length})`;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; margin-top:40px; color:#888; font-size:11px; letter-spacing:1px;">VAULT IS EMPTY</p>';
        if(cartTotal) cartTotal.innerText = "0€";
        return;
    }

    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; padding:10px; border: 1px solid #f0f0f0;">
            <div style="display: flex; gap: 15px; align-items: center;">
                <img src="${item.img}" style="width: 50px; height: 50px; object-fit: cover;">
                <div>
                    <p style="margin:0; font-size:11px; text-transform:uppercase; font-weight:bold;">${item.title}</p>
                    <p style="margin:0; font-size:10px; color:#666;">${item.price}</p>
                </div>
            </div>
            <button onclick="removeFromCart(${index})" style="color:#ff4b4b; cursor:pointer; font-size:9px; border:none; background:none; font-weight:bold;">REMOVE</button>
        </div>
    `).join('');

    const total = cart.reduce((sum, p) => sum + (parseInt(p.price) || 0), 0);
    if(cartTotal) cartTotal.innerText = total + "€";
}

// 5. REMOVE & CLEAR
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('vaultCart', JSON.stringify(cart)); 
    renderCart();
}

function clearVault() {
    if (cart.length > 0 && confirm("Empty your vault?")) {
        cart = [];
        localStorage.setItem('vaultCart', JSON.stringify(cart));
        renderCart();
    }
}

// 6. WISHLIST LOGIC
function toggleWishlist(element, id) {
    if (saved.includes(id)) {
        saved = saved.filter(item => item !== id);
        element.classList.remove('liked');
    } else {
        saved.push(id);
        element.classList.add('liked');
        showToast("Saved to Archive");
    }
    localStorage.setItem('vaultWishlist', JSON.stringify(saved));
    updateWishlistUI();
}

function updateWishlistUI() {
    if(wishlistCount) wishlistCount.innerText = saved.length;
}

// 7. TOAST NOTIFICATION
function showToast(message) {
    const container = document.getElementById('toast-container');
    if(!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}

// 8. SCROLL HEADER EFFECT
window.addEventListener('scroll', function() {
    const header = document.getElementById('main-header');
    if (window.scrollY > 20) { 
        header.classList.add('header-minimized'); 
    } else { 
        header.classList.remove('header-minimized'); 
    }
});

// INITIALIZE ON LOAD
renderCart();
updateWishlistUI();
