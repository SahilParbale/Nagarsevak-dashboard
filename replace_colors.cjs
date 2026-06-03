const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/super-admin/SuperAdminLayout.jsx',
  'src/pages/super-admin/SuperAdminDashboard.jsx',
  'src/pages/super-admin/TenantManagement.jsx',
  'src/pages/super-admin/SupportTicketsAdmin.jsx',
  'src/pages/super-admin/BillingManagement.jsx'
];

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    // Replace standard colors with brand colors
    content = content.replace(/gray-/g, 'slate-');
    content = content.replace(/blue-/g, 'sky-');
    fs.writeFileSync(fullPath, content);
    console.log('Updated colors in', file);
  } else {
    console.log('File not found:', fullPath);
  }
});
