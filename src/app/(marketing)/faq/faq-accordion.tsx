"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  q: string;
  a: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="not-prose mt-6">
      <Accordion type="single" collapsible className="w-full">
        {items.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-emerald-100">
            <AccordionTrigger className="text-left font-sans text-emerald-950 hover:text-emerald-700 hover:no-underline py-5">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-emerald-900/75 font-sans leading-relaxed pb-5">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
