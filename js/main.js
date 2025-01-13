document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("file-upload");
  const uploadButton = document.getElementById("upload-button");
  const transformSection = document.getElementById("transform-section");
  const resultSection = document.getElementById("result-section");
  const exportButton = document.getElementById("export-button"); // Declare exportButton here
  const resultTable = "result-table";

  let uploadedData = []; // Parsed CSV data
  let transformedData = []; // Transformed data for exporting

  // File upload
  uploadButton.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        uploadedData = parseCSV(content);

        // Normalize column names and validate structure
        if (normalizeAndValidateColumns(uploadedData)) {
          transformSection.classList.remove("hidden");
          alert("File uploaded successfully. Configure your transformation settings.");
        } else {
          alert(
            "Invalid file format. Ensure it contains 'main', 'color', and 'value' columns with correct data types."
          );
        }
      };
      reader.readAsText(file);
    }
  });

  // Parse CSV data
  function parseCSV(content) {
    const rows = content.split("\n").map((row) => row.split(","));
    const headers = rows[0];
    const data = rows.slice(1).map((row) => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header.trim()] = row[index]?.trim();
      });
      return obj;
    });
    return data;
  }

  // Normalize column names and validate structure
  function normalizeAndValidateColumns(data) {
    if (!data.length) return false;

    const requiredColumns = ["main", "color", "value"];
    const normalizedHeaders = Object.keys(data[0]).reduce((acc, key) => {
      acc[key.toLowerCase()] = key; // Map normalized to original spelling
      return acc;
    }, {});

    // Ensure all required columns exist (case-insensitive)
    const hasAllColumns = requiredColumns.every((col) => col in normalizedHeaders);
    if (!hasAllColumns) return false;

    // Rename keys in data rows to normalized names
    uploadedData = data.map((row) => {
      const normalizedRow = {};
      for (const [key, value] of Object.entries(row)) {
        normalizedRow[key.toLowerCase()] = value;
      }
      return normalizedRow;
    });

    // Validate data types
    return validateDataTypes(uploadedData);
  }

  // Validate data types
  function validateDataTypes(data) {
    return data.every((row) => {
      const mainIsValid = typeof row.main === "string" && row.main.trim() !== "";
      const colorIsValid = typeof row.color === "string" && row.color.trim() !== "";
      const valueIsValid = !isNaN(parseFloat(row.value));
      return mainIsValid && colorIsValid && valueIsValid;
    });
  }

  // Transform Data
  document.getElementById("transform-button").addEventListener("click", () => {
    const valuePerUnit = parseInt(document.getElementById("value-per-unit").value, 10);
    const unitsPerRow = parseInt(document.getElementById("units-per-row").value, 10);

    if (!valuePerUnit || !unitsPerRow) {
      alert("Please provide both Value Per Unit and Units Per Row.");
      return;
    }

    transformedData = transformData(uploadedData, valuePerUnit, unitsPerRow);
    displayTransformedData(transformedData);
    resultSection.classList.remove("hidden");
  });

  function transformData(data, valuePerUnit, unitsPerRow) {
    if (!data || data.length === 0) {
      alert("No data available to transform!");
      return [];
    }

    const groupedData = {};
    let idCounter = 1; // Initialize ID counter

    // Group the data by 'main' and 'color'
    data.forEach((item) => {
      const groupKey = `${item.main}_${item.color}`;
      if (!groupedData[groupKey]) {
        groupedData[groupKey] = {
          main: item.main,
          color: item.color,
          value: 0,
        };
      }
      groupedData[groupKey].value += parseFloat(item.value); // Accumulate value
    });

    // Initialize result array
    let result = [];
    const groupTrackers = {}; // Track `spanCounter` and `rowCounter` for each `main` group

    // Iterate over grouped data to calculate positions
    Object.values(groupedData).forEach((group) => {
      // Initialize trackers for the current `main` group if not already set
      if (!groupTrackers[group.main]) {
        groupTrackers[group.main] = {
          spanCounter: 1, // Start span position at 1
          rowCounter: 0,
        };
      }

      const { spanCounter, rowCounter } = groupTrackers[group.main];
      let currentSpan = spanCounter;
      let currentRow = rowCounter;

      const units = Math.ceil(group.value / valuePerUnit); // Calculate number of units

      for (let i = 0; i < units; i++) {
        // Reset span counter and increment row if units per row are exceeded
        if (currentSpan === unitsPerRow + 1) {
          currentSpan = 1; // Reset span position to 1
          currentRow++; // Increment the row position
        }

        // Push the transformed data for this unit
        result.push({
          id: idCounter++, // Assign a unique ID
          main: group.main,
          color: group.color,
          span: currentSpan++, // Horizontal position within the row
          row: currentRow, // Row position specific to this `main` group
        });
      }

      // Update the trackers for this group
      groupTrackers[group.main] = {
        spanCounter: currentSpan,
        rowCounter: currentRow,
      };
    });

    console.log("Transformed Data with Blank Space for Span 0:", result); // Debugging output
    return result; // Return the transformed data
  }

  function displayTransformedData(data) {
    const container = document.getElementById("result-table");
    const limitedData = data.slice(0, 10); // Limit the table view to the first 10 rows

    container.innerHTML = `<table class="preview-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Main</th>
          <th>Color</th>
          <th>Span Position</th>
          <th>Row Position</th>
        </tr>
      </thead>
      <tbody>
        ${limitedData
          .map(
            (row) =>
              `<tr>
                <td>${row.id}</td>
                <td>${row.main}</td>
                <td>${row.color}</td>
                <td>${row.span}</td>
                <td>${row.row}</td>
              </tr>`
          )
          .join("")}
      </tbody>
    </table>`;
  }

  // CSV Export Function
  function exportToCSV(data, filename = "transformed_data.csv") {
    if (!data || data.length === 0) {
      alert("No data available to export!");
      return;
    }

    // Convert data array to CSV string
    const csvContent = [
      ["ID", "Main", "Color", "Span Position", "Row Position"], // Headers
      ...data.map(row => [row.id, row.main, row.color, row.span, row.row]) // Rows
    ]
      .map(row => row.join(",")) // Join each row with commas
      .join("\n"); // Join all rows with newlines

    // Create a blob and a downloadable link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = filename;
    link.style.display = "none";

    // Append the link, trigger download, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up URL object
    URL.revokeObjectURL(url);
  }

  // Attach Export Button Logic
  if (exportButton) {
    exportButton.addEventListener("click", () => {
      exportToCSV(transformedData); // Use the global transformedData variable
    });
  } else {
    console.error("Export button not found in the DOM!");
  }
});