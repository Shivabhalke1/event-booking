# Online Ticket Booking System

> **A centralized platform for discovering events and booking tickets.**  
> Built for **Team AIML D1**

---

## 👥 Team & Project Metadata

| Attribute | Details |
| :--- | :--- |
| **Project Title** | Online Ticket Booking System (EventPulse) |
| **Team ID** | **AIML D1** |
| **Problem Statement** | *"Users need a centralized platform for discovering events and booking tickets."* |
| **Target Deployment** | Vercel |

### 🎓 Team Members & SRNs
- **SHREYA L SHETTY** — SRN: `R25EA214`
- **VARALAKSHMI T J** — SRN: `R25EA239`
- **S MONISH** — SRN: `R25EA195`
- **SAGAR** — SRN: `R25EA196`

---

## 🛠️ Tech Stack Specification

- **Frontend Framework:** React.js (v18, JSX)
- **Structure & Markup:** Semantic HTML5
- **Styling:** CSS3 (modern glassmorphism, responsive flexbox & CSS grid, CSS custom properties)
- **Backend / Authentication / Storage:** Supabase (Auth, Row Level Security, Storage)
- **Database:** PostgreSQL (managed via Supabase)
- **Routing:** React Router DOM (v6+)
- **Build Tool & Dev Server:** Vite
- **Icons & Animation:** Lucide React, Canvas Confetti

---

## 📂 Directory & File Structure

```text
online-ticket-booking-system/
├── .env.example                      # Sample Supabase credentials
├── .gitignore                        # Git ignore patterns
├── README.md                         # Project documentation & setup guide
├── package.json                      # Dependencies and scripts
├── supabase_schema.sql               # PostgreSQL schema, triggers & RLS policies
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   └── index.html
└── src/
    ├── api/
    │   └── supabaseClient.js         # Supabase client config & fallback detection
    ├── assets/
    │   └── styles/
    │       ├── variables.css         # Theme colors, typography, breakpoints
    │       ├── global.css            # CSS resets, global layout rules
    │       └── components.css        # Cards, buttons, badges, modals, tickets
    ├── components/
    │   ├── common/
    │   │   ├── Navbar.jsx            # Header with auth state & navigation
    │   │   ├── Footer.jsx            # Footer with Team AIML D1 credits
    │   │   ├── Button.jsx            # Custom styled buttons with loading states
    │   │   ├── Modal.jsx             # Accessible modal dialog
    │   │   ├── Alert.jsx             # Flash notifications & error badges
    │   │   └── ProtectedRoute.jsx    # Auth guard for restricted views
    │   ├── events/
    │   │   ├── EventCard.jsx         # Card previewing title, date, venue, price
    │   │   ├── EventGrid.jsx         # Responsive event discovery grid
    │   │   ├── EventSearchFilter.jsx # Category, date, price, and query search bar
    │   │   └── TicketSelector.jsx    # Quantity selector & price calculator
    │   ├── booking/
    │   │   ├── BookingModal.jsx      # Ticket checkout dialog
    │   │   └── TicketPass.jsx        # Digital ticket / receipt view with reference ID
    │   └── dashboard/
    │       ├── UserBookingsTable.jsx # Attendee ticket history & cancellation
    │       └── OrganizerEventsTable.jsx # Host management & ticket sales stats
    ├── context/
    │   ├── AuthContext.jsx           # Session, profile & role state provider
    │   └── BookingContext.jsx        # Active checkout flow state
    ├── hooks/
    │   ├── useAuth.js                # Auth hook shortcut
    │   ├── useEvents.js              # Data fetching, event search & filters
    │   └── useTickets.js             # Booking transactions & inventory check
    ├── pages/
    │   ├── Home.jsx                  # Hero banner, category quick links, featured events
    │   ├── EventCatalog.jsx          # Discovery page with full search & filtering
    │   ├── EventDetails.jsx          # Venue details, schedules, pricing & booking trigger
    │   ├── Dashboard.jsx             # Unified user/host dashboard
    │   ├── CreateEvent.jsx           # Host page to publish events & set ticket inventory
    │   ├── Login.jsx                 # Email/Password & demo account login
    │   ├── Register.jsx              # Account signup with attendee/host role selection
    │   └── NotFound.jsx              # 404 handler
    ├── services/
    │   ├── authService.js            # Supabase auth methods (login, signup, logout)
    │   ├── eventService.js           # Fetch, search, create, and update events
    │   └── bookingService.js         # Create booking, verify capacity, fetch user tickets
    ├── utils/
    │   ├── formatCurrency.js         # Currency formatting (INR ₹)
    │   ├── formatDate.js             # Date and time parsing helpers
    │   └── ticketGenerator.js        # Unique ticket reference ID generator
    ├── App.jsx                       # Application routes & provider wrappers
    └── index.js                      # React root initialization
```

---

## 🗄️ Supabase PostgreSQL Database Schema

The database schema is defined in [supabase_schema.sql](file:///Users/shivabhakle/Downloads/event/supabase_schema.sql).

### Key Tables & Features:
1. **`public.profiles`**: Extends `auth.users` with user roles (`customer`, `organizer`, `admin`) and full names.
2. **`public.events`**: Contains event details, category, venue, schedule, ticket pricing, and live inventory (`total_capacity`, `available_tickets`).
3. **`public.bookings`**: Records reservations with unique `booking_reference`, `tickets_count`, `total_amount`, and `booking_status`.
4. **Row Level Security (RLS)**: Protects event creation, user ticket viewing, and cancellation permissions.
5. **Atomic Booking Function (`book_tickets_atomic`)**: Row-locks the event during checkout to prevent concurrency overselling.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18+ (tested with v26.0.0)
- **npm** v9+ (tested with v11.12.1)

### 2. Installation
```bash
# Clone or navigate to the project directory
cd /Users/shivabhakle/Downloads/event

# Install dependencies
npm install
```

### 3. Environment Variables (Optional for Supabase Live Mode)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Supabase project credentials:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> **Note:** The application includes an **intelligent fallback mode**! Even before configuring remote Supabase keys, the system operates locally with pre-seeded demo events, customer/host accounts, and live booking/cancellation storage.

### 4. Running the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 5. Production Build
```bash
npm run build
npm run preview
```

---

## 🌟 Key Application Features

- **Event Discovery & Filtering:** Live search by title/location, filter by category (*Tech, Music, Workshop, Sports*), and sort by price/date.
- **Seat Capacity Protection:** Real-time seat inventory decrement and oversell guard.
- **Digital QR Ticket Passes:** Generates an authentic perforated ticket pass with barcode stub, printable/downloadable for venue entry.
- **Unified Dashboard:**
  - **Attendee View:** View all active passes, booking references, and 1-click ticket cancellation with seat release.
  - **Host View:** Real-time ticket sales percentage bar, remaining capacity, and gross revenue metrics.
- **Instant Demo Switcher:** Seamlessly switch between **Shreya (Attendee)**, **Varalakshmi (Host)**, and **Monish/Sagar (Admin)** via the top navigation bar.

---

## 🚢 Deployment to Vercel

1. Push the code repository to GitHub.
2. Go to [Vercel](https://vercel.com) and import the repository.
3. Configure Build Settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**.
