const responses: [RegExp, string][] = [
  [
    /service|offer|provide|what do you/i,
    "We offer a variety of professional services at {business}. You can browse all available services and their prices on this page. Would you like help choosing one?",
  ],
  [
    /book|appointment|schedule|reserve/i,
    "To book an appointment, browse the services listed on this page, select the one you'd like, and choose your preferred date and time. Need help with anything else?",
  ],
  [
    /price|cost|how much|fee|charge/i,
    "Pricing varies by service. You can see the price for each service listed on this page. Is there a specific service you're interested in?",
  ],
  [
    /hour|when|open|available|time/i,
    "You can find our complete working hours in the sidebar. We also show available time slots when you start the booking process.",
  ],
  [
    /location|where|address|map|direction/i,
    "Our location details are displayed on this page. Check the Location section for the full address and map.",
  ],
  [
    /cancel|reschedule|change/i,
    "You can manage your existing bookings from the 'My Bookings' section. If you need to cancel or reschedule, you'll find options there.",
  ],
  [
    /hello|hi|hey|greet/i,
    "Hello! I'm the AI assistant for {business}. How can I help you today?",
  ],
  [
    /thank|thanks/i,
    "You're welcome! Feel free to ask if you need anything else about {business}.",
  ],
];

const fallback =
  "I'd be happy to help with any questions about {business}. You can ask me about our services, pricing, working hours, or how to book an appointment.";

export function getMockResponse(
  userMessage: string,
  businessName: string,
): string {
  const match = responses.find(([pattern]) => pattern.test(userMessage));
  const template = match ? match[1] : fallback;
  return template.replace(/\{business\}/g, businessName);
}
