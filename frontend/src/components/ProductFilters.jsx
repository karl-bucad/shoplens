function ProductFilters({
    searchTerm,
    selectedCategory,
    selectedShop,
    sortOption,
    categories,
    shops,
    onSearchChange,
    onCategoryChange,
    onShopChange,
    onSortChange,
}) {
    return (
        <div className="table-controls">
            <div className="search-bar">
                <input
                    type="search"
                    placeholder="Search products, shops, or categories..."
                    aria-label="Search products"
                    value={searchTerm}
                    onChange={onSearchChange}
                />
            </div>

            <div className="filter-group">
                <select
                    aria-label="Filter by category"
                    value={selectedCategory}
                    onChange={onCategoryChange}
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category === 'All'
                                ? 'All categories'
                                : category}
                        </option>
                    ))}
                </select>

                <select
                    aria-label="Filter by shop"
                    value={selectedShop}
                    onChange={onShopChange}
                >
                    {shops.map((shop) => (
                        <option key={shop} value={shop}>
                            {shop === 'All' ? 'All shops' : shop}
                        </option>
                    ))}
                </select>

                <select
                    aria-label="Sort products"
                    value={sortOption}
                    onChange={onSortChange}
                >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="name-ascending">
                        Product A–Z
                    </option>
                    <option value="name-descending">
                        Product Z–A
                    </option>
                </select>
            </div>
        </div>
    )
}

export default ProductFilters