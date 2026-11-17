const landingSection = document.getElementById('home');

const landingImages = [
    'images/landing1.png',
    'images/landing2.png',
    'images/landing3.png',
    'images/landing4.png',
    'images/landing5.png'
];

let currentImageIndex = 0;

function changeLandingBackground() {
    currentImageIndex = (currentImageIndex + 1) % landingImages.length;
    landingSection.style.backgroundImage = "url('" + landingImages[currentImageIndex] + "')";
}

setInterval(changeLandingBackground, 10000);

const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const categoriesDropdown = document.getElementById('categories-dropdown');
const categoriesToggle = document.getElementById('categories-toggle');
const allNavLinks = document.querySelectorAll('.nav-link, .dropdown-link');

menuToggle.addEventListener('click', function() {
    navMenu.classList.toggle('active');
});

categoriesToggle.addEventListener('click', function(event) {
    event.preventDefault();
    categoriesDropdown.classList.toggle('open');
});

allNavLinks.forEach(function(link) {
    if (link.id !== 'categories-toggle') {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            categoriesDropdown.classList.remove('open');
        });
    }
});

const moreButtons = document.querySelectorAll('.more-btn');

moreButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        const targetId = button.getAttribute('data-target');
        const targetGrid = document.getElementById(targetId);

        if (targetGrid) {
            targetGrid.classList.toggle('show');
            if (targetGrid.classList.contains('show')) {
                button.textContent = 'Show Less';
            } else {
                button.textContent = 'More';
            }
        }
    });
});

let cartItems = [];
const cartToggle = document.getElementById('cart-toggle');
const cartDropdown = document.getElementById('cart-dropdown');
const cartCountElement = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const productCards = document.querySelectorAll('.product-card');

cartToggle.addEventListener('click', function(event) {
    event.stopPropagation();
    cartDropdown.classList.toggle('open');
});

document.addEventListener('click', function(event) {
    if (!event.target.closest('.header-container')) {
        navMenu.classList.remove('active');
        categoriesDropdown.classList.remove('open');
    }
    if (!event.target.closest('#cart-wrapper')) {
        cartDropdown.classList.remove('open');
    }
});

function renderCart() {
    let totalCount = 0;
    let totalPrice = 0;

    cartItems.forEach(function(item) {
        totalCount += item.quantity;
        totalPrice += item.price * item.quantity;
    });

    cartCountElement.textContent = totalCount;
    cartTotalElement.textContent = totalPrice + ' LE';

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        return;
    }

    cartItemsContainer.innerHTML = '';

    cartItems.forEach(function(item) {
        const row = document.createElement('div');
        row.className = 'cart-item';

        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.title;
        img.className = 'cart-item-img';

        const info = document.createElement('div');
        info.className = 'cart-item-info';

        const title = document.createElement('p');
        title.className = 'cart-item-title';
        title.textContent = item.title + (item.quantity > 1 ? ' (x' + item.quantity + ')' : '');

        const price = document.createElement('p');
        price.className = 'cart-item-price';
        price.textContent = (item.price * item.quantity) + ' LE';

        info.appendChild(title);
        info.appendChild(price);
        row.appendChild(img);
        row.appendChild(info);

        cartItemsContainer.appendChild(row);
    });
}

productCards.forEach(function(card, index) {
    const productId = 'product-' + index;
    const titleText = card.querySelector('.product-title').textContent;
    const priceText = card.querySelector('.price').textContent;
    const priceValue = parseInt(priceText.replace(/[^0-9]/g, ''), 10);
    const imageSrc = card.querySelector('.product-img').getAttribute('src');
    const addBtn = card.querySelector('.add-btn');
    const deleteBtn = card.querySelector('.delete-btn');

    addBtn.addEventListener('click', function() {
        let existingItem = cartItems.find(function(item) {
            return item.id === productId;
        });

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({
                id: productId,
                title: titleText,
                price: priceValue,
                image: imageSrc,
                quantity: 1
            });
        }

        deleteBtn.classList.add('visible');
        addBtn.textContent = 'Added!';
        addBtn.style.backgroundColor = '#F6931E';

        setTimeout(function() {
            addBtn.textContent = 'Add to Cart';
            addBtn.style.backgroundColor = '';
        }, 800);

        renderCart();
    });

    deleteBtn.addEventListener('click', function() {
        cartItems = cartItems.filter(function(item) {
            return item.id !== productId;
        });

        deleteBtn.classList.remove('visible');
        renderCart();
    });
});

const continueShippingBtn = document.getElementById('continue-shipping-btn');
const shippingModal = document.getElementById('shipping-modal');
const closeShippingBtn = document.getElementById('close-shipping');
const shippingForm = document.getElementById('shipping-form');
const shippingStatus = document.getElementById('shipping-status');

continueShippingBtn.addEventListener('click', function() {
    if (cartItems.length === 0) {
        alert('Please add at least one product to your cart first.');
        return;
    }
    cartDropdown.classList.remove('open');
    shippingStatus.textContent = '';
    shippingModal.classList.add('open');
});

closeShippingBtn.addEventListener('click', function() {
    shippingModal.classList.remove('open');
});

shippingForm.addEventListener('submit', function(event) {
    event.preventDefault();
    shippingStatus.textContent = 'Order confirmed! Thank you for shopping with HomeCooking.';
    cartItems = [];
    document.querySelectorAll('.delete-btn').forEach(function(btn) {
        btn.classList.remove('visible');
    });
    renderCart();
    shippingForm.reset();

    setTimeout(function() {
        shippingModal.classList.remove('open');
    }, 1500);
});

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
    formStatus.textContent = 'Thank you! Your message has been sent successfully.';
    contactForm.reset();
});
