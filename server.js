const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const hubspot = axios.create({
  baseURL: 'https://api.hubapi.com/crm/v3',
  headers: { Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}` }
});

const allocations = new Map();

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
      properties: ["commbox_url"]
    });
    res.json(response.data.results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/allocations', (req, res) => {
  const { dealId, allocations: brandAllocations } = req.body;
  allocations.set(dealId, brandAllocations);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
