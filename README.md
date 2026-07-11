# 📦 PNiX | PACK & TRACK

> PNiX STUDIOS — GEOMETRIC COMPOSITIONAL SERENITY

Pack & Track is a standalone, offline-first moving application designed for high-tempo, structured residential relocation.

## 🚀 Key Features

*   **Responsive Dual-Layout:** Full-screen desktop sidebar interface combined with touch-optimized mobile bottom navigation.
*   **AI Packing Station:** Client-side real-time object recognition powered by TensorFlow.js (COCO-SSD).
*   **Short-Code Schema:** Generates semantic box codes (e.g., `KT001-FUH` meaning Kitchen, Box #1, Fragile/Upright/Heavy) using physical multi-select handling care pills.
*   **Room progress & Notes:** Checklists to track room completion status (PACKED, REPAIRED, CLEANED, FINISHED) with custom instruction pads.
*   **Two-Way Cloud Sync:** Real-time background syncing with Google Sheets utilizing an un-overwriteable local merging algorithm.

## 🛠️ Deployment Steps

1. Bind the `Code.gs` file to your Google Sheet (Extensions -> Apps Script). Set `API_SECRET` and deploy as a Web App.
2. Open this PWA on your laptop, paste your Web App URL and Security Passcode into Settings, and generate your Setup QR Key.
3. Open this PWA on your phone, scan the Setup QR, and start packing with zero typing.
