# School Admission Portal — Frontend

A clean, modern, and professional React.js admission portal for student registration built with React and Vite.

## 📁 Architecture & Pages
This application contains the dedicated admission registration workflow:
1. **Admission Registration Page** (`AdmissionPage.jsx`):
   - Opens immediately on load.
   - All required admission form fields:
     - Student Full Name
     - Date of Birth
     - Gender
     - Parent/Guardian Name
     - Parent/Guardian Phone
     - Email
     - Residential Address
     - Previous School
     - Class Applying For
     - Additional Information
     - "Submit Admission Form" action button with client validation.
2. **Registration Success Page** (`SuccessPage.jsx`):
   - Shows: *"Registration Completed Successfully! We have received your admission application. We will contact you shortly."*
   - Generated application reference ID and submission summary card.
   - "Back to Home" button to return to the Admission Form.

---

## 🚀 How to Run

1. Open your terminal in the `Frontend` folder:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at:
   ```
   http://localhost:3000
   ```
