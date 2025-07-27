const XLSX = require('xlsx');
const path = require('path');

// Create sample data for the Excel file
const sampleData = [
  {
    ID: 1,
    Name: 'John Doe',
    Department: 'Engineering',
    Salary: 85000,
    JoinDate: '2023-01-15',
    Performance: 'Excellent'
  },
  {
    ID: 2,
    Name: 'Jane Smith',
    Department: 'Marketing',
    Salary: 75000,
    JoinDate: '2023-02-20',
    Performance: 'Good'
  },
  {
    ID: 3,
    Name: 'Mike Johnson',
    Department: 'Finance',
    Salary: 90000,
    JoinDate: '2022-11-10',
    Performance: 'Excellent'
  },
  {
    ID: 4,
    Name: 'Sarah Williams',
    Department: 'HR',
    Salary: 65000,
    JoinDate: '2023-03-05',
    Performance: 'Average'
  },
  {
    ID: 5,
    Name: 'David Brown',
    Department: 'Engineering',
    Salary: 88000,
    JoinDate: '2022-09-15',
    Performance: 'Good'
  }
];

// Create a new workbook
const workbook = XLSX.utils.book_new();

// Convert JSON data to worksheet
const worksheet = XLSX.utils.json_to_sheet(sampleData);

// Add the worksheet to the workbook
XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');

// Define the output file path
const outputPath = path.join(__dirname, 'sample_data.xlsx');

// Write the workbook to a file
XLSX.writeFile(workbook, outputPath);

console.log(`Sample Excel file created at: ${outputPath}`);
