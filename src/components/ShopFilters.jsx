import Button from "./Button.jsx";
import Input from "./Input.jsx";
import Select from "./Select.jsx";

function ShopFilters({ brands, categories, filters, onChange, onClear }) {
  return (
    <section
      aria-labelledby="shop-filters-heading"
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="min-w-0 flex-1 lg:max-w-sm">
          <Input
            id="product-search"
            label="Search products"
            onChange={(event) => onChange("search", event.target.value)}
            placeholder="Search by name, brand, or category"
            type="search"
            value={filters.search}
          />
        </div>
        <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Select
            id="product-category"
            label="Category"
            onChange={(event) => onChange("category", event.target.value)}
            value={filters.category}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          <Select
            id="product-brand"
            label="Brand"
            onChange={(event) => onChange("brand", event.target.value)}
            value={filters.brand}
          >
            <option value="">All brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </Select>
          <Select
            id="product-sort"
            label="Sort by price"
            onChange={(event) => onChange("sort", event.target.value)}
            value={filters.sort}
          >
            <option value="">Recommended</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </Select>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-end">
        <div className="grid flex-1 gap-4 sm:grid-cols-2">
          <Input
            id="minimum-price"
            label="Minimum price"
            min="0"
            onChange={(event) => onChange("minPrice", event.target.value)}
            placeholder="0"
            type="number"
            value={filters.minPrice}
          />
          <Input
            id="maximum-price"
            label="Maximum price"
            min="0"
            onChange={(event) => onChange("maxPrice", event.target.value)}
            placeholder="Any price"
            type="number"
            value={filters.maxPrice}
          />
        </div>
        <Button onClick={onClear} size="md" variant="secondary">
          Clear filters
        </Button>
      </div>
      <h2 className="sr-only" id="shop-filters-heading">
        Product filters
      </h2>
    </section>
  );
}

export default ShopFilters;
