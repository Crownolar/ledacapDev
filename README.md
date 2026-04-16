# 🧪 LEADCAP APPLICATION

**Lead Exposure Assessment & Data Capture Platform**

## 📌 Overview

LEADCAP is a scalable public health surveillance platform designed to monitor, analyze, and manage lead contamination and heavy metal exposure across regions.

The platform enables data collection, regulatory enforcement, policy decision-making, and research analytics through a unified system.

It is built for organizations such as:

* Ministry of Health (MOH)
* Standards Organization (SON)
* Research Institutions (Universities)
* NGOs (e.g., Resolve)

## 🎯 Objectives

* Monitor contamination levels across regions
* Enable data-driven policy decisions
* Support regulatory enforcement
* Provide datasets for research and modeling
* Scale across multiple states and countries

## 🏗️ Architecture

* **Frontend:** React + Vite + Tailwind CSS
* **State Management:** Redux Toolkit + Redux Persist
* **Backend:** RESTful API
* **Authentication:** JWT-based authentication
* **Data Handling:** Paginated and filterable queries
* **Scalability:** Designed for large datasets and multi-country use

## 👥 User Roles

### 🧍 Data Collector

* Collects samples from markets
* Inputs product details, GPS coordinates, and heavy metal readings
* Submits samples for review

### 🧑‍💼 Supervisor

* Reviews submitted samples
* Approves or rejects entries
* Ensures data quality

### 🏛️ Ministry of Health (MOH)

* Monitors national contamination trends
* Uses dashboards for insights and reporting
* Supports policy decisions

### 🛡️ SON (Regulatory Enforcement)

* Identifies contaminated products
* Tracks non-compliant vendors
* Initiates enforcement actions

### 🎓 University (Research & Modeling)

* Accesses anonymized datasets
* Performs statistical and predictive analysis

### 🌍 RESOLVE (NGO / Advisory)

* Provides strategic insights
* Supports cross-region analytics

### ⚙️ Super Admin

* Manages users and permissions
* Controls system configuration
* Oversees platform operations

## 📊 Key Features

### 📥 Data Collection

* Field-based sample submission
* GPS tracking
* Product classification

### 📈 Analytics Dashboard

* State-level insights
* Product-based analysis
* Heavy metal distribution

### ⚠️ Risk Classification

* Safe
* Moderate
* Contaminated
* Pending

### 🔍 Advanced Filtering

* By State / LGA
* By Product Type
* By Date Range
* By Vendor Type

### 📄 Reporting

* Exportable reports
* Policy-ready summaries

## 📡 API Integration

### Endpoint Example

GET /samples/stats

### Query Parameters

* stateId
* lgaId
* productVariantId
* dateFrom
* dateTo

### Response Includes

* Risk distribution (Safe, Moderate, Contaminated)
* Breakdown by state
* Breakdown by product type
* Heavy metal analysis

## 🧠 Data Flow

1. Data Collector submits sample
2. Supervisor reviews and validates
3. Data is stored in the system
4. Dashboards update in real-time
5. Stakeholders access insights
6. Researchers analyze data

## 🚀 Installation & Setup

### Clone Repository

git clone https://github.com/your-repo/leadcap.git
cd leadcap

### Install Dependencies

npm install

### Environment Variables

Create a `.env` file:

VITE_API_BASE_URL=your_api_url

### Run Development Server

npm run dev

### Build for Production

npm run build

## 📁 Project Structure

src/
│── components/
│── pages/
│── redux/
│── utils/
│── context/
│── hooks/
│── services/

## 📊 Scalability

* Pagination for large datasets
* Lazy loading for performance
* Backend-driven filtering
* Supports millions of records

## 🔐 Security

* JWT-based authentication
* Role-based access control
* Secure API communication

## 🌍 Global Expansion Vision

* Multi-country deployment support
* Cross-border contamination tracking
* Integration with global health systems

## 🤝 Contribution

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push and open a pull request

## 📄 License

This project is proprietary and intended for authorized institutional use.

## 🏁 Conclusion

LEADCAP provides a robust, scalable, and data-driven approach to tackling lead contamination and public health risks.

It connects field data collection, regulatory enforcement, policy decision-making, and research into one unified platform.
