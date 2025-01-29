"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Why should I hire an interior designer?",
    answer:
      "An interior designer brings professional expertise, creative vision, and project management skills to transform your space efficiently while avoiding costly mistakes.",
  },
  {
    question: "What makes Livspace the ideal choice for your home interiors?",
    answer:
      "We offer end-to-end interior solutions with professional designers, quality materials, and warranty-backed services.",
  },
  {
    question: "What services are covered under home interior design?",
    answer:
      "Our services include space planning, material selection, custom furniture design, color consultation, and project management.",
  },
]

export function FAQ() {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions About Home Interior Design</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

