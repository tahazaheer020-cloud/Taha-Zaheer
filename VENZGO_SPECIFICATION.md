# Venzgo: The Ultimate Super-App Specification

## 1. Venzgo Full App Flow

### Passenger Flow
1.  **Splash & Onboarding**: Premium animation of the Venzgo logo. Brief intro to "More than just a ride."
2.  **Authentication**: Phone number with OTP (English/Urdu toggle).
3.  **Home Screen (The Hub)**:
    *   **Top**: Search bar "Where to?" for immediate ride hailing.
    *   **Middle**: A "Service Grid" with high-quality icons for Hotels, Flights, Trains, Food, Grocery, and Courier.
    *   **Bottom**: Recent destinations and personalized offers.
4.  **Ride Booking**:
    *   **Map View**: Real-time cars moving nearby.
    *   **Vehicle Selection**: Horizontal scroll of Economy, Comfort, Premium, and Venzgo-X (Luxury).
    *   **Price Bidding (Optional/inDrive style)**: Passenger offers a price, drivers counter-offer.
5.  **In-Ride Experience**:
    *   Real-time tracking on Google Maps.
    *   **The "Secret" Upsell**: A floating button or card: "While you're on your way, book your stay at your destination?" leading to the native-looking Hotel booking.
6.  **Service Booking (e.g., Hotels)**:
    *   Search results page (Venzgo branded).
    *   Property details (Venzgo branded).
    *   Checkout (Venzgo Wallet/Saved Card).
7.  **Post-Ride**: Rating, tipping, and a summary of all services booked.

### Driver Flow
1.  **Registration**: Multi-step form for License, CNIC, Vehicle Docs, and Selfie.
2.  **Verification**: Admin approval status screen.
3.  **Go Online**: Toggle switch. Requires a minimum wallet balance.
4.  **Ride Request**: Popup with map, distance, and fare.
5.  **Navigation**: Integrated Google Maps turn-by-turn.
6.  **Wallet**: Top-up via JazzCash/EasyPaisa to keep receiving rides.

---

## 2. Venzgo Detailed Feature List

### Core Ride-Hailing
*   **Real-time GPS**: High-frequency location updates via WebSocket.
*   **Dynamic Pricing**: Surge pricing during peak hours.
*   **SOS Button**: Immediate alert to emergency contacts and Venzgo support.

### Native-Integrated Affiliate Services
*   **Venzgo Stays (Booking.com)**: API pulls data. UI uses Venzgo's "Premium Gold" accents. No external logos.
*   **Venzgo Travel (Omio)**: Flight/Bus/Train search results styled as native cards.
*   **Venzgo Eats**: Restaurant listings with integrated checkout.
*   **Venzgo Logistics**: Simple "Pickup" and "Drop-off" selection for parcels.

### AI Assistant (Venzgo AI)
*   Powered by `gemini-3.1-pro-preview`.
*   Helps users plan trips: "Find me a 4-star hotel in Lahore near the airport for under 10k PKR."
*   Handles customer support queries automatically.

---

## 3. Venzgo Database & Backend Architecture

### Database Schema (PostgreSQL/Better-SQLite3)
*   **Users**: id, name, email, phone, role (passenger/driver), wallet_balance, rating.
*   **Vehicles**: id, driver_id, model, plate, type (Economy/Premium), status.
*   **Trips**: id, passenger_id, driver_id, start_loc, end_loc, status, fare, affiliate_ref_id.
*   **Affiliate_Bookings**: id, user_id, type (hotel/flight), provider_booking_id, commission_earned.
*   **Wallet_Transactions**: id, user_id, amount, type (credit/debit), description.

### Backend Services (Node.js/Express)
*   **Auth Service**: JWT-based authentication.
*   **Matching Engine**: Geo-spatial queries to find nearest drivers.
*   **Affiliate Proxy**: A middleware that calls Booking.com/Viator APIs and re-formats the JSON to match Venzgo's UI schema.

---

## 4. Venzgo Tech Stack Recommendation

*   **Frontend**: **Flutter** (for high-performance cross-platform mobile) or **React Native**.
*   **Web Dashboard**: **React + Tailwind CSS**.
*   **Backend**: **Node.js (Express)** for high concurrency.
*   **Real-time**: **Socket.io** for GPS and Chat.
*   **Database**: **PostgreSQL** (with PostGIS for location data).
*   **AI**: **Gemini 3.1 Pro** via `@google/genai`.

---

## 5. Venzgo Monetization Plan

1.  **Ride Commission**: 15-25% from every completed trip.
2.  **Affiliate Commission**: 5-15% from Hotels, Flights, and Tours (hidden from user).
3.  **Premium Subscription**: "Venzgo Gold" for zero-wait rides and extra discounts.
4.  **Ad Placements**: Native promoted restaurants or hotels in the search results.

---

## 6. Venzgo Development Roadmap

*   **Phase 1 (MVP - 8 Weeks)**: Core Ride-hailing (Passenger + Driver) + Wallet system.
*   **Phase 2 (Super-App Core - 4 Weeks)**: Integration of Hotel and Flight APIs (Native UI).
*   **Phase 3 (Expansion - 4 Weeks)**: Food & Grocery delivery + Logistics.
*   **Phase 4 (Optimization)**: AI Assistant integration + Advanced Analytics.

---

## 7. Venzgo UI/UX Screen Names

1.  `Screen_Splash`: Animated logo.
2.  `Screen_Auth_Phone`: OTP entry.
3.  `Screen_Home_Passenger`: The Super-App Hub.
4.  `Screen_Ride_Request`: Map + Vehicle selection.
5.  `Screen_Driver_Dashboard`: Earnings + Map.
6.  `Screen_Venzgo_Stays`: Hotel search & details.
7.  `Screen_Venzgo_Travel`: Flight/Train booking.
8.  `Screen_Wallet`: Top-up & History.
9.  `Screen_AI_Assistant`: Chat interface.
