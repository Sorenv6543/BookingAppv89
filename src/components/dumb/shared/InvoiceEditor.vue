<template>
  <div class="invoice-wrapper">
    <!-- Toolbar -->
    <div class="invoice-toolbar" :class="{ 'hide-for-print': printing }">
      <v-btn
        variant="outlined"
        size="small"
        :prepend-icon="paymentFulfilled ? 'mdi-check-circle' : 'mdi-circle-outline'"
        :color="paymentFulfilled ? 'success' : 'grey'"
        @click="paymentFulfilled = !paymentFulfilled"
      >
        {{ paymentFulfilled ? 'Fulfilled' : 'Mark Fulfilled' }}
      </v-btn>
      <v-btn
        color="primary"
        size="small"
        prepend-icon="mdi-file-pdf-box"
        :loading="printing"
        @click="exportPDF"
      >
        Download PDF
      </v-btn>
    </div>

    <!-- Invoice -->
    <div ref="invoiceRef" class="invoice-page" :class="{ 'printing': printing }">
      <!-- Top accent bar -->
      <div class="top-bar"></div>

      <!-- Header -->
      <div class="header-section">
        <div class="header-left">
          <div class="invoice-title">INVOICE</div>
          <div class="invoice-meta">
            <div class="meta-line">
              Invoice Number:
              <input v-model="invoice.number" class="editable" />
            </div>
            <div class="meta-line">
              Invoice Date:
              <input v-model="invoice.date" class="editable" />
            </div>
          </div>
        </div>
        <div class="header-right">
          <div class="company-logo-area">
            <!-- Logo placeholder -->
          </div>
          <div class="company-name">Eduardo's Roofing</div>
          <div class="company-info">
            <input v-model="company.name" class="editable align-right" />
            <input v-model="company.address" class="editable align-right" />
            <input v-model="company.city" class="editable align-right" />
            <input v-model="company.phone" class="editable align-right bold" />
          </div>
        </div>
      </div>

      <!-- Bill To -->
      <div class="bill-to-section">
        <div class="bill-to-label">BILL TO:</div>
        <input v-model="billTo.name" class="editable bold" />
        <input v-model="billTo.address" class="editable" />
        <input v-model="billTo.email" class="editable" />
      </div>

      <!-- Line Items Table -->
      <div class="table-section">
        <table class="invoice-table">
          <thead>
            <tr>
              <th class="col-no">No.</th>
              <th class="col-desc"></th>
              <th class="col-qty">Qty.</th>
              <th class="col-price">Price</th>
              <th class="col-total">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in lineItems" :key="i">
              <td class="col-no">{{ i + 1 }}</td>
              <td class="col-desc">
                <input v-model="item.description" class="editable bold" />
              </td>
              <td class="col-qty">
                <input
                  :value="item.qty"
                  type="number"
                  min="0"
                  class="editable center"
                  @input="item.qty = parseNum($event)"
                />
              </td>
              <td class="col-price">
                <input
                  :value="formatCurrency(item.price)"
                  class="editable center"
                  @focus="onPriceFocus($event, i)"
                  @blur="onPriceBlur($event, i)"
                />
              </td>
              <td class="col-total"></td>
            </tr>
            <!-- Subtotal row inside table -->
            <tr class="total-row">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td class="col-total">{{ formatCurrency(subtotal) }}</td>
            </tr>
            <!-- Empty rows -->
            <tr class="empty-row"><td colspan="5"></td></tr>
            <tr class="empty-row"><td colspan="5"></td></tr>
          </tbody>
        </table>
      </div>

      <!-- Bottom Section -->
      <div class="bottom-section">
        <div class="payment-method">
          <div class="pm-title">PAYMENT METHOD</div>
          <input v-model="payment.line1" class="editable bold" />
          <input v-model="payment.line2" class="editable" />
          <input v-model="payment.line3" class="editable" />
        </div>
        <div class="totals-box">
          <div class="totals-row">
            <div class="totals-label">Subtotal</div>
            <div class="totals-value">{{ formatCurrency(subtotal) }}</div>
          </div>
          <div class="totals-row">
            <div class="totals-label">Tax</div>
            <div class="totals-value"></div>
          </div>
          <div class="totals-row">
            <div class="totals-label">Grand Total</div>
            <div class="totals-value">{{ formatCurrency(grandTotal) }}</div>
          </div>
        </div>
      </div>

      <!-- Payment Fulfilled Stamp -->
      <div v-if="paymentFulfilled" class="stamp-section">
        <div class="stamp-text">PAYMENT FULFILLED</div>
      </div>

      <!-- Footer -->
      <div class="footer-bar">
        <span>Thank you for your business!</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface LineItem {
  description: string
  qty: number
  price: number
}

const printing = ref(false)
const invoiceRef = ref<HTMLElement | null>(null)
const paymentFulfilled = ref(true)

const invoice = ref({
  number: '0401',
  date: '17/10/25',
})

const company = ref({
  name: 'Eduardo Cerritos',
  address: '32540 Wishing Well Trl B',
  city: 'Cathedral City, CA 92234',
  phone: '760-424-9298',
})

const billTo = ref({
  name: 'Debbie Hobbs',
  address: '3330 Savanna Trail, Palm Springs, CA',
  email: 'gr8sewr@yahoo.com',
})

const lineItems = ref<LineItem[]>([
  { description: 'Valley Metals Fixed Tiles that slid off', qty: 1, price: 150 },
  { description: 'Valley Metals Fixed Tiles that slid off', qty: 1, price: 700 },
  { description: 'Valley Metals Fixed Tiles that slid off', qty: 1, price: 700 },
  { description: 'Valley Metals Fixed Tiles that slid off', qty: 1, price: 700 },
  { description: 'Valley Metals Fixed Tiles that slid off', qty: 1, price: 700 },
])

const payment = ref({
  line1: 'Check',
  line2: 'Zelle: 760 218 8039',
  line3: 'Venmo: @Eduardo-Cerritos-1',
})

const subtotal = computed(() =>
  lineItems.value.reduce((sum, item) => sum + item.qty * item.price, 0)
)

const grandTotal = computed(() => subtotal.value)

function formatCurrency(val: number): string {
  return '$' + val.toLocaleString('en-US')
}

function parseNum(e: Event): number {
  const v = (e.target as HTMLInputElement).value
  const n = parseInt(v, 10)
  return isNaN(n) ? 0 : n
}

function onPriceFocus(e: FocusEvent, idx: number) {
  const input = e.target as HTMLInputElement
  input.value = String(lineItems.value[idx].price)
  input.select()
}

function onPriceBlur(e: FocusEvent, idx: number) {
  const input = e.target as HTMLInputElement
  const raw = input.value.replace(/[^0-9.]/g, '')
  const n = parseFloat(raw)
  lineItems.value[idx].price = isNaN(n) ? 0 : n
  input.value = formatCurrency(lineItems.value[idx].price)
}

async function exportPDF() {
  if (!invoiceRef.value) return
  printing.value = true

  // Dynamic import to keep bundle small
  const html2pdf = (await import('html2pdf.js')).default

  await new Promise(r => setTimeout(r, 100)) // Let Vue re-render

  try {
    await html2pdf()
      .set({
        margin: 0,
        filename: `invoice-${invoice.value.number}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(invoiceRef.value)
      .save()
  } finally {
    printing.value = false
  }
}
</script>

<style scoped>
.invoice-wrapper {
  max-width: 850px;
  margin: 0 auto;
  padding: 16px;
}

.invoice-toolbar {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.hide-for-print {
  /* toolbar visible normally, hidden during PDF capture via .printing class on invoice */
}

/* ---- Invoice Page ---- */
.invoice-page {
  background: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  font-family: 'Inter', sans-serif;
  color: #3C4555;
  line-height: 1.5;
}

.invoice-page.printing .editable {
  border-color: transparent !important;
  background: transparent !important;
  outline: none !important;
}

/* Top accent bar */
.top-bar {
  height: 8px;
  background: #C5CDD6;
}

/* ---- Editable inputs ---- */
.editable {
  background: transparent;
  border: 1px solid transparent;
  border-radius: 2px;
  font: inherit;
  color: inherit;
  padding: 1px 4px;
  margin: 0;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.15s, background 0.15s;
}

.editable:hover {
  border-color: #C5CDD6;
}

.editable:focus {
  outline: none;
  border-color: #4A5568;
  background: #f9fafb;
}

.editable.bold { font-weight: 600; }
.editable.center { text-align: center; }
.editable.align-right { text-align: right; }

/* Hide number spinners */
.editable[type='number']::-webkit-inner-spin-button,
.editable[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.editable[type='number'] { -moz-appearance: textfield; }

/* ---- Header ---- */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 40px 48px 20px 48px;
}

.invoice-title {
  font-size: 42px;
  font-weight: 900;
  font-style: italic;
  color: #3C4555;
  line-height: 1;
  margin-bottom: 16px;
}

.invoice-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 13px;
}

.meta-line {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  font-weight: 500;
}

.meta-line .editable {
  width: 120px;
  font-weight: 500;
}

.header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.company-logo-area {
  width: 200px;
  height: 50px;
  background: #f5f5f5;
  border-radius: 2px;
}

.company-name {
  font-size: 24px;
  font-weight: 700;
  font-style: italic;
  color: #3C4555;
}

.company-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  font-size: 13px;
  width: 260px;
}

/* ---- Bill To ---- */
.bill-to-section {
  padding: 20px 48px 32px 48px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 13px;
}

.bill-to-label {
  font-weight: 700;
  margin-bottom: 2px;
}

.bill-to-section .editable {
  width: 350px;
}

/* ---- Table ---- */
.table-section {
  padding: 0 48px;
}

.invoice-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.invoice-table th {
  background: #4A5568;
  color: #ffffff;
  font-weight: 600;
  text-align: center;
  padding: 10px 8px;
  border: 1px solid #3C4555;
}

.invoice-table td {
  border: 1px solid #D0D5DD;
  padding: 8px;
  vertical-align: middle;
}

.col-no { width: 60px; text-align: center; }
.col-desc { }
.col-qty { width: 60px; text-align: center; }
.col-price { width: 80px; text-align: center; }
.col-total { width: 80px; text-align: center; font-weight: 600; }

.total-row td {
  border-top: 2px solid #D0D5DD;
}

.empty-row td {
  height: 32px;
}

/* ---- Bottom Section ---- */
.bottom-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 32px 48px;
}

.payment-method {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 13px;
}

.pm-title {
  font-weight: 700;
  margin-bottom: 4px;
}

.payment-method .editable {
  width: 260px;
}

.totals-box {
  width: 260px;
}

.totals-row {
  display: flex;
  border: 1px solid #D0D5DD;
  height: 36px;
}

.totals-label {
  flex: 1;
  background: #4A5568;
  color: #ffffff;
  font-size: 12px;
  display: flex;
  align-items: center;
  padding: 0 12px;
}

.totals-value {
  width: 100px;
  background: #ffffff;
  font-size: 14px;
  font-weight: 700;
  color: #3C4555;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ---- Stamp ---- */
.stamp-section {
  display: flex;
  justify-content: flex-end;
  padding: 8px 48px;
}

.stamp-text {
  font-size: 28px;
  font-weight: 800;
  color: #3C4555;
}

/* ---- Footer ---- */
.footer-bar {
  background: #4A5568;
  color: #ffffff;
  text-align: center;
  padding: 14px 48px;
  font-size: 14px;
  font-weight: 600;
}

/* ---- Mobile ---- */
@media (max-width: 600px) {
  .invoice-wrapper { padding: 8px; }
  .header-section { flex-direction: column; gap: 20px; padding: 24px 20px 16px; }
  .header-right { align-items: flex-start; }
  .company-info { width: 100%; }
  .company-info .editable { text-align: left; }
  .bill-to-section { padding: 16px 20px 24px; }
  .bill-to-section .editable { width: 100%; }
  .table-section { padding: 0 12px; overflow-x: auto; }
  .invoice-table { min-width: 500px; }
  .bottom-section { flex-direction: column; gap: 24px; padding: 24px 20px; }
  .payment-method .editable { width: 100%; }
  .totals-box { width: 100%; }
  .stamp-section { padding: 8px 20px; }
  .stamp-text { font-size: 22px; }
  .footer-bar { padding: 12px 20px; }
  .meta-line .editable { width: 100px; }
  .invoice-title { font-size: 32px; }
}
</style>
