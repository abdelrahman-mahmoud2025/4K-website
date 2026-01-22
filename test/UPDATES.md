# 📋 خطة التحديثات - 4K Store

> **تاريخ الإنشاء**: 2026-01-22  
> **مبني على**: تقرير الفحص الشامل + Lighthouse Report

---

## 📊 نتائج Lighthouse (Desktop)

| المقياس                  | النتيجة | الحالة         |
| ------------------------ | ------- | -------------- |
| First Contentful Paint   | 2.4s    | 🟡 يحتاج تحسين |
| Largest Contentful Paint | 3.9s    | 🔴 بطيء        |
| Speed Index              | 13.3s   | 🔴 بطيء جداً   |
| HTTPS                    | ✅      | جاهز           |

---

## 🔴 تحديثات عالية الأولوية (Critical)

### 1. ✅ إزالة Gemini API Key

**الحالة**: سيتم تنفيذه بواسطة المستخدم

**الملفات المتأثرة**:

- `vite.config.ts`
- أي ملف يستخدم `process.env.GEMINI_API_KEY`

---

### 2. ⬜ إصلاح النصوص غير المترجمة

**الملفات المتأثرة**:

- `src/pages/Shop.tsx` (Line 637)
- `src/pages/Cart.tsx` (Lines 233-238)

**التغييرات المطلوبة**:

```typescript
// Shop.tsx - قبل
"Try adjusting your filters or search query...";

// Shop.tsx - بعد
{
  t("no_results_hint");
}
```

```typescript
// Cart.tsx - قبل
"You will pay {total} on delivery";
"We will verify your address via WhatsApp";

// Cart.tsx - بعد
{
  t("payment_on_delivery", { amount: total });
}
{
  t("whatsapp_verification");
}
```

**الترجمات المطلوبة** (ar.json / en.json):

```json
{
  "no_results_hint": "جرب تعديل الفلاتر أو البحث للعثور على ما تبحث عنه",
  "payment_on_delivery": "ستدفع {{amount}} عند التسليم",
  "whatsapp_verification": "سنتحقق من عنوانك عبر واتساب بعد التأكيد"
}
```

---

### 3. ⬜ إصلاح منطق مسح السلة

**الملف**: `src/pages/Cart.tsx`

**المشكلة**: السلة تُمسح فوراً بعد فتح واتساب

**الحل**:

```typescript
// قبل
window.open(url, "_blank");
clearCart();

// بعد
const confirmed = window.confirm(t("confirm_order_sent"));
if (confirmed) {
  clearCart();
}
```

---

## 🟡 تحديثات متوسطة الأولوية

### 4. ⬜ استبدال alert() بـ Toast

**التثبيت**:

```bash
npm install react-hot-toast
```

**الملفات المتأثرة**:

- `src/store/StoreContext.tsx`
- `src/App.tsx` (إضافة Toaster)

---

### 5. ⬜ تحسين Accessibility

**التغييرات**:

- إضافة `aria-label` لجميع الأزرار الأيقونية
- إضافة `role="button"` للعناصر القابلة للنقر
- تحسين keyboard navigation

---

### 6. ⬜ استخراج Quick View Modal

**الهدف**: تقليل DOM nodes وتحسين الأداء

**الخطوات**:

1. إنشاء `src/components/QuickViewModal.tsx`
2. نقله لمستوى App وتمرير المنتج كـ prop
3. تحديث ProductCard لاستخدام global state

---

## 🟢 تحديثات منخفضة الأولوية

### 7. ⬜ تحسين Loading States

- استبدال "Loading..." بـ Skeleton components

### 8. ⬜ تحسين الصور

- إضافة `srcset` لأحجام مختلفة
- تحويل لـ WebP format

### 9. ⬜ إضافة Tests

- Jest + React Testing Library

### 10. ⬜ تحسين Error Boundary

- إضافة ترجمة للرسائل

---

## 🌐 جاهزية Netlify

| المتطلب               | الحالة                           |
| --------------------- | -------------------------------- |
| HTTPS                 | ✅ جاهز (Netlify يوفره تلقائياً) |
| Static Build          | ✅ جاهز                          |
| Environment Variables | ⬜ نقل WHATSAPP_NUMBER لـ .env   |
| API Keys              | ⬜ إزالتها من الكود              |

---

## 📝 ملف البيئة المقترح (.env)

```env
# WhatsApp (اختياري - للتنظيم فقط)
VITE_WHATSAPP_NUMBER=+201090969040

# Site
VITE_SITE_URL=https://your-domain.netlify.app
```

---

## ✅ نقاط القوة الموجودة

- ✅ Context API للـ state management
- ✅ useMemo و useCallback للتحسين
- ✅ Lazy loading للصفحات
- ✅ Error Boundary
- ✅ Search debounce 300ms
- ✅ التحقق من تكرار المنتجات في Compare
- ✅ Fuse.js مع useMemo

---

## 🚀 خطوات التنفيذ المقترحة

1. **المرحلة 1** (قبل الرفع):
   - [ ] إزالة API Key
   - [ ] إصلاح النصوص
   - [ ] إصلاح منطق السلة

2. **المرحلة 2** (بعد الرفع):
   - [ ] Toast notifications
   - [ ] Accessibility
   - [ ] Quick View optimization

3. **المرحلة 3** (تحسينات مستقبلية):
   - [ ] Tests
   - [ ] Image optimization
   - [ ] Performance tuning

---

_آخر تحديث: 2026-01-22_
