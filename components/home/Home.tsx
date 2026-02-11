"use client";


import { Input } from "@/components/ui/input";
import { useMenuItems } from "@/query/menuitem.query";
import { useCallback, useEffect, useMemo, useState } from "react";
import MenuItemCard from "@/components/ui/menu/ItemCard";
import { useAppState } from "@/store/useAppState";
import _ from "lodash";
import { useDebounce } from "@/hooks/component/useDebounce";
import { Item } from "@/components/ui/item";

export default function Home() {
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [allMenuItems, setAllMenuItems] = useState<any[]>([]);

  const filters = useMemo(() => ({
    search: debouncedSearch,
    page,
    limit: 20
  }), [debouncedSearch, page]);

  const { state, addItemToCart, removeItemFromCart } = useAppState();

  const { data: menuItems, isLoading } = useMenuItems(filters);

  
  useEffect(() => {
    if (menuItems?.data) {
      if (page === 1) {
        // If first page, reset
        setAllMenuItems(menuItems.data);
      } else {
        
        setAllMenuItems(prev => [...prev, ...menuItems.data]);
      }
    }
  }, [menuItems?.data, page]);

  const onLoadMore = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearch(e.target.value);
    setPage(1); // reset pagination on search
  };

  // Group items by cuisine
  const groupedItems = useMemo(() => _.groupBy(allMenuItems, "cuisine"), [allMenuItems]);

  return (
    <>

      <div className="flex flex-col items-center p-4 space-y-6">
        <Input
          type="text"
          placeholder="Search for cuisine or item..."
          value={search}
          onChange={onSearchInputChange}
          className="w-96"
        />
          <div
          
            className="space-y-4 w-full max-w-4xl flex flex-col items-center"
          >
        {/* Menu Items */}
        {Object.entries(groupedItems).map(([cuisine, items]) => (
          <div  className="space-y-4 w-full flex flex-col items-center" key={cuisine}>
            <h2 className="text-2xl font-bold text-center">{_.capitalize(cuisine)}</h2>

            {items.map((item, index) => {
              const cartItemCount = state.cart.filter(ci => ci.id === item.id).length;
              return (
                <MenuItemCard
                 
                  index={index}
                  name={_.capitalize(item?.name ?? "")}
                  quantity={cartItemCount}
                  onAdd={() => addItemToCart(item)}
                  onRemove={() => removeItemFromCart(item.id)}
                  {...item}
                />
              );
            })}
         </div>
        ))}

        {/* Load More Item */}
        {allMenuItems.length > 0 && (
         
            <Item
              onClick={!isLoading ? onLoadMore : undefined}
              className={`flex w-full text-center cursor-pointer ${
                isLoading ? "opacity-50 pointer-events-none" : "hover:bg-muted"
              }`}
            >
              {isLoading ? "Loading..." : "Load more items"}
            </Item>
          
        )}
</div>
    
        {!isLoading && allMenuItems.length === 0 && <p>No items found.</p>}
      </div>
    </>
  );
}
