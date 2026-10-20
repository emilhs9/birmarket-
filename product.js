let currentProduct = null;
let currentReviews = [];
let allCatalogProducts = [];
const positiveReviewsPool = [
    {
        author: "Rəşad",
        seller: "Metal.az",
        stars: 5,
        date: "19 iyul 2026",
        text: "əla super",
        likes: 0
    },
    {
        author: "Orxan",
        seller: "Metal.az",
        stars: 5,
        date: "16 may 2026",
        text: "əla idi super yaxşıki sifariş verdim",
        likes: 0
    },
    {
        author: "LUMUXANIM",
        seller: "Metal.az",
        stars: 5,
        date: "27 mart 2026",
        text: "yaxsidi beyendik.",
        likes: 0
    },
    {
        author: "Nigar M.",
        seller: "Bazar Shop",
        stars: 5,
        date: "14 fevral 2026",
        text: "Keyfiyyəti gözlədiyimdən də yaxşı çıxdı. Hər kəsə tövsiyə edirəm!",
        likes: 4
    },
    {
        author: "Elvin Q.",
        seller: "Metal.az",
        stars: 4,
        date: "22 yanvar 2026",
        text: "Çox razı qaldım, qablaşdırma və vaxtında çatdırılma əla səviyyədə idi.",
        likes: 2
    },
    {
        author: "Aysel K.",
        seller: "Line Electronics",
        stars: 4,
        date: "10 dekabr 2025",
        text: "Qiymətinə görə çox münasib və keyfiyyətli məhsuldur, bəyəndik.",
        likes: 1
    },
    {
        author: "Murad Ə.",
        seller: "Metal.az",
        stars: 5,
        date: "28 noyabr 2025",
        text: "Hər şey qaydasındadır, istifadəsi çox rahat və əlverişlidir.",
        likes: 3
    }
];
const negativeReviewsPool = [
    {
        author: "Zaur RZAYEV",
        seller: "Metal.az",
        stars: 1,
        date: "08 dekabr 2025",
        text: "Məhsulun çatdırılması və xidmət super. Amma məhsul özü çox səviyyəsizdir Şəkildə əla görsənir lakin məşq zamanı dəstlərin hamısın taxanda əyilir qantel çünki rezindir. Ancaq ştanqa kimi istifadə etmək olar. Şinaya işləmək olmur .",
        likes: 0
    },
    {
        author: "Fərid S.",
        seller: "Bazar Shop",
        stars: 2,
        date: "15 oktyabr 2025",
        text: "Təsvirdəki kimi deyil, materialı zəifdir. Razı qalmadım.",
        likes: 3
    },
    {
        author: "Samirə H.",
        seller: "Line Electronics",
        stars: 1,
        date: "02 sentyabr 2025",
        text: "Gözləntimi doğrultmadı, rəngi və keyfiyyəti şəkildəkindən fərqlidir.",
        likes: 4
    },
    {
        author: "Vüsal B.",
        seller: "Metal.az",
        stars: 2,
        date: "19 avqust 2025",
        text: "Qutusu əzilmiş vəziyyətdə çatdırıldı, materialı da o qədər möhkəm deyil.",
        likes: 1
    },
    {
        author: "------",
        seller: "Metal.az",
        stars: 1,
        date: "03 dekabr 2025",
        text: "Çox narazı qaldım, çatdırılma gecikdi və istədiyim kimi çıxmadı.",
        likes: 0
    }
];
function generateProductReviews(productId) {
    const seed = Number(productId) || 12345;
    const posCount = 3 + (seed % 3);
    const negCount = 1 + (seed % 3);

    const selectedPos = [];
    for (let i = 0; i < posCount; i++) {
        const item = positiveReviewsPool[(seed + i * 2) % positiveReviewsPool.length];
        selectedPos.push({ ...item, id: `pos-${i}` });
    }

    const selectedNeg = [];
    for (let i = 0; i < negCount; i++) {
        const item = negativeReviewsPool[(seed + i * 3) % negativeReviewsPool.length];
        selectedNeg.push({ ...item, id: `neg-${i}` });
    }

    const mixed = [];
    const maxLen = Math.max(selectedPos.length, selectedNeg.length);
    for (let i = 0; i < maxLen; i++) {
        if (i < selectedPos.length) mixed.push(selectedPos[i]);
        if (i < selectedNeg.length) mixed.push(selectedNeg[i]);
    }

    return mixed;
}

function renderStarsHtml(ratingScore) {
    const rounded = Math.round(ratingScore);
    let html = '';
    for (let i = 1; i <= 5; i++) {
        const color = i <= rounded ? '#ff9800' : '#DCDDE4';
        html += `<svg width="15" height="15" fill="${color}" viewBox="0 0 24 24" class="mr-0.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    }
    return html;
}

function renderReviewSingleStars(starsCount) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        const color = i <= starsCount ? '#ff9800' : '#DCDDE4';
        html += `<svg width="14" height="14" fill="${color}" viewBox="0 0 24 24" class="mr-0.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    }
    return html;
}

async function fetchAllCatalogProducts() {
    try {
        let salesRes = { products: [] };
        let megaRes = { products: [] };
        let topRes = { products: [] };
        let customRes = { discountedProducts: [], newProducts: [], bestSellerProducts: [] };

        if (window.BIRMARKET_DATA) {
            customRes = {
                discountedProducts: window.BIRMARKET_DATA.discountedProducts || [],
                newProducts: window.BIRMARKET_DATA.newProducts || [],
                bestSellerProducts: window.BIRMARKET_DATA.bestSellerProducts || []
            };
            megaRes = { products: window.BIRMARKET_DATA.megaProducts || [] };
            topRes = { products: window.BIRMARKET_DATA.topProducts || [] };
            salesRes = { products: window.BIRMARKET_DATA.discountedProducts || [] };
        } else {
            const [s, m, t, c] = await Promise.all([
                fetch('salesofday.json').then(r => r.json()).catch(() => ({ products: [] })),
                fetch('megadiscounts.json').then(r => r.json()).catch(() => ({ products: [] })),
                fetch('top.json').then(r => r.json()).catch(() => ({ products: [] })),
                fetch('products.json').then(r => r.json()).catch(() => ({ discountedProducts: [], newProducts: [], bestSellerProducts: [] }))
            ]);
            salesRes = s; megaRes = m; topRes = t; customRes = c;
        }

        const disc = (customRes.discountedProducts || []).map(p => ({
            ...p,
            id: `disc_${p.id}`,
            alias_id: String(p.id),
            name: p.title,
            default_offer: {
                retail_price: p.price,
                old_price: p.oldPrice,
                installment_enabled: !!p.installment,
                max_installment_months: p.installment ? p.installment.months : 24
            }
        }));
        const newP = (customRes.newProducts || []).map(p => ({
            ...p,
            id: `new_${p.id}`,
            alias_id: String(p.id),
            name: p.title,
            default_offer: {
                retail_price: p.price,
                old_price: p.oldPrice,
                installment_enabled: !!p.installment,
                max_installment_months: p.installment ? p.installment.months : 24
            }
        }));
        const best = (customRes.bestSellerProducts || []).map(p => ({
            ...p,
            id: `best_${p.id}`,
            alias_id: String(p.id),
            name: p.title,
            default_offer: {
                retail_price: p.price,
                old_price: p.oldPrice,
                installment_enabled: !!p.installment,
                max_installment_months: p.installment ? p.installment.months : 24
            }
        }));
        const cartP = (customRes.cartProducts || []).map(p => ({
            ...p,
            id: `cart_${p.id}`,
            alias_id: String(p.id),
            name: p.title,
            default_offer: {
                retail_price: p.price,
                old_price: p.oldPrice,
                installment_enabled: !!p.installment,
                max_installment_months: p.installment ? p.installment.months : 24
            }
        }));

        const combined = [
            ...disc,
            ...newP,
            ...best,
            ...cartP,
            ...(salesRes.products || []),
            ...(megaRes.products || []),
            ...(topRes.products || [])
        ];
        const unique = [];
        const seen = new Set();
        combined.forEach(p => {
            if (p && p.id && !seen.has(String(p.id))) {
                seen.add(String(p.id));
                unique.push(p);
                window.allProductsMap[p.id] = p;
                if (p.alias_id && !window.allProductsMap[p.alias_id]) {
                    window.allProductsMap[p.alias_id] = p;
                }
            }
        });

        allCatalogProducts = unique;
        return unique;
    } catch (e) {
        console.error("Məhsul yükləmə xətası:", e);
        return [];
    }
}

function getProductBrand(product) {
    if (product.brand) {
        return typeof product.brand === 'object' ? (product.brand.name || 'BirMarket') : product.brand;
    }
    const name = product.name || product.title || '';
    const knownBrands = [
        'Kumtel', 'Xiaomi', 'Redmi', 'Apple', 'Samsung', 'Philips', 'Bosch', 'Sony', 'LG',
        'Braun', 'Tefal', 'HP', 'Lenovo', 'Asus', 'Acer', 'Dell', 'Canon', 'Nikon',
        'Beko', 'Gorenje', 'Electrolux', 'Dyson', 'Anker', 'Baseus', 'JBL', 'Marshall',
        'Panasonic', 'Remington', 'Karcher', 'DeLonghi', 'Rowenta', 'Midea', 'Haier',
        'Hisense', 'TCL', 'Huawei', 'Honor', 'Realme', 'OPPO', 'Poco', 'Intex', 'Bestway', 'Borofone'
    ];
    for (const b of knownBrands) {
        const regex = new RegExp(`\\b${b}\\b`, 'i');
        if (regex.test(name)) {
            return b;
        }
    }
    return 'BirMarket';
}

function extractProductAttributes(product) {
    const text = `${product.name || product.title || ''} ${product.desc || ''}`;
    const attrs = [];

    const dimMatch = text.match(/\b\d+(\.\d+)?\s*x\s*\d+(\.\d+)?(\s*x\s*\d+(\.\d+)?)?\s*sm\b/i);
    if (dimMatch) {
        attrs.push({ key: "Ölçü:", val: dimMatch[0] });
    }

    const powerMatch = text.match(/\b\d+(\.\d+)?\s*(W|Vt|Vatt|Watt)\b/i);
    if (powerMatch) {
        attrs.push({ key: "Güc:", val: powerMatch[0] });
    }

    const weightMatch = text.match(/\b\d+(\.\d+)?\s*(kq|kg)\b/i);
    if (weightMatch) {
        attrs.push({ key: "Çəki:", val: weightMatch[0] });
    }

    const memMatch = text.match(/\b\d+\s*GB\s*\/\s*\d+\s*(GB|TB)\b/i);
    if (memMatch) {
        attrs.push({ key: "Yaddaş:", val: memMatch[0] });
    }

    return attrs;
}

function renderShortSpecs(product) {
    const grid = document.getElementById('product-short-specs-grid');
    if (!grid) return;

    const brand = getProductBrand(product);
    const catName = typeof product.category === 'object' ? (product.category.name || 'Məhsullar') : (product.category || 'Məhsullar');
    const delivery = product.delivery ? `Kuryerlə (${product.delivery})` : 'Sabah, pulsuz';
    const condition = product.isNew ? 'Yeni' : 'Orijinal';

    const items = [
        { label: 'Brend:', value: brand },
        { label: 'Tip:', value: catName },
        { label: 'Çatdırılma:', value: delivery },
        { label: 'Vəziyyəti:', value: condition }
    ];

    const extraAttrs = extractProductAttributes(product);
    extraAttrs.forEach(a => {
        items.push({ label: a.key, value: a.val });
    });

    if (product.installment) {
        items.push({ label: 'Taksit:', value: `${product.installment.monthly} ₼ x ${product.installment.months} ay` });
    }

    grid.innerHTML = items.map(item => `
        <div>${item.label}</div>
        <div class="font-medium text-[#1E244D] truncate pr-2">${item.value}</div>
    `).join('');
}

function renderProductDetail(product) {
    currentProduct = product;
    const prodName = product.name || product.title;
    document.title = `${prodName} | Birmarket`;
    const catName = typeof product.category === 'object' ? (product.category.name || 'Məhsullar') : (product.category || 'Məhsullar');
    document.getElementById('breadcrumb-category').textContent = catName;
    document.getElementById('breadcrumb-title').textContent = prodName;
    let imgList = [];
    if (product.image) {
        imgList = [product.image];
    } else if (product.images && product.images.length > 0) {
        imgList = product.images.map(img => (typeof img === 'string' ? img : (img.big || img.medium || img.small)));
    } else if (product.main_img) {
        imgList = [product.main_img.big || product.main_img.medium || product.main_img.small];
    }
    if (imgList.length === 0) {
        imgList = ['img/placeholder.png'];
    }

    const mainImgEl = document.getElementById('product-main-img');
    mainImgEl.src = imgList[0];
    mainImgEl.alt = prodName;
    const thumbsContainer = document.getElementById('product-thumbnails');
    thumbsContainer.innerHTML = imgList.map((src, idx) => `
        <div onclick="selectImage('${src}', this)" class="thumb-item w-[56px] h-[56px] border rounded-[8px] p-1 flex items-center justify-center cursor-pointer transition-all bg-white hover:border-[#ea207e] ${idx === 0 ? 'border-[#ea207e] ring-2 ring-[#ea207e]/30' : 'border-[#E5E7EB]'}">
            <img src="${src}" class="max-h-full max-w-full object-contain mix-blend-multiply" alt="">
        </div>
    `).join('');
    const retail = (product.price !== undefined && product.price !== null)
        ? Number(product.price)
        : ((product.default_offer && product.default_offer.retail_price) ? Number(product.default_offer.retail_price) : 139.50);
    const oldPrice = (product.oldPrice !== undefined && product.oldPrice !== null)
        ? Number(product.oldPrice)
        : ((product.default_offer && product.default_offer.old_price) ? Number(product.default_offer.old_price) : 0);
    
    let maxMonths = (product.default_offer && product.default_offer.max_installment_months) ? product.default_offer.max_installment_months : 24;
    let monthlyVal = (retail / maxMonths).toFixed(2);
    if (product.installment && product.installment.monthly) {
        monthlyVal = Number(product.installment.monthly).toFixed(2);
        maxMonths = product.installment.months || 24;
    }

    document.getElementById('badge-monthly-val').textContent = monthlyVal;
    document.getElementById('badge-installment').textContent = `${maxMonths} aylıq taksit`;

    const discountVal = (product.discount !== undefined && product.discount !== null)
        ? Number(product.discount)
        : ((oldPrice > retail) ? Math.round(((oldPrice - retail) / oldPrice) * 100) : 0);
    const badgeDiscountEl = document.getElementById('badge-discount');
    if (badgeDiscountEl) {
        if (discountVal > 0) {
            badgeDiscountEl.textContent = `-${discountVal}%`;
            badgeDiscountEl.classList.remove('hidden');
        } else {
            badgeDiscountEl.classList.add('hidden');
        }
    }

    document.getElementById('buybox-price').innerHTML = `${retail.toFixed(2)} <span class="text-[20px] font-normal">₼</span>`;
    const oldEl = document.getElementById('buybox-old-price');
    if (oldPrice > retail) {
        oldEl.textContent = `${oldPrice.toFixed(2)} ₼`;
        oldEl.classList.remove('hidden');
    } else {
        oldEl.classList.add('hidden');
    }

    document.getElementById('buybox-installment-badge').textContent = `${monthlyVal} ₼ x ${maxMonths} ay`;

    const s1Price = retail.toFixed(2);
    const s1Installment = `${(retail / maxMonths).toFixed(2)} ₼ x ${maxMonths} ay`;
    document.getElementById('other-seller-1-price').textContent = `${s1Price} ₼`;
    document.getElementById('other-seller-1-installment').textContent = s1Installment;

    const s2Price = (retail * 1.0035).toFixed(2);
    const s2Old = oldPrice > 0 ? oldPrice.toFixed(2) : (retail * 1.61).toFixed(2);
    const s2Installment = `${(retail * 1.0035 / maxMonths).toFixed(2)} ₼ x ${maxMonths} ay`;
    document.getElementById('other-seller-2-price').textContent = `${s2Price} ₼`;
    document.getElementById('other-seller-2-old').textContent = `${s2Old} ₼`;
    document.getElementById('other-seller-2-installment').textContent = s2Installment;

    const deliveryText = product.delivery ? `🚚 Kuryerlə, ${product.delivery}, pulsuz` : '🚚 Kuryerlə, sabah, pulsuz';
    document.querySelectorAll('.other-seller-delivery').forEach(el => {
        el.textContent = deliveryText;
    });

    document.getElementById('product-name').textContent = prodName;
    document.getElementById('product-id-display').textContent = product.id;
    
    renderShortSpecs(product);

    currentReviews = generateProductReviews(product.id);
    const totalStarsSum = currentReviews.reduce((sum, r) => sum + r.stars, 0);
    const ratingScore = (product.rating !== undefined && product.rating !== null)
        ? Number(product.rating).toFixed(1)
        : (product.ratings && product.ratings.rating_value ? Number(product.ratings.rating_value).toFixed(1) : (totalStarsSum / currentReviews.length).toFixed(1));
    const reviewCount = (product.reviewCount !== undefined && product.reviewCount !== null)
        ? Number(product.reviewCount)
        : (product.ratings && product.ratings.reviews_count ? Number(product.ratings.reviews_count) : currentReviews.length);
    const totalRatingsCount = reviewCount > 0 ? (reviewCount + 13) : 0;

    const starsHtml = renderStarsHtml(ratingScore);
    document.getElementById('product-stars-container').innerHTML = starsHtml;
    document.getElementById('product-avg-rating').textContent = ratingScore;
    document.getElementById('product-reviews-count').textContent = reviewCount;
    document.getElementById('tab-reviews-badge').textContent = reviewCount;
    document.getElementById('overview-summary-score').textContent = ratingScore;
    document.getElementById('overview-summary-count').textContent = `${totalRatingsCount} reytinq • ${reviewCount} rəy`;
    document.getElementById('full-summary-score').textContent = ratingScore;
    document.getElementById('full-summary-count').textContent = `${totalRatingsCount} reytinq • ${reviewCount} rəy`;

    selectCreditMonth(maxMonths || 24);
    renderReviewsList(currentReviews);
    renderSpecsTable(product);
    renderDescriptionText(product);
    updateDetailFavoriteButton();
    renderRelatedProducts(product.id);
    document.getElementById('product-loading').classList.add('hidden');
    document.getElementById('product-main-content').classList.remove('hidden');
}

function selectImage(src, el) {
    document.getElementById('product-main-img').src = src;
    document.querySelectorAll('.thumb-item').forEach(item => {
        item.classList.remove('border-[#ea207e]', 'ring-2', 'ring-[#ea207e]/30');
        item.classList.add('border-[#E5E7EB]');
    });
    if (el) {
        el.classList.remove('border-[#E5E7EB]');
        el.classList.add('border-[#ea207e]', 'ring-2', 'ring-[#ea207e]/30');
    }
}

function selectCreditMonth(months) {
    if (!currentProduct) return;
    const retail = (currentProduct.price !== undefined && currentProduct.price !== null)
        ? Number(currentProduct.price)
        : ((currentProduct.default_offer && currentProduct.default_offer.retail_price) ? Number(currentProduct.default_offer.retail_price) : 139.50);
    const monthly = (retail / months).toFixed(2);

    document.querySelectorAll('.credit-btn').forEach(btn => {
        const m = btn.getAttribute('data-months');
        if (Number(m) === Number(months)) {
            btn.classList.add('active', 'border-[#ea207e]', 'bg-[#ffcc00]');
            btn.classList.remove('border-[#E5E7EB]');
        } else {
            btn.classList.remove('active', 'border-[#ea207e]', 'bg-[#ffcc00]');
            btn.classList.add('border-[#E5E7EB]');
        }
    });

    document.getElementById('buybox-installment-badge').textContent = `${monthly} ₼ x ${months} ay`;
}

function renderReviewsList(reviews) {
    const html = reviews.map((r, idx) => `
        <div class="border-b border-[#f1f2f3] pb-5 last:border-none">
            <div class="flex items-center justify-between mb-1">
                <div>
                    <h4 class="font-bold text-[14px] text-[#1E244D]">${r.author}</h4>
                    <span class="text-[12px] text-[#71717A]">Satıcı: <strong class="font-medium text-[#1E244D]">${r.seller}</strong></span>
                </div>
                <div class="flex items-center gap-3">
                    <div class="flex">${renderReviewSingleStars(r.stars)}</div>
                    <span class="text-[12px] text-[#71717A]">${r.date}</span>
                </div>
            </div>
            
            <p class="text-[13px] text-[#1E244D] mt-2 leading-[1.6]">${r.text}</p>
            
            <div class="mt-3">
                <button onclick="handleLikeReview(this)" class="inline-flex items-center gap-1.5 text-[12px] text-[#71717A] hover:text-[#ea207e] transition-colors cursor-pointer">
                    <span>Rəy faydalıdır?</span>
                    <span class="text-[14px]">👍</span>
                    <span class="like-num font-semibold text-[#1E244D]">${r.likes}</span>
                </button>
            </div>
        </div>
    `).join('');

    const overviewEl = document.getElementById('overview-reviews-list');
    const fullEl = document.getElementById('full-reviews-list');
    if (overviewEl) overviewEl.innerHTML = html;
    if (fullEl) fullEl.innerHTML = html;
}

function handleLikeReview(btn) {
    const numEl = btn.querySelector('.like-num');
    if (numEl) {
        let count = parseInt(numEl.textContent) || 0;
        count++;
        numEl.textContent = count;
        btn.classList.add('text-[#ea207e]');
    }
}

function renderSpecsTable(product) {
    const brand = getProductBrand(product);
    const type = typeof product.category === 'object' ? (product.category.name || 'Standart') : (product.category || 'Standart');
    const retail = (product.price !== undefined && product.price !== null)
        ? Number(product.price)
        : ((product.default_offer && product.default_offer.retail_price) ? Number(product.default_offer.retail_price) : 139.50);
    const oldPrice = (product.oldPrice !== undefined && product.oldPrice !== null)
        ? Number(product.oldPrice)
        : ((product.default_offer && product.default_offer.old_price) ? Number(product.default_offer.old_price) : 0);
    const discountVal = (product.discount !== undefined && product.discount !== null)
        ? Number(product.discount)
        : ((oldPrice > retail) ? Math.round(((oldPrice - retail) / oldPrice) * 100) : 0);
    const ratingScore = (product.rating !== undefined && product.rating !== null)
        ? Number(product.rating).toFixed(1)
        : (product.ratings && product.ratings.rating_value ? Number(product.ratings.rating_value).toFixed(1) : 5.0);
    const reviewCount = (product.reviewCount !== undefined && product.reviewCount !== null)
        ? Number(product.reviewCount)
        : (product.ratings && product.ratings.reviews_count ? Number(product.ratings.reviews_count) : currentReviews.length);

    const specsData = [
        { key: "Brend:", val: brand },
        { key: "Kateqoriya / Tip:", val: type },
        { key: "Çatdırılma:", val: product.delivery ? `Kuryerlə (${product.delivery}), pulsuz` : "Sabah, pulsuz" },
        { key: "Vəziyyəti:", val: product.isNew ? "Yeni" : "Orijinal" },
        { key: "Qiymət:", val: `${retail.toFixed(2)} ₼` }
    ];

    if (oldPrice > retail) {
        specsData.push({ key: "İlkin qiymət:", val: `${oldPrice.toFixed(2)} ₼` });
    }
    if (discountVal > 0) {
        specsData.push({ key: "Endirim:", val: `-${discountVal}%` });
    }
    if (product.timer) {
        const timerVal = (typeof window.getMidnightCountdown === 'function') ? window.getMidnightCountdown() : (product.timer || '00:00:00');
        specsData.push({ key: "Kampaniya vaxtı:", val: `<span class="campaign-countdown-timer-val">${timerVal}</span>` });
    }

    const extraAttrs = extractProductAttributes(product);
    extraAttrs.forEach(a => {
        specsData.push({ key: a.key, val: a.val });
    });

    specsData.push({ key: "Reytinq balı:", val: `${ratingScore} / 5` });
    specsData.push({ key: "Rəy sayı:", val: `${reviewCount} rəy` });
    specsData.push({ key: "Taksit imkanı:", val: product.installment ? `${product.installment.monthly} ₼ x ${product.installment.months} ay` : "Mövcuddur" });
    specsData.push({ key: "Zəmanət:", val: "12 ay rəsmi distribütor" });
 
    const half = Math.ceil(specsData.length / 2);
    const col1 = specsData.slice(0, half);
    const col2 = specsData.slice(half);

    const tableHtml = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 text-[13px] border border-[#f1f2f3] rounded-[10px] overflow-hidden">
            <div class="divide-y divide-[#f1f2f3]">
                ${col1.map((row, i) => `
                    <div class="flex items-center justify-between p-3.5 ${i % 2 === 0 ? 'bg-[#FAFAFC]' : 'bg-white'}">
                        <span class="text-[#71717A]">${row.key}</span>
                        <span class="font-medium text-[#1E244D]">${row.val}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="divide-y divide-[#f1f2f3]">
                ${col2.map((row, i) => `
                    <div class="flex items-center justify-between p-3.5 ${i % 2 === 0 ? 'bg-[#FAFAFC]' : 'bg-white'}">
                        <span class="text-[#71717A]">${row.key}</span>
                        <span class="font-medium text-[#1E244D]">${row.val}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    const overviewSpecs = document.getElementById('overview-specs-table');
    const fullSpecs = document.getElementById('full-specs-table');
    if (overviewSpecs) overviewSpecs.innerHTML = tableHtml;
    if (fullSpecs) fullSpecs.innerHTML = tableHtml;

    const sellersTableBody = document.getElementById('sellers-full-table-body');
    if (sellersTableBody) {
        const pPrice = retail;
        const deliveryStr = product.delivery ? `🚚 Kuryerlə, ${product.delivery}, pulsuz` : '🚚 Kuryerlə, sabah, pulsuz';
        const instMonths = (product.installment && product.installment.months) ? product.installment.months : 24;
        const instMonthly = (product.installment && product.installment.monthly) ? product.installment.monthly : (pPrice / instMonths).toFixed(2);
        sellersTableBody.innerHTML = `
            <tr class="hover:bg-[#fafbfc]">
                <td class="p-3.5 font-bold text-[#1E244D]">BirMarket Rəsmi <span class="text-[#00B067] text-[11px] ml-1">👍 99%</span></td>
                <td class="p-3.5 text-[#50557A]">${deliveryStr}</td>
                <td class="p-3.5 font-semibold text-[#ff9800]">${instMonthly} ₼ x ${instMonths} ay</td>
                <td class="p-3.5 font-extrabold text-[#1E244D] text-[15px]">${pPrice.toFixed(2)} ₼</td>
                <td class="p-3.5 text-right">
                    <button onclick="handleBuyboxAddToCart()" class="bg-[#ea207e] hover:bg-[#d41c72] text-white font-bold text-[12px] px-4 py-2 rounded-[6px] transition-colors cursor-pointer">
                        Səbətə at
                    </button>
                </td>
            </tr>
            <tr class="hover:bg-[#fafbfc]">
                <td class="p-3.5 font-bold text-[#1E244D]">Bazar Shop <span class="text-[#00B067] text-[11px] ml-1">👍 95%</span></td>
                <td class="p-3.5 text-[#50557A]">${deliveryStr}</td>
                <td class="p-3.5 font-semibold text-[#ff9800]">${((pPrice * 1.05) / instMonths).toFixed(2)} ₼ x ${instMonths} ay</td>
                <td class="p-3.5 font-extrabold text-[#1E244D] text-[15px]">${(pPrice * 1.05).toFixed(2)} ₼</td>
                <td class="p-3.5 text-right">
                    <button onclick="handleBuyboxAddToCart()" class="bg-[#ea207e] hover:bg-[#d41c72] text-white font-bold text-[12px] px-4 py-2 rounded-[6px] transition-colors cursor-pointer">
                        Səbətə at
                    </button>
                </td>
            </tr>
        `;
    }
}

function renderDescriptionText(product) {
    const el = document.getElementById('overview-description-text');
    if (!el) return;

    if (product.desc) {
        el.textContent = product.desc;
    } else if (product.name && (product.name.toLowerCase().includes('qantel') || product.name.toLowerCase().includes('şəkildə'))) {
        el.textContent = "İdman avadanlığı komplekti ümumilikdə 50 kq çəkisi olan iki sökülə bilən qanteldən ibarətdir (hər bir qantel 25 kq ağırlığındadır). Qantellər davamlılıq və istifadənin təhlükəsizliyini təmin edən möhkəm plastikdən hazırlanmışdır. Rəng dizaynı - qara və qırmızı. Bu dəst idmanla məşğul olmaq və əzələləri gücləndirmək üçün idealdır. İstehsalçı - Çin";
    } else {
        const title = product.name || product.title || 'Məhsul';
        el.textContent = `${title} yüksək keyfiyyət və etibarlılığı ilə seçilir. Müasir standartlara tam cavab verən materiallardan hazırlanmışdır. Gündəlik istifadə və uzunmüddətli rahatlıq üçün ideal seçimdir. Rəsmi zəmanət ilə təqdim olunur.`;
    }
}

function switchTab(tabKey) {
    const keys = ['overview', 'specs', 'reviews', 'warranty', 'returns', 'sellers'];
    keys.forEach(k => {
        const btn = document.getElementById(`tab-nav-${k}`);
        const pane = document.getElementById(`tab-content-${k}`);
        if (btn) btn.classList.remove('active');
        if (pane) pane.classList.add('hidden');
    });

    const activeBtn = document.getElementById(`tab-nav-${tabKey}`);
    const activePane = document.getElementById(`tab-content-${tabKey}`);
    if (activeBtn) activeBtn.classList.add('active');
    if (activePane) activePane.classList.remove('hidden');
    const tabsSec = document.getElementById('tabs-section');
    if (tabsSec && window.scrollY < tabsSec.offsetTop - 150) {
        tabsSec.scrollIntoView({ behavior: 'smooth' });
    }
}

function renderRelatedProducts(currentId) {
    const grid = document.getElementById('related-products-grid');
    if (!grid) return;

    const filtered = allCatalogProducts.filter(p => String(p.id) !== String(currentId)).slice(0, 5);
    if (filtered.length > 0) {
        grid.innerHTML = filtered.map(p => createProductCard(p, { isSlider: false })).join('');
    }
}

function updateDetailFavoriteButton() {
    if (!currentProduct) return;
    const isFav = isProductFavorite(currentProduct.id);
    const iconContainer = document.getElementById('detail-fav-icon');
    const textEl = document.getElementById('detail-fav-text');

    if (isFav) {
        iconContainer.innerHTML = `<svg width="18" height="18" fill="#EA207E" stroke="#EA207E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
        iconContainer.classList.add('text-[#ea207e]');
        textEl.textContent = "Seçilmişlərdədir";
        textEl.classList.add('text-[#ea207e]', 'font-bold');
    } else {
        iconContainer.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
        iconContainer.classList.remove('text-[#ea207e]');
        textEl.textContent = "Seçilmişlərə əlavə et";
        textEl.classList.remove('text-[#ea207e]', 'font-bold');
    }
}

function toggleDetailFavorite() {
    if (!currentProduct) return;
    handleHeartClick(null, currentProduct.id);
    updateDetailFavoriteButton();
}

window.selectImage = selectImage;
window.selectCreditMonth = selectCreditMonth;
window.handleLikeReview = handleLikeReview;
window.switchTab = switchTab;
window.toggleDetailFavorite = toggleDetailFavorite;

document.addEventListener('DOMContentLoaded', async () => {
    updateFavoritesCount();

    const allProducts = await fetchAllCatalogProducts();

    const params = new URLSearchParams(window.location.search);
    const targetId = params.get('id');

    let foundProduct = null;
    if (targetId) {
        foundProduct = allProducts.find(p => String(p.id) === String(targetId) || (p.alias_id && String(p.alias_id) === String(targetId)));
    }

    if (!foundProduct && allProducts.length > 0) {
        foundProduct = allProducts[0];
    }

    if (foundProduct) {
        renderProductDetail(foundProduct);
        try {
            let rv = JSON.parse(localStorage.getItem('birmarket_recently_viewed')) || [];
            rv = rv.filter(item => String(item.id) !== String(foundProduct.id));
            rv.unshift(foundProduct);
            if (rv.length > 20) rv = rv.slice(0, 20);
            localStorage.setItem('birmarket_recently_viewed', JSON.stringify(rv));
        } catch (e) {
            console.warn('Could not save recently viewed item:', e);
        }
    } else {
        document.getElementById('product-loading').innerHTML = `
            <div class="text-center py-12">
                <p class="text-[#EA207E] font-bold text-[16px] mb-2">Məhsul tapılmadı</p>
                <a href="index.html" class="text-[13px] text-[#50557A] underline">Ana səhifəyə qayıt</a>
            </div>
        `;
    }
});

function handleBuyboxAddToCart() {
    if (!currentProduct) return;
    if (typeof addToCart === 'function') {
        addToCart(currentProduct, 1);
    }
    const btn = document.getElementById('add-to-cart-main-btn');
    if (btn) {
        const origHtml = btn.innerHTML;
        btn.innerHTML = `
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Səbətə əlavə edildi</span>
        `;
        btn.classList.add('bg-[#16A34A]');
        btn.classList.remove('bg-[#ea207e]');
        setTimeout(() => {
            btn.innerHTML = origHtml;
            btn.classList.remove('bg-[#16A34A]');
            btn.classList.add('bg-[#ea207e]');
        }, 1500);
    }
}

document.addEventListener('click', function(e) {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href === '#' || href === 'javascript:void(0)' || href.startsWith('javascript:')) {
        if (href === '#') e.preventDefault();
        return;
    }
    if (href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('#')) return;
    const allowed = ['index.html', 'cart.html', 'product.html', 'favorites.html', 'auth.html', './'];
    const isAllowed = allowed.some(page => href === page || href.startsWith(page + '?') || href.startsWith(page + '#'));
    if (!isAllowed) {
        e.preventDefault();
    }
});
