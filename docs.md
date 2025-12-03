# Desain Data & Workflow Platform Subscription (Tanpa Diagram)

## 1. Tujuan & Konteks Singkat

Dokumen ini mendeskripsikan: 
- Struktur data (ERD dalam bentuk teks) untuk platform subscription yang: 
  - Menjual Google Workspace, Google Cloud Platform (GCP), dan produk lain (domain, managed service fee, addon, dll). 
  - Mengelola quotation, subscription, billing, dan pembayaran recurring ala Netflix. 
- Workflow bisnis utama: 
  - Dari pembuatan quotation oleh Sales, pembuatan PDF quotation di Cosmic, pengiriman ke client. 
  - Request pembuatan invoice & faktur pajak ke Finance (tanpa link pembayaran). 
  - Penerimaan upload invoice & faktur pajak dari Finance ke platform + pembuatan link pembayaran Xendit, hingga pengiriman email ke client. 
  - Aktivasi/penonaktifan layanan di Google Workspace dan GCP. 
  - Penanganan recurring billing, gagal bayar, dunning, dan manual intervention. 
- Desain ini fokus pada: 
  - Deskripsi entitas dan atribut kunci, relasi antartabel. 
  - Deskripsi alur proses utama dalam bentuk naratif langkah-langkah. 
  - Tanpa menyertakan diagram visual (seperti ERD diagram atau BPMN). 

Tujuan utama: 
- Menjadi pseudo-SRS yang dapat: 
  - Digunakan oleh tim engineering untuk menurunkan menjadi desain teknis yang lebih detail. 
  - Menjadi referensi awal untuk diskusi dengan stakeholder non-teknis (Sales, Finance, dsb). 

## 2. Peran Pengguna (User Roles)

1. Sales 
  - Membuat dan meng-update quotation di platform. 
  - Mengirim email penawaran ke client (body email digenerate oleh LLM / Gemini, dikirim via Gmail). 
  - Menandai quotation sebagai ACCEPTED (deal) dan memicu proses request invoice ke Finance. 
  - Mendapat email/alert jika pembayaran recurring gagal berhari-hari untuk follow-up manual. 
  - Dapat membuat subscription manual jika Xendit down (bersama Admin). 

2. Admin 
  - Mengelola data master seperti produk, harga dasar, konfigurasi paket. 
  - Membuat dan mengubah subscription secara manual (termasuk mengaktifkan / menonaktifkan) ketika diperlukan, misalnya saat Xendit down. 
  - Bisa membantu Sales dalam setup teknis subscription. 

3. Client 
  - Sebelum pembayaran pertama: belum punya akun portal; komunikasi masih via email dengan Sales. 
  - Setelah pembayaran pertama sukses: 
  - Mendapat akun portal (user dengan role CLIENT). 
  - Melihat subscription aktif, riwayat invoice, status pembayaran. 
  - Mengelola metode pembayaran (misalnya via Xendit customer / payment method). 
  - Melihat notifikasi pembayaran gagal dan melakukan retry/payment update. 

4. Finance 
  - Menerima request pembuatan invoice & faktur pajak dari platform (via email / dashboard). 
  - Membuat invoice dan faktur pajak di sistem akuntansi (misalnya Jurnal.id atau sistem internal). 
  - Meng-upload PDF invoice & faktur pajak ke platform. 
  - Mengelola pencatatan pembayaran manual (jika dibutuhkan). 

5. System / Integration (Service Account) 
  - Menjalankan proses backend seperti: 
  - Sinkronisasi status pembayaran dari Xendit (webhook / polling). 
  - Menjalankan provisioning / deprovisioning di Google Workspace & GCP. 
  - Menjadwalkan recurring billing. 

## 3. Entity & Tabel Utama (High-Level)

Secara garis besar, entitas penting yang perlu dimodelkan: 
- CUSTOMER_ORGANIZATIONS 
- CONTACT_PERSONS 
- PRODUCTS 
- PRICE_LISTS & DISCOUNTS 
- QUOTATIONS & QUOTATION_ITEMS 
- SUBSCRIPTIONS & SUBSCRIPTION_ITEMS 
- INVOICES (platform) & INVOICE_ITEMS 
- PAYMENTS & PAYMENT_ATTEMPTS 
- XENDIT_CUSTOMERS & XENDIT_SUBSCRIPTIONS 
- PROVISIONING_TASKS (untuk GWS & GCP) 
- WEBHOOK_EVENTS (Xendit) 

3.1. Entitas CUSTOMER_ORGANIZATIONS 

Tujuan: Menyimpan profil organisasi/perusahaan client. 

Atribut penting: 
- id – Primary key. 
- name – Nama perusahaan. 
- npwp – Nomor NPWP perusahaan. 
- billing_address – Alamat penagihan. 
- industry – (opsional) sektor industri. 
- size – (opsional) ukuran perusahaan (misalnya: SMALL, MID, ENTERPRISE). 
- contact_email – Email utama untuk komunikasi billing. 
- contact_phone – Nomor telepon utama (opsional). 
- created_at, updated_at – Timestamps. 

Relasi: 
- Satu CUSTOMER_ORGANIZATIONS memiliki banyak CONTACT_PERSONS. 
- Satu CUSTOMER_ORGANIZATIONS memiliki banyak QUOTATIONS dan SUBSCRIPTIONS. 

3.2. Entitas CONTACT_PERSONS 

Tujuan: Menyimpan informasi kontak personal di sisi client (misalnya IT manager, finance contact). 

Atribut penting: 
- id – Primary key. 
- customer_org_id – Foreign key ke CUSTOMER_ORGANIZATIONS. 
- name – Nama lengkap. 
- email – Email personal. 
- phone – Nomor telepon / WhatsApp. 
- role – Misalnya: IT_MANAGER, FINANCE_CONTACT, OWNER. 
- is_primary – Boolean, menandakan apakah ini kontak utama. 
- created_at, updated_at – Timestamps. 

Relasi: 
- Banyak CONTACT_PERSONS terkait ke satu CUSTOMER_ORGANIZATIONS. 
- Dapat dikaitkan sebagai contact di QUOTATIONS dan SUBSCRIPTIONS. 

3.3. Entitas PRODUCTS 

Tujuan: Menyimpan katalog produk yang dijual, termasuk Google Workspace (GWS), GCP, domain, managed services, addon, dsb. 

Atribut penting: 
- id – Primary key. 
- code – Kode unik produk (misalnya: GWS_BUSINESS_STARTER, GWS_BUSINESS_STANDARD, GCP_COMPUTE, DOMAIN_COM). 
- name – Nama produk. 
- category – Misalnya: GOOGLE_WORKSPACE, GCP, DOMAIN, MANAGED_SERVICE, ADDON. 
- billing_type – Misalnya: RECURRING, ONE_TIME. 
- billing_period – Misalnya: MONTHLY, YEARLY, ONE_TIME. 
- base_price – Harga dasar per unit (misalnya per user / per project / per domain). 
- currency – Misalnya: IDR, USD. 
- is_active – Boolean, menandakan apakah produk masih dijual. 
- metadata_json – JSON untuk menyimpan konfigurasi tambahan (misalnya untuk GCP: "project_based": true, dsb). 
- created_at, updated_at – Timestamps. 

Relasi: 
- Satu PRODUCTS dapat muncul di banyak QUOTATION_ITEMS dan SUBSCRIPTION_ITEMS. 
- Bisa dihubungkan dengan tabel PRICE_LISTS jika diperlukan variasi harga berdasarkan segment. 

3.4. Entitas PRICE_LISTS / PRODUCT_PRICES (Opsional) 

Jika diperlukan fleksibilitas harga berdasarkan segment / periode promo, maka: 

Atribut penting (PRICE_LISTS): 
- id – Primary key. 
- name – Nama price list. 
- description – Deskripsi singkat. 
- valid_from, valid_until – Periode berlaku (opsional). 
- created_at, updated_at. 

Atribut penting (PRODUCT_PRICES): 
- id – Primary key. 
- price_list_id – Foreign key ke PRICE_LISTS. 
- product_id – Foreign key ke PRODUCTS. 
- price – Harga spesifik untuk produk ini dalam price list terkait. 
- currency. 
- billing_period_override – Opsional, jika beda dari PRODUCTS. 
- created_at, updated_at. 

Relasi: 
- Satu PRICE_LISTS memiliki banyak PRODUCT_PRICES. 
- Satu PRODUCTS dapat memiliki banyak PRODUCT_PRICES di price list berbeda. 
- QUOTATIONS dapat merujuk ke satu PRICE_LISTS untuk penetapan harga. 

3.5. Entitas QUOTATIONS 

Tujuan: Menyimpan data quotation (penawaran) yang dibuat oleh Sales. 

Atribut penting: 
- id – Primary key (bisa auto-generated). 
- quotation_number – Nomor quotation yang human-readable (misalnya: Q-2025-00123). 
- customer_org_id – Foreign key ke CUSTOMER_ORGANIZATIONS. 
- contact_person_id – Foreign key ke CONTACT_PERSONS (kontak utama untuk quotation ini). 
- price_list_id – Foreign key ke PRICE_LISTS (opsional). 
- sales_user_id – ID user Sales yang membuat. 
- status – Misalnya: DRAFT, SENT, ACCEPTED, REJECTED, EXPIRED. 
- valid_until – Tanggal kadaluarsa quotation. 
- notes – Catatan tambahan dari Sales. 
- pdf_url – URL ke PDF quotation yang di-host di Cosmic (atau storage lain). 
- cosmic_id – ID dokumen di Cosmic (jika disimpan di headless CMS). 
- created_at, updated_at. 

Relasi: 
- Satu QUOTATIONS memiliki banyak QUOTATION_ITEMS. 
- QUOTATIONS dapat dikonversi menjadi SUBSCRIPTIONS ketika ACCEPTED. 

3.6. Entitas QUOTATION_ITEMS 

Tujuan: Menyimpan detail item dalam quotation (produk dan jumlah). 

Atribut penting: 
- id – Primary key. 
- quotation_id – Foreign key ke QUOTATIONS. 
- product_id – Foreign key ke PRODUCTS. 
- description – Deskripsi custom (jika diperlukan). 
- quantity – Jumlah unit (misalnya jumlah user untuk GWS). 
- unit_price – Harga per unit yang disepakati (bisa override dari price list). 
- discount_amount – Diskon nominal (opsional). 
- discount_percent – Diskon persentase (opsional). 
- subtotal – Hasil perhitungan (quantity * unit_price - discount). 
- billing_period – Misalnya MONTHLY, YEARLY, ONE_TIME (jika berbeda per item). 
- metadata_json – Konfigurasi tambahan (misalnya lokasi, project id, dsb). 
- created_at, updated_at. 

Relasi: 
- Banyak QUOTATION_ITEMS terkait ke satu QUOTATIONS. 
- Setiap item mengacu ke satu PRODUCTS. 

3.7. Entitas SUBSCRIPTIONS 

Tujuan: Menyimpan subscription aktif atau historis milik client. 

Atribut penting: 
- id – Primary key. 
- subscription_code – Kode human-readable (opsional). 
- customer_org_id – Foreign key ke CUSTOMER_ORGANIZATIONS. 
- quotation_id – Foreign key ke QUOTATIONS yang menjadi dasar subscription (opsional untuk manual). 
- status – Misalnya: ACTIVE, SUSPENDED, CANCELLED, EXPIRED, PENDING_ACTIVATION. 
- start_date – Tanggal mulai subscription. 
- end_date – Tanggal akhir (jika fixed-term) atau nullable jika indefinite dengan recurring billing. 
- billing_period – Misalnya: MONTHLY, YEARLY. 
- payment_method_type – Misalnya: XENDIT_RECURRING, MANUAL_TRANSFER. 
- xendit_customer_id – Foreign key ke XENDIT_CUSTOMERS (jika recurring via Xendit). 
- next_billing_date – Tanggal berikutnya untuk penagihan (untuk recurring). 
- last_billed_date – Tanggal terakhir penagihan dilakukan (opsional). 
- created_at, updated_at. 

Relasi: 
- Satu SUBSCRIPTIONS memiliki banyak SUBSCRIPTION_ITEMS. 
- Satu SUBSCRIPTIONS memiliki banyak INVOICES (jika invoice per periode). 

3.8. Entitas SUBSCRIPTION_ITEMS 

Tujuan: Menyimpan detail produk apa saja yang termasuk dalam suatu subscription. 

Atribut penting: 
- id – Primary key. 
- subscription_id – Foreign key ke SUBSCRIPTIONS. 
- product_id – Foreign key ke PRODUCTS. 
- description – Deskripsi custom (opsional). 
- quantity – Jumlah unit yang aktif. 
- unit_price – Harga per unit. 
- billing_period – Billing per item (jika diperlukan). 
- is_trial – Boolean, apakah item ini dalam masa trial. 
- trial_end_date – Tanggal akhir trial. 
- metadata_json – Konfigurasi tambahan (misalnya domain untuk GWS, project id untuk GCP). 
- created_at, updated_at. 

Relasi: 
- Banyak SUBSCRIPTION_ITEMS terkait ke satu SUBSCRIPTIONS. 
- SUBSCRIPTION_ITEMS dapat dikaitkan dengan PROVISIONING_TASKS. 

3.9. Entitas INVOICES (Platform) 

Tujuan: Menyimpan invoice yang di-generate oleh platform sebagai representasi tagihan ke client. 

Atribut penting: 
- id – Primary key. 
- invoice_number – Nomor invoice human-readable (misalnya: INV-2025-000123). 
- subscription_id – Foreign key ke SUBSCRIPTIONS. 
- customer_org_id – Foreign key ke CUSTOMER_ORGANIZATIONS. 
- billing_period_start, billing_period_end – Periode layanan yang ditagihkan. 
- due_date – Tanggal jatuh tempo. 
- status – Misalnya: DRAFT, PENDING, PAID, OVERDUE, CANCELLED. 
- total_amount – Jumlah total tagihan. 
- currency – Mata uang. 
- pdf_url – URL ke PDF invoice (jika platform generate). 
- external_invoice_reference – Referensi ke sistem akuntansi eksternal (misalnya nomor invoice di Jurnal.id). 
- created_at, updated_at. 

Relasi: 
- Satu INVOICES memiliki banyak INVOICE_ITEMS. 
- Satu INVOICES terkait ke satu SUBSCRIPTIONS. 

3.10. Entitas INVOICE_ITEMS 

Tujuan: Menyimpan detail item dalam invoice (mirip QUOTATION_ITEMS, tetapi untuk billing). 

Atribut penting: 
- id – Primary key. 
- invoice_id – Foreign key ke INVOICES. 
- subscription_item_id – Foreign key ke SUBSCRIPTION_ITEMS (opsional). 
- description – Deskripsi item (misalnya: "Google Workspace Business Starter 50 users"). 
- quantity – Jumlah unit. 
- unit_price – Harga per unit. 
- discount_amount, discount_percent – Diskon. 
- subtotal – Nominal total item. 
- metadata_json – Informasi tambahan (misalnya periode layanan spesifik). 
- created_at, updated_at. 

Relasi: 
- Banyak INVOICE_ITEMS terkait ke satu INVOICES. 

3.11. Entitas PAYMENTS 

Tujuan: Menyimpan informasi pembayaran yang dilakukan client terhadap invoice. 

Atribut penting: 
- id – Primary key. 
- invoice_id – Foreign key ke INVOICES. 
- amount – Nominal yang dibayar. 
- currency. 
- payment_date – Tanggal pembayaran. 
- payment_method – Misalnya: VIRTUAL_ACCOUNT, CREDIT_CARD, MANUAL_TRANSFER. 
- status – Misalnya: PENDING, SUCCESS, FAILED, REFUNDED. 
- xendit_payment_reference – Referensi ke payment id di Xendit (jika ada). 
- created_at, updated_at. 

Relasi: 
- Satu INVOICES dapat memiliki banyak PAYMENTS (misal partial payments). 

3.12. Entitas PAYMENT_ATTEMPTS (Opsional) 

Tujuan: Melacak setiap attempt penagihan recurring (misalnya dari Xendit subscription). 

Atribut penting: 
- id – Primary key. 
- subscription_id – Foreign key ke SUBSCRIPTIONS. 
- invoice_id – Foreign key ke INVOICES (jika invoice sudah dibuat). 
- attempt_date – Tanggal attempt. 
- amount – Nominal yang dicoba ditagihkan. 
- status – PENDING, SUCCESS, FAILED. 
- failure_reason – Keterangan jika gagal (misalnya kartu kadaluarsa). 
- xendit_subscription_id – Referensi ke subscription di Xendit. 
- xendit_charge_id – Referensi ke charge di Xendit (jika ada). 
- created_at, updated_at. 

Relasi: 
- Banyak PAYMENT_ATTEMPTS terkait ke satu SUBSCRIPTIONS. 

3.13. Entitas XENDIT_CUSTOMERS 

Tujuan: Menyimpan referensi customer di Xendit (untuk recurring billing dan payment method). 

Atribut penting: 
- id – Primary key. 
- customer_org_id – Foreign key ke CUSTOMER_ORGANIZATIONS. 
- xendit_customer_id – ID customer dari Xendit. 
- email – Email terdaftar di Xendit. 
- phone – No HP di Xendit. 
- name – Nama customer di Xendit. 
- metadata_json – Data tambahan (misalnya method yang disimpan). 
- created_at, updated_at. 

Relasi: 
- Satu CUSTOMER_ORGANIZATIONS dapat memiliki satu atau lebih XENDIT_CUSTOMERS (misalnya jika ada beberapa profil). 

3.14. Entitas XENDIT_SUBSCRIPTIONS 

Tujuan: Menyimpan referensi subscription recurring di Xendit yang terkait dengan SUBSCRIPTIONS platform. 

Atribut penting: 
- id – Primary key. 
- subscription_id – Foreign key ke SUBSCRIPTIONS. 
- xendit_subscription_id – ID subscription di Xendit. 
- xendit_customer_id – ID customer di Xendit (foreign key ke XENDIT_CUSTOMERS). 
- status – ACTIVE, PAUSED, CANCELLED. 
- amount – Nominal recurring yang akan ditagihkan. 
- interval – Misalnya: MONTH, YEAR. 
- created_at, updated_at. 

Relasi: 
- Satu SUBSCRIPTIONS memiliki nol atau satu XENDIT_SUBSCRIPTIONS (jika billing via Xendit). 

3.15. Entitas PROVISIONING_TASKS 

Tujuan: Menyimpan task provisioning / deprovisioning ke sistem eksternal seperti Google Workspace dan GCP. 

Atribut penting: 
- id – Primary key. 
- subscription_item_id – Foreign key ke SUBSCRIPTION_ITEMS. 
- action – Misalnya: ACTIVATE, SUSPEND, CHANGE_QUANTITY, TERMINATE. 
- target_system – GWORKSPACE atau GCP. 
- payload_json – Data yang dibutuhkan untuk panggilan API (domain, user list, project ID, dsb). 
- status – PENDING, RUNNING, SUCCESS, FAILED. 
- external_reference – ID job/task di sistem eksternal (jika ada). 
- error_message – Keterangan error (jika gagal). 
- Timestamps created_at, executed_at. 

Relasi: 
- Banyak PROVISIONING_TASKS terkait ke satu SUBSCRIPTION_ITEMS. 

3.16. Entitas WEBHOOK_EVENTS 

Tujuan: 
- Menyimpan log webhook dari Xendit (payment success, failed, subscription charge). 

Atribut penting: 
- id – Primary key. 
- source – Untuk saat ini misalnya XENDIT. 
- event_type – Misalnya: 
  - PAYMENT_SUCCEEDED 
  - PAYMENT_FAILED 
  - SUBSCRIPTION_CHARGED 
- raw_payload_json – Payload lengkap dari Xendit untuk audit/debug. 
- xendit_subscription_id – ID subscription yang terkait (jika ada). 
- xendit_invoice_id – ID invoice di Xendit (jika ada). 
- processed – Boolean, menandakan apakah event sudah diproses oleh workflow. 
- processed_at – Timestamp pemrosesan. 
- created_at – Timestamp event diterima. 

Relasi: 
- Satu WEBHOOK_EVENTS dapat menghasilkan atau meng-update satu atau lebih entitas internal (PAYMENTS, PAYMENT_ATTEMPTS, INVOICES). 

## 4. Logika & Aturan Bisnis (High-Level)

4.1. Pembuatan Quotation oleh Sales 

Alur: 
- Sales login ke platform. 
- Sales memilih atau membuat CUSTOMER_ORGANIZATIONS baru (jika belum ada). 
- Sales menambahkan CONTACT_PERSONS (opsional, minimal satu kontak utama). 
- Sales membuat QUOTATIONS dengan mengisi: 
  - customer_org_id 
  - contact_person_id 
  - price_list_id (opsional) 
  - valid_until 
  - notes 
- Sales menambahkan QUOTATION_ITEMS: 
  - Memilih PRODUCTS 
  - Mengisi quantity 
  - Mengatur harga (unit_price) & diskon jika diperlukan 
- Platform menghitung subtotal per item dan total quotation. 
- Sales menyimpan quotation sebagai DRAFT atau langsung mark sebagai SENT. 

Aturan bisnis: 
- QUOTATIONS yang sudah ACCEPTED tidak boleh diedit signifikan (kecuali catatan tertentu). 
- QUOTATIONS dapat EXPIRED secara otomatis setelah valid_until lewat. 

4.2. Generate PDF Quotation & Simpan ke Cosmic 

Alur: 
- Saat Sales klik "Generate PDF & Kirim ke Client": 
  - Platform membuat payload JSON berisi: 
    - Data CUSTOMER_ORGANIZATIONS 
    - Data CONTACT_PERSONS 
    - Data QUOTATIONS dan QUOTATION_ITEMS 
  - Platform memanggil API Cosmic (atau service lain) untuk generate PDF: 
    - Cosmic menerima data, merender template, dan menghasilkan PDF quotation. 
  - Cosmic mengembalikan cosmic_id dan pdf_url. 
  - Platform menyimpan cosmic_id dan pdf_url ke QUOTATIONS. 

4.3. Kirim Email Penawaran ke Client 

Alur: 
- Platform menyiapkan template email penawaran. 
- LLM/Gemini digunakan untuk menghasilkan body email yang disesuaikan (misalnya: highlight manfaat, ringkasan harga). 
- Email dikirim via Gmail API (atas nama Sales), dengan: 
  - Lampiran PDF quotation (dari pdf_url). 
  - Link ke PDF (opsional). 
- Status QUOTATIONS diupdate menjadi SENT. 

4.4. Client Menerima & Mereview Quotation 

Alur (simplifikasi): 
- Client menerima email. 
- Client bisa membalas email untuk negosiasi harga (di luar sistem, manual). 
- Setelah disepakati, Sales dapat menandai QUOTATIONS sebagai ACCEPTED. 

4.5. Sales Menandai Quotation sebagai ACCEPTED & Request Invoice 

Alur: 
- Sales membuka QUOTATIONS di platform dan klik "Mark as ACCEPTED & Request Invoice". 
- Platform mengubah status QUOTATIONS menjadi ACCEPTED. 
- Platform membuat "request" ke Finance, misalnya dengan: 
  - Mengirim email ke Finance dengan ringkasan quotation, data perusahaan, dan instruksi pembuatan invoice & faktur pajak. 
  - Atau membuat record internal yang bisa dilihat Finance di dashboard. 

Aturan bisnis: 
- Hanya QUOTATIONS dengan status SENT yang bisa di-ACCEPT. 
- Setelah ACCEPTED, akan menjadi dasar pembuatan SUBSCRIPTIONS dan INVOICES. 

4.6. Finance Membuat Invoice & Faktur Pajak di Sistem Akuntansi 

Alur (tingkat tinggi): 
- Finance menerima notifikasi request dari platform. 
- Finance membuat invoice di sistem akuntansi (Jurnal.id / lainnya) dan faktur pajak di eFaktur. 
- Finance mendownload PDF invoice & PDF faktur pajak. 

4.7. Finance Upload Invoice & Faktur Pajak ke Platform 

Alur: 
- Finance login ke platform. 
- Finance membuka request / QUOTATIONS yang telah ACCEPTED. 
- Finance meng-upload PDF invoice dan faktur pajak. 
- Platform menyimpan file ke storage (misalnya S3/GCS) dan mengisi: 
  - INVOICES record baru dengan: 
    - invoice_number (diambil dari sistem akuntansi) 
    - customer_org_id 
    - subscription_id (jika sudah terbentuk) atau pre-subscription 
    - total_amount 
    - due_date 
    - pdf_url 
  - Metadata faktur pajak (nomor, tanggal, dsb) di metadata_json. 

4.8. Platform Membuat Link Pembayaran Xendit 

Alur: 
- Setelah invoice disimpan, platform akan memanggil API Xendit untuk membuat: 
  - Payment Link atau 
  - Invoice Xendit, atau 
  - Recurring subscription (jika langsung recurring). 
- Xendit mengembalikan payment_url / invoice_url / subscription_id. 
- Platform menyimpan referensi ini di INVOICES atau XENDIT_SUBSCRIPTIONS. 

4.9. Kirim Email ke Client Berisi Invoice & Link Pembayaran 

Alur: 
- Platform mengirim email ke client (billing contact): 
  - Melampirkan PDF invoice dan faktur pajak (opsional). 
  - Menyertakan link pembayaran Xendit. 
- Status INVOICES menjadi PENDING. 

4.10. Client Melakukan Pembayaran Pertama 

Alur: 
- Client klik link pembayaran Xendit dan melakukan pembayaran (VA, kartu, dsb). 
- Xendit memproses pembayaran dan mengirim webhook ke platform: 
  - Event PAYMENT_SUCCEEDED atau sejenisnya. 
- Platform menerima webhook dan: 
  - Menyimpan WEBHOOK_EVENTS. 
  - Mengupdate PAYMENTS dan INVOICES (status menjadi PAID). 
  - Jika ini adalah pembayaran pertama untuk SUBSCRIPTIONS tertentu, platform akan: 
    - Membuat SUBSCRIPTIONS dan SUBSCRIPTION_ITEMS berdasarkan QUOTATIONS. 
    - Menjadwalkan recurring billing (jika lewat Xendit subscription). 
    - Membuat PROVISIONING_TASKS untuk mengaktifkan layanan di GWS/GCP. 

4.11. Provisioning Google Workspace & GCP 

Alur untuk Google Workspace: 
- PROVISIONING_TASKS dengan target_system = GWORKSPACE dibuat untuk setiap SUBSCRIPTION_ITEMS terkait GWS. 
- Worker / service backend membaca PROVISIONING_TASKS dan memanggil Google Admin SDK: 
  - Mengaktifkan lisensi GWS untuk domain tertentu. 
  - Menambah atau mengurangi seat (quantity). 
- Status PROVISIONING_TASKS diupdate menjadi SUCCESS atau FAILED. 

Alur untuk GCP: 
- PROVISIONING_TASKS dengan target_system = GCP memanggil API GCP: 
  - Mengaktifkan billing untuk project. 
  - Mengatur kuota / limit (jika ada). 
- Status diupdate sesuai hasil. 

4.12. Recurring Billing & Invoice Periode Berikutnya 

Alur: 
- Menjelang next_billing_date, platform atau Xendit membuat recurring charge. 
- Jika menggunakan Xendit subscription: 
  - Xendit mengirim webhook SUBSCRIPTION_CHARGED atau PAYMENT_SUCCEEDED. 
  - Platform membuat INVOICES baru untuk periode layanan berikutnya. 
  - PAYMENTS dibuat berdasarkan data webhook. 
- Jika platform yang mengontrol: 
  - Cron job di platform membaca SUBSCRIPTIONS dengan next_billing_date hari ini. 
  - Platform membuat INVOICES dan memanggil Xendit API untuk charge payment method yang tersimpan. 

4.13. Gagal Bayar & Dunning 

Alur: 
- Jika pembayaran gagal (PAYMENT_FAILED dari webhook): 
  - Platform mencatat PAYMENT_ATTEMPTS dengan status FAILED. 
  - Platform mengirim email ke client untuk menginformasikan kegagalan dan meminta update payment method. 
  - Setelah beberapa kali gagal (misalnya 3x) dan melewati grace period, status SUBSCRIPTIONS dapat diubah menjadi SUSPENDED. 
  - PROVISIONING_TASKS dapat dibuat untuk menonaktifkan layanan di GWS/GCP. 

4.14. Perubahan Kuantitas (Upsell/Downsell) 

Alur: 
- Sales / Client meminta perubahan jumlah user (misalnya dari 50 ke 70 user GWS). 
- Platform membuat perubahan pada SUBSCRIPTION_ITEMS (quantity). 
- Jika terjadi di tengah periode billing: 
  - Platform dapat menghitung prorata dan membuat invoice tambahan. 
- PROVISIONING_TASKS dibuat untuk menambah/mengurangi seat di GWS/GCP. 

4.15. Cancellation & Refund (High-Level) 

Alur: 
- Client meminta berhenti langganan. 
- Sales / Admin mengubah status SUBSCRIPTIONS menjadi CANCELLED dan mengatur end_date. 
- PROVISIONING_TASKS dibuat untuk menonaktifkan layanan di GWS/GCP. 
- Refund (jika ada) mengikuti kebijakan tertentu dan dicatat di PAYMENTS dengan status REFUNDED. 

## 5. Alur Proses: Quotation, Subscription, Invoice & Payment

Ringkasan alur besar: 
- Quotation dibuat oleh Sales → PDF → Email ke Client 
1. Sales membuat quotation di platform 
  - Sales login ke platform. 
  - Sales memilih customer dan mengisi item penawaran (product, quantity, harga). 
2. Sales generate PDF quotation via Cosmic 
  - Platform kirim data quotation ke Cosmic, Cosmic mengembalikan cosmic_id dan pdf_url. 
3. Platform mengirim email penawaran ke client 
  - Body email digenerate LLM, lampirkan PDF. 
- Quotation ACCEPTED → Request invoice ke Finance 
4. Sales menandai quotation sebagai ACCEPTED 
  - Memicu request ke Finance untuk pembuatan invoice & faktur pajak. 
- Finance membuat invoice & faktur pajak di sistem akuntansi 
5. Finance membuat invoice & faktur pajak 
  - Menggunakan sistem akuntansi eksternal. 
- Finance upload invoice & faktur pajak ke platform 
6. Finance meng-upload PDF ke platform 
  - Platform menyimpan INVOICES dan URL file. 
- Platform membuat link pembayaran via Xendit 
7. Platform memanggil API Xendit 
  - Membuat payment link atau invoice Xendit. 
- Platform kirim email invoice + link pembayaran ke client 
8. Email dikirim ke client 
  - Berisi ringkasan tagihan, PDF, dan link pembayaran. 
- Client bayar → Xendit webhook → platform update status + provisioning 
9. Client membayar via Xendit 
  - Xendit mengirim webhook ke platform. 
10. Platform update PAYMENTS & INVOICES 
  - Jika sukses, status INVOICES = PAID. 
11. Platform membuat SUBSCRIPTIONS & SUBSCRIPTION_ITEMS 
  - Berdasarkan QUOTATIONS yang di-ACCEPTED. 
12. Platform membuat PROVISIONING_TASKS 
  - Untuk mengaktifkan layanan di GWS/GCP. 

## 6. Perubahan Subscription & Renewal

6.1. Renewal Otomatis via Recurring Billing 

Alur: 
- SUBSCRIPTIONS dengan billing_period = YEARLY dan payment_method_type = XENDIT_RECURRING akan diperpanjang otomatis. 
- Menjelang masa berakhir, platform atau Xendit melakukan charge untuk periode berikutnya. 
- Jika sukses: 
  - end_date diperpanjang (misalnya +1 tahun). 
  - INVOICES baru dibuat. 

6.2. Upgrade / Downgrade Paket 

Alur: 
- Client ingin upgrade dari Business Starter ke Business Standard. 
- Sales / Admin mengubah SUBSCRIPTION_ITEMS: 
  - Menonaktifkan item lama. 
  - Mengaktifkan item baru. 
- Platform dapat membuat invoice prorata atau perubahan berlaku di periode berikutnya. 

## 7. Pembatalan (Cancellation) & Refund (Opsional)

7.1. Cancellation oleh Client 

Alur: 
- Client mengajukan permintaan berhenti langganan. 
- Sales / Admin mengubah status SUBSCRIPTIONS menjadi CANCELLED, mengatur end_date. 
- PROVISIONING_TASKS dibuat untuk menonaktifkan layanan. 

7.2. Refund (Jika Diperlukan) 

Alur: 
- Jika terdapat kebijakan refund (misal prorated), Finance melakukan perhitungan dan mencatat refund sebagai: 
  - PAYMENTS baru dengan status REFUNDED. 
- Platform dapat menyimpan catatan tambahan di metadata_json PAYMENTS. 

## 8. BI & Reporting untuk Finance

- Finance dapat login ke platform (role FINANCE). 
- Dapat melihat: 
  - Laporan pendapatan per produk / kategori. 
  - Aging report invoice (invoice yang overdue). 
  - Daftar client dengan pembayaran gagal berulang. 
  - Laporan subscription aktif vs cancelled. 

## 9. Integrasi dengan Sistem Eksternal

9.1. Integrasi dengan Google Workspace 

- Menggunakan Google Admin SDK untuk: 
  - Mengatur lisensi per user. 
  - Menambah/mengurangi jumlah seat. 

9.2. Integrasi dengan GCP 

- Menggunakan API GCP untuk: 
  - Mengaktifkan billing pada project. 
  - Mengatur limit / konfigurasi lain jika perlu. 

9.3. Integrasi dengan Xendit 

- Menggunakan API Xendit untuk: 
  - Membuat payment link / invoice. 
  - Mengelola recurring subscription. 
  - Menerima webhook untuk event pembayaran. 

## 10. Pertimbangan Teknis & Non-Fungsional

- Keamanan data (enkripsi, akses role-based). 
- Audit trail untuk perubahan penting (status subscription, perubahan harga, dsb). 
- Skalabilitas untuk menangani banyak subscription dan event webhook. 
- Observability: logging, monitoring, alerting untuk gagal provisioning dan gagal bayar. 

## 11. Backoffice & Admin Panel (Opsional)

- Admin panel untuk: 
  - Mengelola master data (PRODUCTS, PRICE_LISTS). 
  - Monitoring subscription & payment status. 
  - Manual override jika terjadi masalah integrasi. 

## 12. Catatan Tambahan & Asumsi

- Beberapa detail teknis implementasi (misalnya skema autentikasi, detail payload JSON ke Cosmic, struktur detail API Xendit) tidak dimasukkan secara lengkap dan akan dijabarkan di dokumen teknis turunan. 
- Asumsi bahwa: 
  - Infrastruktur dan konfigurasi dasar Google Workspace & GCP sudah tersedia. 
  - Sistem akuntansi eksternal sudah mendukung export nomor invoice dan faktur pajak yang bisa direferensikan di platform. 

## 13. Ringkasan Singkat

Dokumen ini merumuskan desain data dan workflow utama untuk platform subscription yang menangani: 
- Pembuatan quotation oleh Sales hingga menjadi subscription. 
- Pengelolaan invoice & pembayaran (termasuk recurring). 
- Integrasi dengan Xendit, Google Workspace, dan GCP. 
- Alur provisioning dan deprovisioning layanan. 

Struktur entitas dan alur proses ini dapat dijadikan fondasi untuk implementasi backend, frontend, dan orkestrasi workflow yang lebih detail di tahap berikutnya.
