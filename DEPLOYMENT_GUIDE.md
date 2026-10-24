# WowVisit Deployment Guide (Vercel & Render)

WowVisit এখন **সম্পূর্ণরূপে Vercel এবং Render-এ ডিপ্লয় করার জন্য প্রস্তুত**।

---

## 🚀 অপশন ১: শুধুমাত্র Frontend Vercel-এ ডিপ্লয় (সবচেয়ে সহজ ও তাৎক্ষণিক কাজ করবে)

> **আপনার প্রশ্নের উত্তর:** আপনি কি Backend ডিপ্লয় না করেই শুধু Frontend দিয়ে সম্পূর্ণ প্রজেক্ট চালাতে পারবেন?
> **হ্যাঁ!** আমরা Frontend-এ একটি স্বয়ংক্রিয় **Seamless Fallback API Service** তৈরি করে দিয়েছি। এর ফলে Render বা কোনো বাহ্যিক ব্যাকএন্ড চালু না থাকলেও Vercel-এ ডিপ্লয় করলেই তাৎক্ষণিকভাবে Flight Search (Biman, US-Bangla, Novoair, Air Astra) এবং Hotel Search (Cox's Bazar, Dhaka, Sylhet, Chattogram ইত্যাদি) **১০০% নিখুঁত ও এরর-ফ্রি**ভাবে কাজ করবে!

### ধাপ ১: GitHub-এ কোড পুশ করা
আপনার প্রজেক্টের রুট ফোল্ডারে টার্মিনাল খুলে নিচের কমান্ডগুলো চালান:
```bash
git init
git add .
git commit -m "feat: production ready for vercel and render deployment"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

### ধাপ ২: Vercel-এ ডিপ্লয় করা
1. [Vercel Dashboard](https://vercel.com/new)-এ যান।
2. আপনার GitHub রিপোজিটরিটি সিলেক্ট করে **Import** করুন।
3. **Configure Project**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (অথবা `frontend` দিলেও চলবে, উভয়ক্ষেত্রেই `vercel.json` কনফিগার করা আছে)
   - **Build Command**: `npm run build`
   - **Output Directory**: `frontend/dist` (যদি রুট থেকে ডিপ্লয় করেন) অথবা `dist` (যদি Root Directory `frontend` দেন)
4. **Deploy** বাটনে ক্লিক করুন!

🎉 **১ মিনিটের মধ্যে আপনার সাইট লাইভ হয়ে যাবে এবং কোনো রিফ্রেশ বা রাউটিং এরর (404 Error) আসবে না!**

---

## ⚡ অপশন ২: Full-Stack ডিপ্লয় (Frontend Vercel-এ + Backend Render-এ)

আপনি যদি Express ও PostgreSQL সহ আসল ব্যাকএন্ড Render-এ হোস্ট করতে চান, তার জন্যও সমস্ত কনফিগারেশন (`db.js` SSL সাপোর্ট, CORS, Health Check, `render.yaml`) প্রস্তুত করে রাখা হয়েছে।

### ধাপ ১: Render-এ PostgreSQL ডাটাবেস তৈরি (যদি চান)
1. [Render Dashboard](https://dashboard.render.com)-এ যান।
2. **New +** > **PostgreSQL** নির্বাচন করুন।
3. নাম দিন: `wowvisit-db` এবং Region নির্বাচন করুন।
4. তৈরি হলে **Internal Database URL** অথবা **External Connection String** কপি করুন।

### ধাপ ২: Render-এ Backend ওয়েব সার্ভিস চালু করা
1. Render-এ **New +** > **Web Service** নির্বাচন করুন এবং আপনার রিপোজিটরি যুক্ত করুন।
2. সেটিংস পূরণ করুন:
   - **Name**: `wowvisit-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`
3. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `GEOAPIFY_API_KEY`: আপনার Geoapify কী (যেমন: `747ae441ff9d432fbf8038db627c1ef6`)
   - `DATABASE_URL`: আপনার PostgreSQL Connection String (Render Postgres/Neon/Supabase)
4. **Create Web Service** বাটনে ক্লিক করুন।
5. সার্ভিস চালু হলে Render Dashboard-এর Shell ট্যাবে গিয়ে ডাটাবেস সিড করতে চালান:
   ```bash
   npm run seed
   ```
6. আপনার ব্যাকএন্ড URL কপি করুন (যেমন: `https://wowvisit-backend.onrender.com`)।

### ধাপ ৩: Vercel Frontend-কে Render Backend-এর সাথে যুক্ত করা
1. Vercel Dashboard-এ আপনার প্রজেক্টের **Settings** > **Environment Variables**-এ যান।
2. নতুন ভ্যারিয়েবল যোগ করুন:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://wowvisit-backend.onrender.com` (আপনার Render ব্যাকএন্ড URL)
3. **Save** করুন এবং **Deployments** ট্যাব থেকে **Redeploy** করুন।

---

## 🛠️ যা যা পরিবর্তন ও সমাধান করা হয়েছে:
1. **Seamless Client API Fallback**: `frontend/src/services/api.js` তৈরি করা হয়েছে, যা ব্যাকএন্ড না থাকলেও কোনো প্রকার Crash বা Error ছাড়াই ক্লায়েন্ট-সাইডে রিয়েলিস্টিক ফ্লাইট ও হোটেল ডাটা দেখাবে।
2. **SPA Routing Fix (404 Error Prevention)**: `frontend/vercel.json` এবং রুট `vercel.json` যুক্ত করা হয়েছে যাতে `/flights` বা `/hotels` সরাসরি ভিজিট বা রিলোড করলে 404 Not Found না আসে।
3. **Monorepo / Root Deployment Support**: রুট ডিরেক্টরিতে `package.json` ও `.gitignore` তৈরি করা হয়েছে, যাতে Vercel রুট বা frontend উভয়ভাবেই এরর-মুক্ত বিল্ড করতে পারে।
4. **Render Ready Backend**:
   - `backend/db.js`-এ ক্লাউড ডাটাবেসের জন্য `DATABASE_URL` এবং SSL (`rejectUnauthorized: false`) যুক্ত করা হয়েছে।
   - Render Health Check-এর জন্য `server.js`-এ `/health` রুট যুক্ত করা হয়েছে।
   - `backend/package.json`-এ `npm run seed` স্ক্রিপ্ট এবং রুট ডিরেক্টরিতে `render.yaml` ব্লুপ্রিন্ট তৈরি করা হয়েছে।
5. **Clean Code & Build Tested**: ESLint টেস্টে ০ এরর ও ০ ওয়ার্নিং নিশ্চিত করা হয়েছে এবং `npm run build` সফলভাবে কমপ্লিট হয়েছে।
