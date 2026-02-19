import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const CartSheet = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-serif text-xl">Il tuo carrello</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Il carrello è vuoto.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
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
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between font-serif">
                <span>Totale</span>
                <span>€{totalPrice.toFixed(2)}</span>
              </div>
              <Button className="w-full" size="lg">
                Procedi al checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
