# 📦 PNiX | PACK & TRACE

> **PNiX STUDIOS — GEOMETRIC COMPOSITIONAL SERENITY**

Pack & Trace is a standalone, offline-first moving application designed for high-tempo, structured residential relocation. Combining real-time client-side artificial intelligence, a secure serverless cloud database, and heavy-duty printable QR layout designs, this suite provides total organizational serenity during complex transitions.

### 🌐 Live Web Portal

Open the standalone PWA directly on your computer or mobile device:
👉 **[Launch Pack & Trace Web Portal](https://jthatcher87.github.io/pack-and-trace/)** _(HTTPS Secured Context)_

---

## 🚀 Key Feature Architectures

### 1. Responsive Multi-Device Layout

- **Desktop Interface:** Automatically scales on larger monitors (`md:` breakpoint) into a professional **fixed vertical sidebar layout** displaying real-time system connections, cloud sync indicators, and main navigation drawers. Grid widths are padded and restricted to prevent card-stretching on wide monitors.
- **Mobile Interface:** Collapses into a native-like fullscreen view with a tactile **fixed-bottom navigation bar**, optimized for single-hand touch operations in the field.

### 2. Client-Side AI Packing Station

- Powered by **TensorFlow.js (COCO-SSD)** running entirely in your browser without cloud-inference overhead.
- Initiates your mobile/desktop camera viewfinder, draws real-time bounding overlays, auto-labels recognized items, and allows single-tap packing into any active container.

### 3. High-Tempo Short-Code Schema

Automatically compiles unique, high-visibility box identifiers structured as: `[ROOM_CODE][SERIAL_NUMBER]-[HANDLING_CODES]` (e.g., `KT001-FUH`):

- **Room Codes:** `BA` (Bathroom), `BR` (Bedroom), `CL` (Closet), `KT` (Kitchen), `LR` (Living Room), `OF` (Office), `PR` (Playroom), `ST` (Storage/General).
- **Handling Care Tags:** Features interactive, color-coded multi-select tag pills:
  - 🧪 `C` | CHEMICALS (Yellow)
  - 🍷 `F` | FRAGILE (Red)
  - ⚖️ `H` | HEAVY (Amber)
  - 🔥 `I` | IGNITABLE (Orange)
  - 💧 `L` | LIQUID (Blue)
  - 🍏 `P` | PERISHABLE (Green)
  - ℹ️ `S` | SPECIAL NOTES (Cyan)
  - ⬆️ `U` | UPRIGHT (Emerald)
- Cards and layouts render multiple active badges in a row, with the card's main neon glow outline automatically matching the highest-precedence handling hazard.

### 4. Interactive Room Progress & Nested Inventory Tree

- Displays room-by-room completion cards showing status indicators for **PACKED**, **REPAIRED**, **CLEANED**, and **FINISHED**.
- **The Master Tree Drawer:** Tapping **"Open Inventory"** on any room card slides open an interactive local database panel listing all boxes assigned to that room. Tapping `[+]` expands the box to reveal the exact items packed inside.
- **In-Drawer Management:** Delete individual items or entire boxes directly from within the Room Progress list, or use the **Transfer** utility to move an item from one box to another in real-time.

### 5. Two-Way Smart-Merge Cloud Sync

- **Ghost Row Filters:** Automatically sweeps your spreadsheet on load and filters out empty or partially corrupted rows, keeping your dashboard clean.
- **Merge Preservation:** Syncing (GET) reads your spreadsheet and merges item quantities and room states locally. If you pack boxes offline, the app **preserves them** and queues background POST requests to upload them once you regain connection, ensuring local offline work is never overwritten.
- **Cascading Deletes:** Deleting a box in the app triggers a server-side cascade that purges the box from your spreadsheet and sweeps all associated packed item rows.

### 6. Avery-Compatible Print Studio (2x2 Grid)

- Features a dedicated `@media print` CSS layout that formats your print queue into standard **4-labels-per-page (2x2 grid)** sheets.
- Constrained card heights (`4.8in`) and an automated page breaker (`div.print-card:nth-child(4n) { page-break-after: always; }`) natively format label sheets with zero trailing pages or overlapping.
- Renders large, high-visibility short-code texts, safety icons, a compact high-contrast QR code, and a two-column index of all box contents directly on the label.

---

## 🛠️ Google Sheets Sync Setup (The Serverless API)

To protect your Google Sheet from public or unauthenticated access, the system utilizes a **Secure Shared Token** authentication gate.

### Step 1: Set Up the Script (Google Sheet)

1.  Create a Google Sheet with three tabs named exactly: **`Boxes`**, **`Items`**, and **`Rooms`**.
2.  Click **Extensions** → **Apps Script**.
3.  Replace all default code with the contents of the `Code.gs` file in this repository.
4.  Configure your **Script Environment Variables** (Project Settings (gear icon) → Script Properties → Add Script Property):
    - **Property:** `API_SECRET`
    - **Value:** `your_private_shared_password` _(Choose a strong password)_.
5.  Click **Deploy** → **New Deployment**. Select **Web App** as the type:
    - _Execute as:_ **Me**
    - _Who has access:_ **Anyone** _(Protected by your API_SECRET environment property)._
6.  Deploy, authorize permissions when prompted by Google, and **copy your Web App URL**.

### Step 2: Zero-Friction QR Pairing

1.  Open your [Pack & Trace Web Portal](https://jthatcher87.github.io/pack-and-trace/) on your computer.
2.  Go to the **Cloud Sync** tab.
3.  Paste your copied Web App URL, type your private `API_SECRET` passcode, and click **Connect and Autosave**.
4.  The PWA will immediately generate a **Setup Configuration QR Code** on your computer screen.
5.  On any phone in your test group, open the app, go to the **Scan QR** tab, and scan your computer screen. The phone will instantly capture, decode, and save the settings in the background—**requiring zero typing on mobile keyboards**.

---

## 📲 Offline Mobile Installation (PWA)

Because the app is deployed on a fully secured HTTPS context, Google Chrome and Apple Safari natively support running the portal in standalone app mode:

1.  Open the [Live URL](https://jthatcher87.github.io/pack-and-trace/) on your phone's browser.
2.  Open your browser settings menu:
    - **iOS Safari:** Tap the **Share** button and select **"Add to Home Screen"**.
    - **Android Chrome:** Tap the **Three-Dot Menu** and select **"Add to Home Screen"** or **"Install app"**.
3.  Close your browser and launch **Pack & Trace** from your phone's home screen. The app will launch in full screen with zero browser bars, running all blurs, animations, and typography at a smooth 60fps.
