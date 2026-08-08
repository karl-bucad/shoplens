function GlobalSearch({
    query,
    results,
    isOpen,
    onQueryChange,
    onClose,
    onSelectProduct,
}) {
    if (!isOpen) {
        return null
    }

    const uniqueShops = [
        ...new Set(
            results
                .map((product) => product.shop_name)
                .filter(Boolean),
        ),
    ]

    const uniqueCategories = [
        ...new Set(
            results
                .map((product) => product.category)
                .filter(Boolean),
        ),
    ]

    const hasQuery = query.trim().length > 0
    const hasResults = results.length > 0

    return (
        <div
            className="global-search-overlay"
            onClick={onClose}
        >
            <div
                className="global-search-panel"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="global-search-input-row">
                    <span className="global-search-icon">
                        ⌕
                    </span>

                    <input
                        type="text"
                        value={query}
                        onChange={onQueryChange}
                        placeholder="Search products, shops, categories..."
                        autoFocus
                    />

                    <button
                        type="button"
                        className="global-search-close"
                        onClick={onClose}
                        aria-label="Close global search"
                    >
                        ×
                    </button>
                </div>

                {!hasQuery ? (
                    <div className="global-search-empty">
                        <p className="page-eyebrow">
                            Global Search
                        </p>

                        <h3>Search across ShopLens</h3>

                        <p>
                            Find products, shops, and categories from your
                            current market dataset.
                        </p>
                    </div>
                ) : !hasResults ? (
                    <div className="global-search-empty">
                        <h3>No results found</h3>

                        <p>
                            Try another product, shop, or category.
                        </p>
                    </div>
                ) : (
                    <div className="global-search-results">
                        <section className="global-search-section">
                            <div className="global-search-section-header">
                                <span>Products</span>
                                <strong>{results.length}</strong>
                            </div>

                            <div className="global-search-list">
                                {results.slice(0, 6).map((product) => (
                                    <button
                                        type="button"
                                        className="global-search-result"
                                        key={product.id}
                                        onClick={() => onSelectProduct(product)}
                                    >
                                        <div>
                                            <strong>{product.name}</strong>

                                            <span>
                                                {product.shop_name ?? 'Unknown shop'}
                                                {' • '}
                                                {product.category ?? 'Uncategorized'}
                                            </span>
                                        </div>

                                        <span className="global-search-arrow">
                                            →
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </section>

                        {uniqueShops.length > 0 && (
                            <section className="global-search-section">
                                <div className="global-search-section-header">
                                    <span>Shops</span>
                                    <strong>{uniqueShops.length}</strong>
                                </div>

                                <div className="global-search-chip-list">
                                    {uniqueShops.slice(0, 8).map((shop) => (
                                        <span
                                            className="global-search-chip"
                                            key={shop}
                                        >
                                            {shop}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {uniqueCategories.length > 0 && (
                            <section className="global-search-section">
                                <div className="global-search-section-header">
                                    <span>Categories</span>
                                    <strong>{uniqueCategories.length}</strong>
                                </div>

                                <div className="global-search-chip-list">
                                    {uniqueCategories.slice(0, 8).map((category) => (
                                        <span
                                            className="global-search-chip"
                                            key={category}
                                        >
                                            {category}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default GlobalSearch