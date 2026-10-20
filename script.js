const aktualitems = [
    {
        title: "Telefonlar, Smart cihazlar və telefon aksessuarları",
        img: "https://strgimgr.umico.az/img/category/188/764e0397-6321-4008-b274-95f12fba59c4.jpeg",
        url: "javascript:void(0)"
    },
    {
        title: "Notbuk və kompüterlər",
        img: "https://strgimgr.umico.az/img/category/188/194a575e-619b-46c2-b080-6f718998ddca.jpeg",
        url: "javascript:void(0)"
    },
    {
        title: "Məişət texnikası",
        img: "https://strgimgr.umico.az/img/category/188/944e559f-819f-4e8f-a09c-a3fceae9e641.jpeg",
        url: "javascript:void(0)"
    },
    {
        title: "TV, audio və video",
        img: "https://strgimgr.umico.az/img/category/188/26f24528-c5cc-4847-b209-6a4a72923411.jpeg",
        url: "javascript:void(0)"
    },
    {
        title: "Gözəllik",
        img: "https://strgimgr.umico.az/img/category/188/9400a216-bfca-4434-aac2-ac64752baa6d.jpeg",
        url: "javascript:void(0)"
    },
    {
        title: "Bağ üçün məhsullar",
        img: "https://strgimgr.umico.az/img/category/188/7d53cf6b-98c7-407e-8b68-411eaec6c2d4.jpeg",
        url: "javascript:void(0)"
    },
    {
        title: "Saat, zinət və bəzək əşyaları",
        img: "https://strgimgr.umico.az/img/category/188/00902c8c-5c83-4cec-8088-91846480c788.jpeg",
        url: "javascript:void(0)"
    },
    {
        title: "Idman və Əyləncə",
        img: "https://strgimgr.umico.az/img/category/188/3d8cf4c5-b955-4fc8-a521-3c841f95247a.jpeg",
        url: "javascript:void(0)"
    },
    {
        title: "Avtomobil məhsulları",
        img: "https://strgimgr.umico.az/img/category/188/e3098bf4-66dd-49dd-b980-eda7caf09b56.jpeg",
        url: "javascript:void(0)"
    },
    {
        title: "Uşaqlar üçün məhsullar",
        img: "https://strgimgr.umico.az/img/category/188/ecb6761d-0918-445e-8250-806c666aaade.jpeg",
        url: "javascript:void(0)"
    },
    {
        title: "Təmir və tikinti",
        img: "https://strgimgr.umico.az/img/category/188/e6fecd53-b785-48fd-86ff-db975b14e38a.jpeg",
        url: "javascript:void(0)"
    }
];

window.allProductsMap = window.allProductsMap || {};

function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem('birmarket_favorites')) || [];
    } catch (e) {
        return [];
    }
}

function isProductFavorite(productId) {
    const favs = getFavorites();
    return favs.some(p => String(p.id) === String(productId));
}

function saveFavorites(favs) {
    localStorage.setItem('birmarket_favorites', JSON.stringify(favs));
    updateFavoritesCount();
}

function updateFavoritesCount() {
    const count = getFavorites().length;
    const badges = document.querySelectorAll('.header-fav-badge, .mobile-fav-badge');
    badges.forEach(b => {
        if (count > 0) {
            b.textContent = count;
            b.classList.remove('hidden');
        } else {
            b.classList.add('hidden');
        }
    });
}

function getCart() {
    try {
        return JSON.parse(localStorage.getItem('birmarket_cart')) || [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('birmarket_cart', JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    const badges = document.querySelectorAll('.header-cart-badge, #cart-nav-badge, .mobile-cart-badge');
    badges.forEach(b => {
        if (count > 0) {
            b.textContent = count;
            b.classList.remove('hidden');
        } else {
            b.classList.add('hidden');
        }
    });
    document.querySelectorAll('.drawer-cart-badge').forEach(b => {
        b.textContent = count > 0 ? count : 2;
    });
}

function addToCart(product, qty = 1) {
    if (!product) return;
    const cart = getCart();
    const existing = cart.find(item => String(item.id) === String(product.id));
    if (existing) {
        existing.qty = (existing.qty || 1) + qty;
    } else {
        cart.push({
            id: product.id,
            name: product.name || product.title,
            seller: product.seller || 'Bazar Shop',
            image: product.image || (product.images && product.images[0] ? product.images[0].small : ''),
            price: Number(product.price || (product.default_offer ? product.default_offer.retail_price : 0)),
            oldPrice: product.oldPrice || (product.default_offer ? product.default_offer.old_price : null),
            discount: product.discount || null,
            installment: product.installment || null,
            delivery: product.delivery || '21 oktyabr',
            qty: qty,
            selected: true
        });
    }
    saveCart(cart);
}

function handleAddToCartCardClick(e, productId) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    const product = window.allProductsMap[productId];
    if (product) {
        addToCart(product, 1);
        const btn = e ? e.currentTarget : null;
        if (btn) {
            const span = btn.querySelector('span');
            const origText = span ? span.textContent : '';
            if (span) span.textContent = 'Əlavə edildi ✓';
            btn.classList.add('!bg-[#16A34A]', '!text-white');
            setTimeout(() => {
                if (span) span.textContent = origText;
                btn.classList.remove('!bg-[#16A34A]', '!text-white');
            }, 1200);
        }
    }
}
window.handleAddToCartCardClick = handleAddToCartCardClick;

function handleHeartClick(e, productId) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    const product = window.allProductsMap[productId];
    let favs = getFavorites();
    const existingIndex = favs.findIndex(p => String(p.id) === String(productId));
    const isAdding = existingIndex === -1;

    const buttons = document.querySelectorAll(`.heart-btn[data-product-id="${productId}"]`);

    if (isAdding) {
        if (product) {
            favs.push(product);
            saveFavorites(favs);
        }

        buttons.forEach(btn => {
            btn.classList.add('active');
            btn.classList.remove('text-[#9497ad]');
            btn.classList.add('text-[#ea207e]');
            btn.innerHTML = `<svg width="20" height="20" fill="#EA207E" stroke="#EA207E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
            btn.classList.remove('heart-animating');
            void btn.offsetWidth;
            btn.classList.add('heart-animating');
            setTimeout(() => {
                btn.classList.remove('heart-animating');
            }, 1000);
        });
    } else {
        favs.splice(existingIndex, 1);
        saveFavorites(favs);

        buttons.forEach(btn => {
            btn.classList.remove('active');
            btn.classList.remove('text-[#ea207e]');
            btn.classList.add('text-[#9497ad]');
            btn.innerHTML = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
        });

        if (document.getElementById('favorites-grid')) {
            renderFavoritesPage();
        }
    }
}

function renderFavoritesPage() {
    const grid = document.getElementById('favorites-grid');
    const emptyState = document.getElementById('favorites-empty');
    if (!grid || !emptyState) return;

    const favs = getFavorites();
    if (favs.length === 0) {
        grid.classList.add('hidden');
        grid.innerHTML = '';
        emptyState.classList.remove('hidden');
        emptyState.classList.add('flex');
    } else {
        emptyState.classList.add('hidden');
        emptyState.classList.remove('flex');
        grid.classList.remove('hidden');

        grid.innerHTML = favs.map(p => {
            window.allProductsMap[p.id] = p;
            return createProductCard(p, {
                isSlider: false,
                buttonText: (typeof currentLanguage !== 'undefined' && currentLanguage === 'ru') ? 'В корзину' : 'Səbətə at'
            });
        }).join('');
    }
}

function handleCardClick(e, productId) {
    if (e.target.closest('.heart-btn') || e.target.closest('button')) {
        return;
    }
    window.location.href = `product.html?id=${productId}`;
}

function normalizeProduct(p) {
    if (!p) return {};
    const name = p.name || p.title || '';
    const imgUrl = p.image || (p.main_img && (p.main_img.big || p.main_img.medium || p.main_img.small))
        || (p.images && p.images[0] && (p.images[0].big || p.images[0].medium || p.images[0].small))
        || '';
    const price = (p.price !== undefined && p.price !== null) ? Number(p.price) : (p.default_offer && p.default_offer.retail_price !== undefined ? Number(p.default_offer.retail_price) : 0);
    const oldPrice = (p.oldPrice !== undefined && p.oldPrice !== null) ? Number(p.oldPrice) : (p.default_offer && p.default_offer.old_price !== undefined ? Number(p.default_offer.old_price) : null);
    
    let defaultOffer = p.default_offer ? { ...p.default_offer } : {};
    defaultOffer.retail_price = price;
    defaultOffer.old_price = oldPrice;

    if (p.installment && p.installment.monthly) {
        defaultOffer.installment_enabled = true;
        defaultOffer.max_installment_months = p.installment.months || 24;
    }

    let ratings = p.ratings ? { ...p.ratings } : {};
    if (p.rating !== undefined || p.reviewCount !== undefined) {
        ratings.rating_score = p.rating !== undefined ? p.rating : (ratings.rating_score || 5);
        ratings.session_count = p.reviewCount !== undefined ? p.reviewCount : (ratings.session_count || 0);
    }

    let labels = p.product_labels ? [...p.product_labels] : [];
    if (p.isNew && !labels.some(l => l.text === 'Yeni')) {
        labels.unshift({ text: 'Yeni' });
    }
    if (p.isPartnerPremium && !labels.some(l => l.text === 'Premium')) {
        labels.push({ text: 'Premium' });
    }
    if (p.isBestSeller && !labels.some(l => l.text === 'Hit')) {
        labels.push({ text: 'Hit' });
    }

    return {
        ...p,
        name: name,
        title: name,
        image: imgUrl,
        main_img: { big: imgUrl, medium: imgUrl, small: imgUrl },
        images: [{ big: imgUrl, medium: imgUrl, small: imgUrl }],
        default_offer: defaultOffer,
        ratings: ratings,
        product_labels: labels,
        timer: p.timer || defaultOffer.timer || ''
    };
}

function createProductCard(rawProduct, options = {}) {
    const product = normalizeProduct(rawProduct);
    window.allProductsMap[product.id] = product;
    const { isSlider = false, showTimer = false, preserveInstallmentSpace = false, preserveRatingSpace = false } = options;

    let labelHtml = '';
    if (product.product_labels && product.product_labels.length > 0) {
        const labels = product.product_labels.slice(0, 2).map(lbl => `
            <div class="bg-[#ea207e] text-white text-[11px] font-bold px-[6px] py-[2px] rounded-[4px] leading-tight mb-1">${lbl.text}</div>
        `).join('');
        labelHtml = `<div class="absolute top-[16px] left-[16px] z-10 flex flex-col items-start">${labels}</div>`;
    }

    let discountHtml = '';
    if (product.discount && product.discount > 0) {
        discountHtml = `<div class="absolute bottom-0 left-0 bg-[#ea207e] text-white text-[11px] font-bold px-[6px] py-[3px] rounded-[4px]">-${product.discount} %</div>`;
    } else if (product.default_offer && product.default_offer.old_price > product.default_offer.retail_price) {
        const discount = Math.round((1 - (product.default_offer.retail_price / product.default_offer.old_price)) * 100);
        discountHtml = `<div class="absolute bottom-0 left-0 bg-[#ea207e] text-white text-[11px] font-bold px-[6px] py-[3px] rounded-[4px]">-${discount} %</div>`;
    }

    const retail = (product.default_offer && product.default_offer.retail_price !== undefined) ? Number(product.default_offer.retail_price).toFixed(2) : '0.00';
    const oldPrice = (product.default_offer && product.default_offer.old_price > product.default_offer.retail_price)
        ? `<span class="text-[#9497AD] text-[12px] line-through leading-[1.2] pb-[1px]">${Number(product.default_offer.old_price).toFixed(2)} ₼</span>`
        : '';

    let installHtml = preserveInstallmentSpace ? '<div class="h-[25px] mt-1 mb-2"></div>' : '';
    if (product.installment && product.installment.monthly) {
        const monthUnit = (typeof currentLanguage !== 'undefined' && currentLanguage === 'ru') ? 'мес.' : 'ay';
        installHtml = `<div class="bg-[#ffcc00] text-[#1E244D] text-[11px] font-bold px-[6px] py-[2px] rounded-[4px] w-max mt-1 mb-2">${product.installment.monthly} <span class="font-normal">₼</span> x ${product.installment.months || 24} ${monthUnit}</div>`;
    } else if (product.default_offer && product.default_offer.installment_enabled && product.default_offer.max_installment_months > 0) {
        const monthly = (product.default_offer.retail_price / product.default_offer.max_installment_months).toFixed(2);
        const monthUnit = (typeof currentLanguage !== 'undefined' && currentLanguage === 'ru') ? 'мес.' : 'ay';
        installHtml = `<div class="bg-[#ffcc00] text-[#1E244D] text-[11px] font-bold px-[6px] py-[2px] rounded-[4px] w-max mt-1 mb-2">${monthly} <span class="font-normal">₼</span> x ${product.default_offer.max_installment_months} ${monthUnit}</div>`;
    }

    let ratingHtml = preserveRatingSpace ? '<div class="h-[18px] mt-1"></div>' : '';
    if ((product.ratings && product.ratings.session_count > 0) || (product.rating && product.rating > 0)) {
        const starsCount = Math.round(product.rating || (product.ratings ? product.ratings.rating_score : 5)) || 5;
        const count = (product.ratings && product.ratings.session_count !== undefined) ? product.ratings.session_count : (product.reviewCount || 0);
        ratingHtml = `
            <div class="flex items-center gap-1 mt-1">
                <div class="flex text-[#ff9800]">
                    ${Array(5).fill(0).map((_, i) => `<svg width="10" height="10" fill="${i < starsCount ? 'currentColor' : '#DCDDE4'}" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>`).join('')}
                </div>
                <span class="text-[10px] text-[#ea207e] ml-[2px]">${count} ${(typeof currentLanguage !== 'undefined' && currentLanguage === 'ru') ? 'отзывов' : 'reytinq'}</span>
            </div>`;
    }

    const imgUrl = (product.main_img && (product.main_img.small || product.main_img.medium || product.main_img.big))
        || (product.images && product.images[0] && (product.images[0].small || product.images[0].medium || product.images[0].big))
        || product.image
        || '';

    const timerText = (typeof getMidnightCountdown === 'function') ? getMidnightCountdown() : (product.timer || '00:00:00');
    const campaignTimer = showTimer ? `<div class="text-[11px] text-[#9497AD]">Aksiya: <span class="campaign-countdown-timer-val text-[#ea207e] font-bold">${timerText}</span></div>` : '';
    const containerClass = isSlider ? 'swiper-slide w-[248px] !h-auto' : 'w-full';

    const isFav = isProductFavorite(product.id);
    const heartSvg = isFav 
        ? `<svg width="20" height="20" fill="#EA207E" stroke="#EA207E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`
        : `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;

    const heartColorClass = isFav ? 'active text-[#EA207E]' : 'text-[#9497ad] hover:text-[#ea207e]';
    const btnText = options.buttonText || ((typeof currentLanguage !== 'undefined' && currentLanguage === 'ru') ? 'В корзину' : (isSlider ? 'Sabah' : 'Səbətə at'));

    return `
      <div class="${containerClass}">
        <div class="MPProductItem group bg-white border border-[#f1f2f3] rounded-[10px] hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col h-full mx-auto cursor-pointer" onclick="handleCardClick(event, '${product.id}')">
          <div class="p-[16px] relative">
            <div class="heart-btn absolute top-[16px] right-[16px] z-20 cursor-pointer ${heartColorClass}" data-product-id="${product.id}" onclick="handleHeartClick(event, '${product.id}')" title="Seçilmişlərə əlavə et">
              ${heartSvg}
            </div>
            ${labelHtml}
            <div class="relative h-[160px] flex items-center justify-center mb-4 mt-2">
              <img src="${imgUrl}" class="max-h-full object-contain mix-blend-multiply" alt="${product.name}">
              ${discountHtml}
            </div>
            
            <div class="flex flex-col gap-[2px]">
              <div class="flex items-end gap-2 mb-1">
                <span class="text-[#EA207E] text-[18px] font-bold leading-none tracking-tight">${retail} <span class="font-normal text-[14px]">₼</span></span>
                ${oldPrice}
              </div>
              ${campaignTimer}
              ${installHtml}
              <div class="text-[#1E244D] text-[13px] leading-[1.4] h-[36px] overflow-hidden line-clamp-2 mt-[2px] group-hover:text-[#ea207e] transition-colors">${product.name}</div>
              ${ratingHtml}
            </div>
          </div>
          
          <div class="mt-auto p-[16px] pt-0">
            <button class="w-full h-[40px] flex items-center justify-center gap-2 bg-[#fff0f6] text-[#ea207e] font-[600] text-[13px] rounded-[6px] transition-colors hover:bg-[#ffe1ee]" onclick="handleAddToCartCardClick(event, '${product.id}')">
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span>${btnText}</span>
            </button>
          </div>
        </div>
      </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    updateFavoritesCount();
    updateCartBadge();
    if (document.querySelector('.mainSwiper')) {
        new Swiper('.mainSwiper', {
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.custom-pagination',
                clickable: true,
            },
        });
    }
});

function initSaleOfDay() {
    fetch("products.json")
        .then(response => response.json())
        .then(data => {
            const wrapper = document.getElementById('sale-swiper-wrapper');
            if (!wrapper) return;

            const rawProducts = data.discountedProducts || [];
            const products = rawProducts.map(p => ({ ...p, id: `disc_${p.id}` }));
            wrapper.innerHTML = products.map(product => createProductCard(product, { isSlider: true, showTimer: true })).join('');

            if (document.querySelector('.saleSwiper')) {
                new Swiper('.saleSwiper', {
                    slidesPerView: 'auto',
                    spaceBetween: 16,
                    navigation: {
                        nextEl: '.sale-button-next',
                        prevEl: '.sale-button-prev',
                    },
                    pagination: {
                        el: '.sale-pagination',
                        clickable: true,
                    },
                });
            }
        })
        .catch(err => {
            console.warn("products.json xətası, salesofday.json-a keçilir:", err);
            fetch("salesofday.json")
                .then(r => r.json())
                .then(data => {
                    const wrapper = document.getElementById('sale-swiper-wrapper');
                    if (!wrapper) return;
                    const products = data.products || [];
                    wrapper.innerHTML = products.map(product => createProductCard(product, { isSlider: true, showTimer: true })).join('');
                })
                .catch(e => console.error("Günün endirimi API xətası:", e));
        });
}

function initBrandsSwiper() {
    if (!document.querySelector('.brandsSwiper')) return;
    new Swiper('.brandsSwiper', {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 10,
        navigation: {
            nextEl: '.brands-button-next',
            prevEl: '.brands-button-prev',
        },
        pagination: {
            el: '.brands-pagination',
            clickable: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                spaceBetween: 12,
            },
            768: {
                slidesPerView: 4,
                slidesPerGroup: 4,
                spaceBetween: 12,
            },
            1024: {
                slidesPerView: 5,
                slidesPerGroup: 5,
                spaceBetween: 16,
            }
        }
    });
}

function initSellersSwiper() {
    if (!document.querySelector('.sellersSwiper')) return;
    new Swiper('.sellersSwiper', {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 10,
        navigation: {
            nextEl: '.sellers-button-next',
            prevEl: '.sellers-button-prev',
        },
        pagination: {
            el: '.sellers-pagination',
            clickable: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                spaceBetween: 12,
            },
            768: {
                slidesPerView: 4,
                slidesPerGroup: 4,
                spaceBetween: 12,
            },
            1024: {
                slidesPerView: 5,
                slidesPerGroup: 5,
                spaceBetween: 16,
            }
        }
    });
}

function renderBestSellers(products) {
    const grid = document.getElementById('bestsellers-grid');
    if (!grid) return;
    grid.innerHTML = products.map(product => createProductCard(product, { isSlider: false })).join('');
}

function initBestSellers() {
    fetch("products.json")
        .then(response => response.json())
        .then(data => {
            const rawProducts = data.bestSellerProducts || [];
            const products = rawProducts.map(p => ({ ...p, id: `best_${p.id}` }));
            window.cachedBestSellers = products;
            renderBestSellers(window.cachedBestSellers);
        })
        .catch(err => {
            console.warn("products.json xətası, top.json-a keçilir:", err);
            fetch("top.json")
                .then(r => r.json())
                .then(data => {
                    window.cachedBestSellers = data.products || [];
                    renderBestSellers(window.cachedBestSellers);
                })
                .catch(e => console.error("Ən çox satılanlar API xətası:", e));
        });
}

let newSwiperInstance = null;

function renderNewProducts(products) {
    const wrapper = document.getElementById('new-swiper-wrapper');
    if (!wrapper) return;

    wrapper.innerHTML = products.map(product => createProductCard(product, {
        isSlider: true,
        preserveInstallmentSpace: true,
        preserveRatingSpace: true
    })).join('');

    if (newSwiperInstance) {
        newSwiperInstance.destroy(true, true);
    }

    if (document.querySelector('.newSwiper')) {
        newSwiperInstance = new Swiper('.newSwiper', {
            slidesPerView: 'auto',
            spaceBetween: 16,
            navigation: {
                nextEl: '.new-button-next',
                prevEl: '.new-button-prev',
            },
            pagination: {
                el: '.new-pagination',
                clickable: true,
            },
            breakpoints: {
                1280: {
                    slidesPerView: 5,
                    slidesPerGroup: 5,
                    spaceBetween: 16
                }
            }
        });
    }
}

function initNewProducts() {
    fetch("products.json")
        .then(response => response.json())
        .then(data => {
            const rawProducts = data.newProducts || [];
            const products = rawProducts.map(p => ({ ...p, id: `new_${p.id}` }));
            window.cachedNewProducts = products;
            renderNewProducts(window.cachedNewProducts);
        })
        .catch(err => console.error("Yeni məhsullar xətası:", err));
}

const aktualTitlesRu = {
    "Telefonlar, Smart cihazlar və telefon aksessuarları": "Телефоны, смарт-устройства и аксессуары",
    "Notbuk və kompüterlər": "Ноутбуки и компьютеры",
    "Məişət texnikası": "Бытовая техника",
    "TV, audio və video": "ТВ, аудио и видео",
    "Gözəllik": "Красота",
    "Bağ üçün məhsullar": "Товары для сада",
    "Saat, zinət və bəzək əşyaları": "Часы, ювелирные изделия и украшения",
    "Idman və Əyləncə": "Спорт и развлечения",
    "Avtomobil məhsulları": "Автотовары",
    "Uşaqlar üçün məhsullar": "Детские товары",
    "Təmir və tikinti": "Ремонт и строительство"
};

function initAktualCategories() {
    const container = document.querySelector('.MPLandingCategories-Items');
    if (!container) return;
    const isRu = (typeof currentLanguage !== 'undefined' && currentLanguage === 'ru');

    container.innerHTML = aktualitems.map(item => {
        const displayTitle = isRu && aktualTitlesRu[item.title] ? aktualTitlesRu[item.title] : item.title;
        return `
        <div class="Item">
            <a href="${item.url}" class="flex flex-col items-center text-center group cursor-pointer block">
                <span class="MPLandingCategories-ItemsLogo block w-[110px] h-[95px] bg-contain bg-center bg-no-repeat mb-3 transition-transform duration-200 group-hover:scale-105" style="background-image: url('${item.img}');"></span>
                <span class="text-center text-[#1E244D] text-[12.5px] font-normal leading-[1.3] group-hover:text-[#ea207e] transition-colors max-w-[145px] block mx-auto">
                    <span>${displayTitle}</span>
                </span>
            </a>
        </div>
    `}).join('');
}

let megaSwiperInstance = null;

function renderMegaProducts(products) {
    const wrapper = document.getElementById('mega-swiper-wrapper');
    if (!wrapper) return;

    wrapper.innerHTML = products.map(product => createProductCard(product, {
        isSlider: true,
        preserveInstallmentSpace: true,
        preserveRatingSpace: true
    })).join('');

    if (megaSwiperInstance) {
        megaSwiperInstance.destroy(true, true);
    }

    megaSwiperInstance = new Swiper('.megaSwiper', {
        slidesPerView: 'auto',
        spaceBetween: 16,
        navigation: {
            nextEl: '.mega-button-next',
            prevEl: '.mega-button-prev',
        },
        pagination: {
            el: '.mega-pagination',
            clickable: true,
        },
        breakpoints: {
            1280: {
                slidesPerView: 5,
                slidesPerGroup: 5,
                spaceBetween: 16
            }
        }
    });
}

function initMegaDiscounts() {
    fetch("megadiscounts.json")
        .then(response => response.json())
        .then(data => {
            window.cachedMegaProducts = data.products || [];
            renderMegaProducts(window.cachedMegaProducts);
        })
        .catch(err => console.error("Mega endirimlər xətası:", err));
}

let recentSwiperInstance = null;

function renderRecentlyViewed(products) {
    const wrapper = document.getElementById('recent-swiper-wrapper');
    if (!wrapper) return;

    wrapper.innerHTML = products.map(product => createProductCard(product, {
        isSlider: true,
        preserveInstallmentSpace: true,
        preserveRatingSpace: true
    })).join('');

    if (recentSwiperInstance) {
        recentSwiperInstance.destroy(true, true);
    }

    if (document.querySelector('.recentSwiper')) {
        recentSwiperInstance = new Swiper('.recentSwiper', {
            slidesPerView: 'auto',
            spaceBetween: 16,
            navigation: {
                nextEl: '.recent-button-next',
                prevEl: '.recent-button-prev',
            },
            pagination: {
                el: '.recent-pagination',
                clickable: true,
            },
            breakpoints: {
                1280: {
                    slidesPerView: 5,
                    slidesPerGroup: 5,
                    spaceBetween: 16
                }
            }
        });
    }
}

function initRecentlyViewed() {
    let viewed = [];
    try {
        viewed = JSON.parse(localStorage.getItem('birmarket_recently_viewed')) || [];
    } catch(e) {
        viewed = [];
    }

    if (viewed && viewed.length >= 4) {
        window.cachedRecentlyViewed = viewed;
        renderRecentlyViewed(window.cachedRecentlyViewed);
    } else {
        fetch("top.json")
            .then(res => res.json())
            .then(data => {
                const sample = (data.products || []).slice(0, 10).map(p => ({ ...p, id: `rv_${p.id}` }));
                window.cachedRecentlyViewed = (viewed && viewed.length > 0) ? [...viewed, ...sample.slice(viewed.length)] : sample;
                renderRecentlyViewed(window.cachedRecentlyViewed);
            })
            .catch(err => {
                console.warn("Recently viewed fallback error:", err);
            });
    }
}

let topSwiperInstance = null;

function renderTopProducts(products) {
    const wrapper = document.getElementById('top-swiper-wrapper');
    if (!wrapper) return;

    wrapper.innerHTML = products.map(product => createProductCard(product, {
        isSlider: true,
        preserveInstallmentSpace: true,
        preserveRatingSpace: true
    })).join('');

    if (topSwiperInstance) {
        topSwiperInstance.destroy(true, true);
    }

    if (document.querySelector('.topSwiper')) {
        topSwiperInstance = new Swiper('.topSwiper', {
            slidesPerView: 'auto',
            spaceBetween: 16,
            navigation: {
                nextEl: '.top-button-next',
                prevEl: '.top-button-prev',
            },
            pagination: {
                el: '.top-pagination',
                clickable: true,
            },
            breakpoints: {
                1280: {
                    slidesPerView: 5,
                    slidesPerGroup: 5,
                    spaceBetween: 16
                }
            }
        });
    }
}

function initTopProducts() {
    fetch("top.json")
        .then(response => response.json())
        .then(data => {
            const rawProducts = (data.products || []).slice(0, 15);
            const products = rawProducts.map(p => ({ ...p, id: `top_${p.id}` }));
            window.cachedTopProducts = products;
            renderTopProducts(window.cachedTopProducts);
        })
        .catch(err => console.error("TOP məhsullar xətası:", err));
}

window.onLanguageChange = function() {
    initAktualCategories();
    if (window.cachedRecentlyViewed) {
        renderRecentlyViewed(window.cachedRecentlyViewed);
    }
    if (window.cachedBestSellers) {
        renderBestSellers(window.cachedBestSellers);
    }
    if (window.cachedMegaProducts) {
        renderMegaProducts(window.cachedMegaProducts);
    }
    if (window.cachedTopProducts) {
        renderTopProducts(window.cachedTopProducts);
    }
    if (window.cachedNewProducts) {
        renderNewProducts(window.cachedNewProducts);
    }
    if (document.getElementById('favorites-grid')) {
        renderFavoritesPage();
    }
};

initRecentlyViewed();
initSaleOfDay();
initBrandsSwiper();
initSellersSwiper();
initBestSellers();
initAktualCategories();
initMegaDiscounts();
initTopProducts();
initNewProducts();

const azerbaijanCities = [

    ["Bakı", "Abşeron", "Ağcabədi", "Ağdam", "Ağdaş", "Ağdərə", "Ağstafa", "Ağsu", "Astara", "Balakən", "Bərdə", "Beyləqan", "Biləsuvar", "Cəbrayıl", "Cəlilabad", "Daşkəsən", "Füzuli"],

    ["Gədəbəy", "Gəncə", "Goranboy", "Göyçay", "Göygöl", "Hacıqabul", "İmişli", "İsmayıllı", "Kəlbəcər", "Kürdəmir", "Laçın", "Lənkəran", "Lerik", "Masallı", "Mingəçevir", "Naftalan", "Naxçıvan"],

    ["Neftçala", "Oğuz", "Qax", "Qazax", "Qəbələ", "Qobustan", "Quba", "Qubadlı", "Qusar", "Saatlı", "Sabirabad", "Şabran", "Salyan", "Şamaxı", "Samux", "Şəki", "Şəmkir"],

    ["Şirvan", "Siyəzən", "Sumqayıt", "Şuşa", "Tərtər", "Tovuz", "Ucar", "Xaçmaz", "Xankəndi", "Xırdalan", "Xızı", "Xocalı", "Xocavənd", "Xudat", "Yardımlı", "Yevlax", "Zaqatala"],

    ["Zəngilan", "Zərdab"]
];

function getCurrentCity() {
    return localStorage.getItem('birmarket_city') || 'Bakı';
}

function updateCityDisplay(city) {
    document.querySelectorAll('[data-info="citypicker-current-city"]').forEach(el => {
        el.innerHTML = `&nbsp;${city}`;
    });
    document.querySelectorAll('.header-current-city, .burger-city-label').forEach(el => {
        el.textContent = city;
    });
    document.querySelectorAll('.header-city-trigger strong').forEach(el => {
        el.textContent = city;
    });
}

function renderCitiesGrid() {
    const gridEl = document.getElementById('city-columns-grid');
    if (!gridEl) return;

    const currentCity = getCurrentCity();
    
    gridEl.innerHTML = azerbaijanCities.map(column => `
        <div class="flex flex-col">
            ${column.map(cityName => {
                const isActive = cityName.trim().toLowerCase() === currentCity.trim().toLowerCase();
                const checkIcon = isActive ? `
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ea207e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="inline-block ml-1">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                ` : '';
                return `
                    <div class="city-item ${isActive ? 'active' : ''}" onclick="selectCity('${cityName}')">
                        <span>${cityName}</span>
                        ${checkIcon}
                    </div>
                `;
            }).join('')}
        </div>
    `).join('');
}

function openCityModal() {
    let modal = document.getElementById('city-modal-backdrop');
    if (!modal) {
        createCityModalElement();
        modal = document.getElementById('city-modal-backdrop');
    }
    renderCitiesGrid();

    requestAnimationFrame(() => {
        modal.classList.add('active');
    });
    document.body.style.overflow = 'hidden';
}

function closeCityModal() {
    const modal = document.getElementById('city-modal-backdrop');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function selectCity(cityName) {
    localStorage.setItem('birmarket_city', cityName);
    updateCityDisplay(cityName);
    renderCitiesGrid();
    setTimeout(() => {
        closeCityModal();
    }, 200);
}

function createCityModalElement() {
    if (document.getElementById('city-modal-backdrop')) return;

    const modalDiv = document.createElement('div');
    modalDiv.id = 'city-modal-backdrop';
    modalDiv.className = 'city-modal-backdrop';
    modalDiv.innerHTML = `
        <div class="city-modal-dialog" onclick="event.stopPropagation()">
            <button onclick="closeCityModal()" class="absolute top-6 right-6 text-[#71717A] hover:text-[#1E244D] transition-colors p-1" title="Bağla">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            <h3 class="text-[22px] md:text-[24px] font-bold text-[#1E244D] text-center mb-7">Şəhərinizi seçin</h3>

            <div id="city-columns-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-1"></div>
        </div>
    `;

    modalDiv.addEventListener('click', (e) => {
        if (e.target === modalDiv) {
            closeCityModal();
        }
    });

    document.body.appendChild(modalDiv);
}

function initCityPicker() {
    createCityModalElement();
    updateCityDisplay(getCurrentCity());

    const triggers = document.querySelectorAll('[data-info="citypicker-block"], .header-city-trigger, .city-picker-btn');
    triggers.forEach(trig => {
        trig.style.cursor = 'pointer';
        trig.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openCityModal();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCityModal();
        }
    });
}

window.openCityModal = openCityModal;
window.closeCityModal = closeCityModal;
window.selectCity = selectCity;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCityPicker);
} else {
    initCityPicker();
}

window.searchCatalog = window.searchCatalog || [];
let searchCatalogPromise = null;

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function cleanSearchString(str) {
    return (str || '')
        .toLowerCase()
        .replace(/ə/g, 'e')
        .replace(/ı/g, 'i')
        .replace(/ç/g, 'c')
        .replace(/ş/g, 's')
        .replace(/ğ/g, 'g')
        .replace(/ö/g, 'o')
        .replace(/ü/g, 'u')
        .trim();
}

function fetchAllSearchCatalog() {
    if (searchCatalogPromise) return searchCatalogPromise;
    searchCatalogPromise = Promise.all([
        fetch('products.json').then(r => r.json()).catch(() => ({ discountedProducts: [], newProducts: [], bestSellerProducts: [], cartProducts: [] })),
        fetch('salesofday.json').then(r => r.json()).catch(() => ({ products: [] })),
        fetch('megadiscounts.json').then(r => r.json()).catch(() => ({ products: [] })),
        fetch('top.json').then(r => r.json()).catch(() => ({ products: [] }))
    ]).then(([productsData, salesData, megaData, topData]) => {
        const disc = (productsData.discountedProducts || []).map(p => ({
            ...p,
            id: `disc_${p.id}`,
            alias_id: String(p.id),
            name: p.title || p.name,
            title: p.title || p.name,
            category: p.category || 'Günün endirimləri'
        }));
        const newP = (productsData.newProducts || []).map(p => ({
            ...p,
            id: `new_${p.id}`,
            alias_id: String(p.id),
            name: p.title || p.name,
            title: p.title || p.name,
            category: p.category || 'Yeni məhsullar'
        }));
        const best = (productsData.bestSellerProducts || []).map(p => ({
            ...p,
            id: `best_${p.id}`,
            alias_id: String(p.id),
            name: p.title || p.name,
            title: p.title || p.name,
            category: p.category || 'Ən çox satılanlar'
        }));
        const cartP = (productsData.cartProducts || []).map(p => ({
            ...p,
            id: `cart_${p.id}`,
            alias_id: String(p.id),
            name: p.title || p.name,
            title: p.title || p.name,
            category: p.category || 'Məhsullar'
        }));
        const salesP = (salesData.products || []).map(p => ({
            ...p,
            id: String(p.id),
            name: p.name || p.title,
            title: p.name || p.title
        }));
        const megaP = (megaData.products || []).map(p => ({
            ...p,
            id: String(p.id),
            name: p.name || p.title,
            title: p.name || p.title
        }));
        const topP = (topData.products || []).map(p => ({
            ...p,
            id: String(p.id),
            name: p.name || p.title,
            title: p.name || p.title
        }));

        const combined = [...disc, ...newP, ...best, ...cartP, ...salesP, ...megaP, ...topP];
        const seen = new Set();
        const unique = [];

        combined.forEach(p => {
            if (p && p.id && !seen.has(String(p.id))) {
                seen.add(String(p.id));
                const norm = normalizeProduct(p);
                unique.push(norm);
                window.allProductsMap[norm.id] = norm;
                if (p.alias_id) {
                    window.allProductsMap[p.alias_id] = norm;
                }
            }
        });

        window.searchCatalog = unique;
        return unique;
    }).catch(err => {
        console.error("Kataloq yüklənmə xətası:", err);
        return [];
    });

    return searchCatalogPromise;
}

function searchProductsInCatalog(query) {
    if (!query || query.trim().length === 0) return [];
    const cleanQ = cleanSearchString(query);
    const tokens = cleanQ.split(/\s+/).filter(t => t.length > 0);

    return (window.searchCatalog || []).filter(product => {
        const titleClean = cleanSearchString(product.name || product.title);
        const descClean = cleanSearchString(product.desc || '');
        const catClean = cleanSearchString(typeof product.category === 'object' ? (product.category.name || '') : (product.category || ''));
        const fullText = `${titleClean} ${descClean} ${catClean}`;

        return tokens.every(token => fullText.includes(token));
    });
}

function renderSearchDropdown(form, query, matches) {
    let dropdown = form.querySelector('.search-autocomplete-dropdown');
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.className = 'search-autocomplete-dropdown absolute top-[calc(100%+4px)] left-0 right-0 bg-white rounded-[8px] shadow-[0_12px_36px_rgba(0,0,0,0.16)] border border-[#DCDDE4] z-50 overflow-hidden text-left';
        form.appendChild(dropdown);
    }

    if (matches.length === 0) {
        dropdown.innerHTML = `
            <div class="p-4 text-center text-[#71717A] text-[13px]">
                <span class="block font-medium mb-1">"${escapeHtml(query)}" üzrə heç bir məhsul tapılmadı</span>
                <span class="text-[11px] text-[#9497ad]">Sorğunu dəyişməyə və ya başqa açar söz yazmağa çalışın</span>
            </div>
        `;
        dropdown.classList.remove('hidden');
        return;
    }

    const maxVisible = 6;
    const displayed = matches.slice(0, maxVisible);

    const itemsHtml = displayed.map(item => {
        const pName = item.name || item.title || '';
        const pImg = item.image || (item.main_img ? (item.main_img.small || item.main_img.big) : '') || (item.images && item.images[0] ? (item.images[0].small || item.images[0].big) : '');
        const price = (item.default_offer && item.default_offer.retail_price) ? Number(item.default_offer.retail_price).toFixed(2) : (item.price ? Number(item.price).toFixed(2) : '0.00');
        const oldPrice = (item.default_offer && item.default_offer.old_price > item.default_offer.retail_price) ? Number(item.default_offer.old_price).toFixed(2) : (item.oldPrice ? Number(item.oldPrice).toFixed(2) : null);
        const catName = typeof item.category === 'object' ? item.category.name : (item.category || '');

        return `
            <a href="product.html?id=${item.id}" class="search-drop-item flex items-center gap-3 p-2.5 hover:bg-[#fff0f6] border-b border-[#f1f2f3] last:border-b-0 cursor-pointer transition-colors group">
                <div class="w-12 h-12 bg-white border border-[#f1f2f3] rounded-[6px] p-1 flex items-center justify-center shrink-0">
                    <img src="${pImg}" alt="${escapeHtml(pName)}" class="max-h-full max-w-full object-contain mix-blend-multiply" />
                </div>
                <div class="flex-1 min-w-0">
                    <div class="text-[12.5px] font-semibold text-[#1E244D] group-hover:text-[#ea207e] line-clamp-1 truncate transition-colors">
                        ${escapeHtml(pName)}
                    </div>
                    ${catName ? `<div class="text-[11px] text-[#9497ad] line-clamp-1 truncate">${escapeHtml(catName)}</div>` : ''}
                </div>
                <div class="text-right shrink-0">
                    <div class="text-[13px] font-bold text-[#ea207e] leading-tight">${price} ₼</div>
                    ${oldPrice ? `<div class="text-[10.5px] text-[#9497ad] line-through leading-tight">${oldPrice} ₼</div>` : ''}
                </div>
            </a>
        `;
    }).join('');

    const viewAllBtn = `
        <div class="p-2.5 bg-[#fafbfc] border-t border-[#f1f2f3] text-center">
            <button type="button" class="view-all-search-btn text-[12px] font-bold text-[#ea207e] hover:underline flex items-center justify-center gap-1 w-full py-1">
                <span>Bütün nəticələrə bax (${matches.length} məhsul)</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
        </div>
    `;

    dropdown.innerHTML = `
        <div class="p-2 bg-gray-50 border-b border-[#f1f2f3] text-[11px] font-bold text-[#71717a] flex justify-between items-center">
            <span>Tapılan məhsullar</span>
            <span class="bg-[#ea207e] text-white text-[10px] px-1.5 py-0.5 rounded-full">${matches.length}</span>
        </div>
        <div class="max-h-[340px] overflow-y-auto">
            ${itemsHtml}
        </div>
        ${viewAllBtn}
    `;

    dropdown.classList.remove('hidden');

    const allBtn = dropdown.querySelector('.view-all-search-btn');
    if (allBtn) {
        allBtn.addEventListener('click', (e) => {
            e.preventDefault();
            executeSearch(query);
            dropdown.classList.add('hidden');
        });
    }
}

function hideSearchDropdown(form) {
    const dropdown = form ? form.querySelector('.search-autocomplete-dropdown') : null;
    if (dropdown) dropdown.classList.add('hidden');
}

function executeSearch(query) {
    if (!query || query.trim() === '') return;
    const q = query.trim();

    const isIndexPage = !!document.getElementById('search-results-section');

    if (!isIndexPage) {
        window.location.href = `index.html?q=${encodeURIComponent(q)}`;
        return;
    }

    document.querySelectorAll('.search-autocomplete-dropdown').forEach(d => d.classList.add('hidden'));

    document.querySelectorAll('.QuickSearch-Input, form.QuickSearch input[type="search"]').forEach(inp => {
        inp.value = q;
    });

    fetchAllSearchCatalog().then(() => {
        const matches = searchProductsInCatalog(q);
        renderSearchResultsPage(q, matches);

        try {
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('q', q);
            window.history.pushState({ search: q }, '', newUrl.toString());
        } catch (e) {}
    });
}

function renderSearchResultsPage(query, matches) {
    const section = document.getElementById('search-results-section');
    const landing = document.querySelector('.MarketPlaceLanding');
    const titleEl = document.getElementById('search-results-title');
    const countEl = document.getElementById('search-results-count');
    const gridEl = document.getElementById('search-results-grid');
    const emptyEl = document.getElementById('search-empty-state');
    if (!section || !gridEl) return;

    section.classList.remove('hidden');
    if (landing) landing.classList.add('hidden');

    if (titleEl) titleEl.textContent = `Axtarış: "${query}"`;
    if (countEl) countEl.textContent = `${matches.length} məhsul`;

    if (matches.length === 0) {
        gridEl.innerHTML = '';
        gridEl.classList.add('hidden');
        if (emptyEl) {
            emptyEl.classList.remove('hidden');
            emptyEl.classList.add('flex');
        }
    } else {
        if (emptyEl) emptyEl.classList.add('hidden');
        gridEl.classList.remove('hidden');
        gridEl.innerHTML = matches.map(p => createProductCard(p, { isSlider: false })).join('');
    }

    section.scrollIntoView({ behavior: 'smooth' });
}

function closeSearchResults() {
    const section = document.getElementById('search-results-section');
    const landing = document.querySelector('.MarketPlaceLanding');
    if (section) section.classList.add('hidden');
    if (landing) landing.classList.remove('hidden');

    document.querySelectorAll('.QuickSearch-Input, form.QuickSearch input[type="search"]').forEach(inp => {
        inp.value = '';
    });

    try {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('q');
        window.history.pushState({}, '', newUrl.pathname);
    } catch (e) {}
}

function initSearch() {
    fetchAllSearchCatalog();

    const forms = document.querySelectorAll('form.QuickSearch');
    forms.forEach(form => {
        const input = form.querySelector('.QuickSearch-Input, input[type="search"]');
        if (!input) return;

        let debounceTimer = null;
        input.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            const val = e.target.value.trim();
            if (val.length >= 1) {
                debounceTimer = setTimeout(() => {
                    fetchAllSearchCatalog().then(() => {
                        const matches = searchProductsInCatalog(val);
                        renderSearchDropdown(form, val, matches);
                    });
                }, 120);
            } else {
                hideSearchDropdown(form);
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = input.value.trim();
            if (val) {
                executeSearch(val);
            }
        });

        const btn = form.querySelector('button');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const val = input.value.trim();
                if (val) {
                    executeSearch(val);
                }
            });
        }
    });

    const clearBtn = document.getElementById('search-clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', closeSearchResults);
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('form.QuickSearch')) {
            document.querySelectorAll('.search-autocomplete-dropdown').forEach(d => d.classList.add('hidden'));
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.search-autocomplete-dropdown').forEach(d => d.classList.add('hidden'));
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const initialQ = urlParams.get('q');
    if (initialQ && initialQ.trim()) {
        const qVal = initialQ.trim();
        document.querySelectorAll('.QuickSearch-Input, form.QuickSearch input[type="search"]').forEach(inp => {
            inp.value = qVal;
        });
        fetchAllSearchCatalog().then(() => {
            executeSearch(qVal);
        });
    }
}

window.executeSearch = executeSearch;
window.closeSearchResults = closeSearchResults;
window.fetchAllSearchCatalog = fetchAllSearchCatalog;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
} else {
    initSearch();
}

/* ==========================================================================
   Mobile Burger Menu Drawer Logic
   ========================================================================== */
function openBurgerMenu(e) {
    if (e) {
        if (typeof e.preventDefault === 'function') e.preventDefault();
        if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    const backdrop = document.getElementById('burger-drawer-backdrop');
    if (backdrop) {
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
        try {
            const currentLang = localStorage.getItem('birmarket_lang') || 'az';
            updateDrawerLangDisplay(currentLang);
            updateFavoritesCount();
            updateCartBadge();
        } catch (err) {
            console.error('Error updating drawer contents:', err);
        }
    } else {
        console.warn('burger-drawer-backdrop element not found!');
    }
}

function closeBurgerMenu(e) {
    if (e) {
        if (typeof e.preventDefault === 'function') e.preventDefault();
        if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    const backdrop = document.getElementById('burger-drawer-backdrop');
    if (backdrop) {
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function toggleBurgerMenu(e) {
    if (e) {
        if (typeof e.preventDefault === 'function') e.preventDefault();
        if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    const backdrop = document.getElementById('burger-drawer-backdrop');
    if (backdrop && backdrop.classList.contains('active')) {
        closeBurgerMenu(e);
    } else {
        openBurgerMenu(e);
    }
}

function toggleDrawerPhone() {
    const dd = document.getElementById('drawer-phone-dropdown');
    const chev = document.getElementById('drawer-phone-chevron');
    if (dd) {
        dd.classList.toggle('hidden');
        if (chev) {
            chev.style.transform = dd.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    }
}

function toggleDrawerLangMenu() {
    const dd = document.getElementById('drawer-lang-dropdown');
    const chev = document.getElementById('drawer-lang-chevron');
    if (dd) {
        dd.classList.toggle('hidden');
        if (chev) {
            chev.style.transform = dd.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    }
}

function selectDrawerLang(lang) {
    if (typeof setLanguage === 'function') {
        setLanguage(lang);
    }
    localStorage.setItem('birmarket_lang', lang);
    updateDrawerLangDisplay(lang);
    const dd = document.getElementById('drawer-lang-dropdown');
    const chev = document.getElementById('drawer-lang-chevron');
    if (dd) dd.classList.add('hidden');
    if (chev) chev.style.transform = 'rotate(0deg)';
}

function updateDrawerLangDisplay(lang) {
    const flagEl = document.getElementById('drawer-current-flag');
    const textEl = document.getElementById('drawer-current-lang-text');
    if (lang === 'ru') {
        if (flagEl) flagEl.src = 'img/flag_ru.svg';
        if (textEl) textEl.textContent = 'RU';
    } else {
        if (flagEl) flagEl.src = 'img/flag_az.svg';
        if (textEl) textEl.textContent = 'AZ';
    }
}

function initBurgerMenu() {
    const backdrop = document.getElementById('burger-drawer-backdrop');
    if (backdrop) {
        backdrop.onclick = function(e) {
            if (e.target === backdrop) {
                closeBurgerMenu(e);
            }
        };
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeBurgerMenu();
        }
    });

    const currentLang = localStorage.getItem('birmarket_lang') || 'az';
    updateDrawerLangDisplay(currentLang);
    updateFavoritesCount();
    updateCartBadge();
}

/* ==========================================================================
   Campaign Countdown Timer (Counts down to 00:00:00 midnight every day)
   ========================================================================== */
function getMidnightCountdown() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // Sets to 00:00:00 of tomorrow
    
    let diff = midnight.getTime() - now.getTime();
    if (diff <= 0) {
        diff = 24 * 3600 * 1000;
    }
    
    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function initCampaignCountdownTimer() {
    function updateTimers() {
        const timeStr = getMidnightCountdown();
        const mainTimer = document.getElementById('campaign-countdown-timer');
        if (mainTimer) {
            mainTimer.textContent = timeStr;
        }
        document.querySelectorAll('.campaign-countdown-timer-val').forEach(el => {
            el.textContent = timeStr;
        });
    }

    updateTimers();
    setInterval(updateTimers, 1000);
}

window.getMidnightCountdown = getMidnightCountdown;
window.initCampaignCountdownTimer = initCampaignCountdownTimer;
window.openBurgerMenu = openBurgerMenu;
window.closeBurgerMenu = closeBurgerMenu;
window.toggleBurgerMenu = toggleBurgerMenu;
window.toggleDrawerPhone = toggleDrawerPhone;
window.toggleDrawerLangMenu = toggleDrawerLangMenu;
window.selectDrawerLang = selectDrawerLang;
window.updateDrawerLangDisplay = updateDrawerLangDisplay;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initBurgerMenu();
        initCampaignCountdownTimer();
    });
} else {
    initBurgerMenu();
    initCampaignCountdownTimer();
}

document.addEventListener('click', function(e) {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href === '#' || href === 'javascript:void(0)' || href.startsWith('javascript:')) {
        if (href === '#') e.preventDefault();
        return;
    }
    if (href.startsWith('tel:') || href.startsWith('mailto:')) return;
    const allowed = ['index.html', 'cart.html', 'product.html', 'favorites.html', 'auth.html', './'];
    const isAllowed = allowed.some(page => href === page || href.startsWith(page + '?') || href.startsWith(page + '#'));
    if (!isAllowed) {
        e.preventDefault();
    }
});


