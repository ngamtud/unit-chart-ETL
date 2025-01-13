
# Unit Chart ETL (Extract, Transform, Load) Web Application

The **Unit Chart ETL Web Application** is a lightweight, browser-based tool designed to enable users to quickly transform raw tabular data into a structured format that can be visualized as a **unit chart** in Tableau. The application simplifies the data preparation process, ensuring flexibility, ease of use, and seamless integration with visualization tools.

---

## Key Features
1. **Data Upload:**
   - Supports CSV file format for data input.
   - Drag-and-drop functionality or traditional file upload.
   - Displays a preview of the uploaded dataset with the first 10 rows for quick verification.

2. **Transformation Configuration:**
   - **Value Per Unit:** Defines the numerical grouping for unit calculations (e.g., group sales into units of 10).
   - **Units Per Row:** Determines the number of units displayed per row in the unit chart.

3. **ETL Process:**
   - Groups data by specified categorical fields (e.g., "main" and "color").
   - Calculates span and row positions for creating unit charts.
   - Allows skipping of span position `0` to provide visual gaps between groups (useful for Tableau visualization).

4. **Output Generation:**
   - Displays the transformed data table in the web interface.
   - Allows export of the transformed dataset as a CSV file for further use in Tableau or other visualization tools.

5. **Custom Visualization Ready:**
   - Ensures compatibility with Tableau for creating **unit charts** by precomputing span and row positions.
   - Designed with options to introduce spacing between panes for better readability.

6. **Responsive Design:**
   - User-friendly interface designed for both desktop and mobile devices.
   - Clean, professional UI with light and dark themes.

7. **Educational Purpose:**
   - Aimed at promoting understanding and use of ETL processes for visual analytics.
   - Does not store any user data, ensuring privacy and security.

---

## Technical Stack
- **Frontend:** HTML5, CSS3 (with Kanit font), JavaScript.
- **Core Features:**
  - CSV parsing and validation.
  - ETL logic implemented in JavaScript.
  - Dynamic DOM updates for table rendering and file export.
- **Deployment:** Designed for GitHub Pages or any static web hosting platform.

---

## Use Cases
- **Business Intelligence Analysts:**
  - Quickly prepare raw data for Tableau visualizations.
  - Create visually appealing unit charts for business reports.
- **Educators and Students:**
  - Learn the fundamentals of ETL processes and data visualization.
- **Data Enthusiasts:**
  - Experiment with data preparation and visualization workflows.

---

## How It Works
1. **Upload Your Data:**
   - Drag and drop your CSV file or select it manually.
   - Ensure the dataset contains the required fields (`main`, `color`, `value`).

2. **Configure Transformations:**
   - Define numerical grouping with **Value Per Unit**.
   - Set **Units Per Row** to determine chart layout.

3. **Transform Data:**
   - The app groups data, calculates span and row positions, and introduces optional spacing.

4. **Export Results:**
   - Download the transformed dataset as a CSV file.
   - Use the dataset in Tableau to create compelling unit charts.

---

## Example
### **Input Dataset:**
| Main      | Color   | Value |
|-----------|---------|-------|
| Thailand  | Blue    | 30    |
| Thailand  | Orange  | 50    |
| Korea     | Blue    | 35    |
| Korea     | Orange  | 45    |

### **Configuration:**
- Value Per Unit: 10
- Units Per Row: 5

### **Transformed Output:**
| ID  | Main      | Color   | Span Position | Row Position |
|-----|-----------|---------|---------------|--------------|
| 1   | Thailand  | Blue    | 1             | 0            |
| 2   | Thailand  | Blue    | 2             | 0            |
| 3   | Thailand  | Blue    | 3             | 0            |
| 4   | Thailand  | Orange  | 4             | 0            |
| 5   | Korea     | Blue    | 1             | 0            |

### **Sample CSV**
```
main,color,value
Thailand,p1,100
Thailand,p1,200
Thailand,p2,300
Thailand,p2,400
Thailand,p3,500
Korea,p1,600
Korea,p1,700
Korea,p2,800
Korea,p2,900
Korea,p3,1000
```
---


## Acknowledgements
- Developed by **Viz Craft Studio** for educational purposes.
- No data is stored, ensuring user privacy.
- Supports seamless integration with **Tableau** for advanced visual analytics.

This project bridges the gap between raw data and impactful visual storytelling, empowering users to focus on insights rather than data preparation. 🚀
