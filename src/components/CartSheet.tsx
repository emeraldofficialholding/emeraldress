import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { motion } from "framer-motion";

const CartSheet = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice } = useCart();
  const { items: wishlistItems, removeItem: removeWishlistItem, addItem: addWishlistToCart } = useWishlist();
  const { addItem: addToCart } = useCart();

  const moveToCart = (wishlistItem: typeof wishlistItems[0]) => {
    addToCart({
      id: wishlistItem.id,
      name: wishlistItem.name,
      price: wishlistItem.price,
      size: "M",
      image: wishlistItem.image,
    });
    removeWishlistItem(wishlistItem.id);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-serif text-xl">Il tuo carrello</SheetTitle>
        </SheetHeader>

        {items.length === 0 && wishlistItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Il carrello è vuoto.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {/* Cart Items */}
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-28 object-cover bg-muted" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-serif text-sm">{item.name}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">Taglia: {item.size}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} className="p-1 hover:bg-muted rounded">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} className="p-1 hover:bg-muted rounded">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id, item.size)} className="self-start p-1 hover:bg-muted rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Wishlist Section */}
              {wishlistItems.length > 0 && (
                <div className="pt-4 border-t border-dashed border-emerald-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-4 h-4 text-emerald-600 fill-emerald-100 stroke-emerald-600" />
                    <p className="font-serif text-sm text-emerald-800">I tuoi preferiti</p>
                  </div>
                  <div className="space-y-3">
                    {wishlistItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="flex gap-3 p-2 border border-emerald-100 rounded-sm bg-emerald-50/40"
                      >
                        <img src={item.image} alt={item.name} className="w-14 h-20 object-cover bg-muted shrink-0" />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <p className="font-serif text-xs leading-tight">{item.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">€{item.price.toFixed(2)}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-[10px] tracking-widest uppercase border-emerald-700 text-emerald-800 hover:bg-emerald-700 hover:text-white gap-1 rounded-none"
                            onClick={() => moveToCart(item)}
                          >
                            <ShoppingBag className="w-3 h-3" />
                            Sposta nel carrello
                          </Button>
                        </div>
                        <button onClick={() => removeWishlistItem(item.id)} className="self-start p-1 hover:bg-muted rounded">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between font-serif">
                  <span>Totale</span>
                  <span>€{totalPrice.toFixed(2)}</span>
                </div>
                <Button className="w-full" size="lg">
                  Procedi al checkout
                </Button>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
