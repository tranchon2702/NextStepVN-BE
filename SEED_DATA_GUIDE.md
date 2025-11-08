# Hướng dẫn Seed Data cho Next Step Viet Nam

## 🎯 Tại sao cần Seed Data?

### 1. **Cho SEO**
- ✅ **Sitemap**: Cần có jobs, news, products trong database để sitemap tự động generate
- ✅ **Structured Data**: Cần job data để tạo JobPosting schema
- ✅ **Structured Data**: Cần news data để tạo Article schema
- ✅ **Metadata**: Cần data để generate dynamic metadata cho các trang

### 2. **Cho Website hoạt động**
- ✅ Homepage cần hero, sections, news data
- ✅ Jobs page cần jobs data
- ✅ News page cần news articles
- ✅ Products page cần products data
- ✅ Admin dashboard cần data để quản lý

### 3. **Cho Testing**
- ✅ Test các tính năng SEO
- ✅ Test sitemap generation
- ✅ Test structured data
- ✅ Test metadata generation

## 📋 Các Seed Scripts có sẵn

### Core Data
- `seedDataAuth.js` - Tạo admin user mặc định
- `seedDataHome.js` - Hero, sections, customers, certifications
- `seedDataContact.js` - Contact information
- `seedDataCareers.js` - Company info, Contact HR, Jobs

### Content Data
- `seedDataJobs.js` - Jobs data (quan trọng cho SEO)
- `seedDataNews.js` - News articles (quan trọng cho SEO)
- `seedDataProducts.js` - Products data (⚠️ LƯU Ý: Trang products không có trong navigation, có thể không cần seed)
- `seedDataOverview.js` - Overview banners, milestones
- `seedDataFacilities.js` - Facilities data
- `seedDataEcoFriendly.js` - Eco-friendly data
- `seedDataAutomation.js` - Automation data
- `seedDataMachinery.js` - Machinery data

### Categories
- `seedJobCategories.js` - Job categories
- `seedRecruiterCategories.js` - Recruiter categories

## 🚀 Cách chạy Seed Data

### Option 1: Chạy tất cả (Recommended)
```bash
cd nextstepvn-be
npm run seed
```

### Option 2: Chạy từng script riêng lẻ
```bash
# Seed Auth
node scripts/seedDataAuth.js

# Seed Jobs (quan trọng cho SEO)
node scripts/seedDataJobs.js

# Seed News (quan trọng cho SEO)
node scripts/seedDataNews.js

# Seed Home
node scripts/seedDataHome.js

# Seed Contact
node scripts/seedDataContact.js

# Seed Careers
node scripts/seedDataCareers.js

# Seed Products (⚠️ LƯU Ý: Trang products không có trong navigation)
# node scripts/seedDataProducts.js

# Seed Overview
node scripts/seedDataOverview.js

# Seed Facilities
node scripts/seedDataFacilities.js

# Seed Eco Friendly
node scripts/seedDataEcoFriendly.js

# Seed Automation
node scripts/seedDataAutomation.js

# Seed Machinery
node scripts/seedDataMachinery.js

# Seed Categories
node scripts/seedJobCategories.js
node scripts/seedRecruiterCategories.js
```

## ⚠️ Lưu ý

### 1. **Database Connection**
- Đảm bảo MongoDB đang chạy
- Kiểm tra `MONGO_URI` trong `.env` hoặc script
- Mặc định: `mongodb://localhost:27017/saigon3jean`

### 2. **Thứ tự Seed**
- Nên seed theo thứ tự:
  1. Auth (tạo admin user)
  2. Categories (Job Categories, Recruiter Categories)
  3. Core data (Home, Contact, Careers)
  4. Content data (Jobs, News, Products)
  5. Other data (Overview, Facilities, etc.)

### 3. **Data sẽ bị xóa**
- ⚠️ **CẢNH BÁO**: Một số seed scripts sẽ **XÓA** dữ liệu cũ trước khi seed mới
- Backup database trước khi chạy seed nếu cần giữ data cũ

### 4. **Images**
- Một số seed scripts cần images trong `uploads/` folder
- Đảm bảo images đã được copy vào đúng thư mục

## 🔍 Kiểm tra sau khi Seed

### 1. **Kiểm tra Database**
```bash
# Kết nối MongoDB
mongosh mongodb://localhost:27017/saigon3jean

# Kiểm tra collections
show collections

# Đếm documents
db.jobs.countDocuments()
db.news.countDocuments()
db.products.countDocuments()
```

### 2. **Kiểm tra Website**
- Truy cập homepage: `http://localhost:3000`
- Truy cập jobs page: `http://localhost:3000/for-engineers`
- Truy cập news page: `http://localhost:3000/news`
- Truy cập admin: `http://localhost:3000/admin/login`

### 3. **Kiểm tra SEO**
- Kiểm tra sitemap: `http://localhost:3000/sitemap.xml`
- Kiểm tra robots.txt: `http://localhost:3000/robots.txt`
- Kiểm tra structured data trong source code của các trang

## 📊 Data được Seed

### Jobs (quan trọng cho SEO)
- ~10-20 jobs mẫu
- Bao gồm: title, description, location, salary, requirements, benefits
- Có cả tiếng Việt và tiếng Nhật

### News (quan trọng cho SEO)
- ~5-10 news articles mẫu
- Bao gồm: title, content, excerpt, images
- Có cả tiếng Việt và tiếng Nhật

### Products (⚠️ Không sử dụng)
- ~3-5 products mẫu
- Bao gồm: name, description, images, features, applications
- **LƯU Ý**: Trang products không có trong navigation, có thể không cần seed

### Home
- Hero banner
- 3 sections
- Customers logos
- Certifications

## 🎯 Kết luận

**CÓ, bạn CẦN seed data để:**
1. ✅ Test SEO features (sitemap, structured data, metadata)
2. ✅ Website hoạt động đúng với đầy đủ nội dung
3. ✅ Test các tính năng admin dashboard
4. ✅ Demo website cho khách hàng

**Chạy seed data ngay sau khi setup database!**

