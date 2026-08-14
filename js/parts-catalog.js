/**
 * Walter Equipment WE10 / WE15 replacement-parts catalog.
 * Renders the verified static catalog and provides client-side search/filtering.
 */

'use strict';

(function initPartsCatalog() {
    const catalog = Array.isArray(window.WALTER_PARTS) ? window.WALTER_PARTS : [];
    const grid = document.getElementById('partsCatalogGrid');
    const search = document.getElementById('partsSearch');
    const filters = document.getElementById('partsCategoryFilters');
    const resultCount = document.getElementById('partsResultCount');
    const emptyState = document.getElementById('partsEmptyState');

    if (!grid || !search || !filters || !resultCount || !emptyState) return;

    let activeCategory = 'All Parts';

    function addText(parent, tag, className, value) {
        const element = document.createElement(tag);
        element.className = className;
        element.textContent = value;
        parent.appendChild(element);
        return element;
    }

    function addDetail(parent, label, value) {
        const row = document.createElement('p');
        row.className = 'parts-card-detail';
        const strong = document.createElement('strong');
        strong.textContent = `${label}: `;
        row.appendChild(strong);
        row.appendChild(document.createTextNode(value));
        parent.appendChild(row);
    }

    function buildCard(part, index) {
        const card = document.createElement('article');
        card.className = 'parts-card';

        const media = document.createElement('div');
        media.className = 'parts-card-media';
        const image = document.createElement('img');
        image.src = part.image;
        image.alt = `${part.name} replacement part, ${part.partNumber}`;
        image.loading = index < 6 ? 'eager' : 'lazy';
        image.decoding = 'async';
        image.width = 920;
        image.height = 690;
        media.appendChild(image);
        card.appendChild(media);

        const body = document.createElement('div');
        body.className = 'parts-card-body';
        addText(body, 'span', 'parts-card-category', part.category);
        addText(body, 'h2', 'parts-card-title', part.name);
        addText(body, 'p', 'parts-card-number', part.partNumber);
        addText(body, 'p', 'parts-card-description', part.description);
        addDetail(body, 'Applicable Models', part.applicableModels);
        addDetail(body, 'Compatible Brands', part.compatibleBrands.join(', '));

        const link = document.createElement('a');
        link.className = 'parts-card-link';
        link.href = `contact.html?product=${encodeURIComponent(`${part.name} (${part.partNumber})`)}`;
        link.textContent = 'Request Details';
        const arrow = document.createElement('span');
        arrow.setAttribute('aria-hidden', 'true');
        arrow.textContent = '→';
        link.appendChild(arrow);
        body.appendChild(link);

        card.appendChild(body);
        return card;
    }

    function matches(part, query) {
        const categoryMatches = activeCategory === 'All Parts' || part.category === activeCategory;
        if (!categoryMatches) return false;
        if (!query) return true;
        const searchable = [
            part.name,
            part.partNumber,
            part.category,
            part.applicableModels,
            ...part.compatibleBrands,
        ].join(' ').toLowerCase();
        return searchable.includes(query);
    }

    function render() {
        const query = search.value.trim().toLowerCase();
        const visibleParts = catalog.filter((part) => matches(part, query));
        const fragment = document.createDocumentFragment();
        visibleParts.forEach((part, index) => fragment.appendChild(buildCard(part, index)));
        grid.replaceChildren(fragment);
        resultCount.textContent = `${visibleParts.length} ${visibleParts.length === 1 ? 'part' : 'parts'} found`;
        emptyState.hidden = visibleParts.length !== 0;
    }

    filters.addEventListener('click', (event) => {
        const button = event.target.closest('[data-parts-category]');
        if (!button) return;
        activeCategory = button.dataset.partsCategory;
        filters.querySelectorAll('[data-parts-category]').forEach((item) => {
            const isActive = item === button;
            item.classList.toggle('active', isActive);
            item.setAttribute('aria-pressed', String(isActive));
        });
        render();
    });

    search.addEventListener('input', render);
    render();
}());
