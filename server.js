const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const hubspot = axios.create({
  baseURL: 'https://api.hubapi.com/crm/v3',
  headers: { Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}` }
});

// Serve allocation form for root and OAuth callback
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'allocation-form.html'));
});

// Get brands for company
app.post('/api/brands/:companyName', async (req, res) => {
  try {
    const response = await hubspot.post('/objects/2-18764855/search', {
      filterGroups: [{
        filters: [{
          propertyName: "company_name__associated_",
          operator: "EQ",
          value: req.params.companyName
        }]
      }],
      properties: ["brand_name"]
    });
    res.json(response.data.results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create sync objects for allocations
app.post('/api/allocations', async (req, res) => {
  try {
    const { allocations } = req.body;
    const currentDate = new Date().toLocaleDateString('en-GB');
    
    const syncPromises = Object.entries(allocations).map(([brand, amount]) => {
      return hubspot.post('/objects/2-37689119', {
        properties: {
          sync: `allocation-${brand}-${currentDate}`,
          brand_name: brand,
          synced_product: "Agents",
          synced_amount: amount.toString()
        }
      });
    });
    const results = await Promise.all(syncPromises);
    res.json({ success: true, syncs: results.map(r => r.data) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
