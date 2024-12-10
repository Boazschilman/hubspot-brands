const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static('public'));

// HubSpot API configuration
const hubspot = axios.create({
  baseURL: 'https://api.hubapi.com/crm/v3',
  headers: { Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}` }
});

// Serve allocation form for root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'allocation-form.html'));
});

// Get brands for company
app.post('/api/brands/:companyName', async (req, res) => {
  try {
    const response = await hubspot.post('/objects/2-18764855/search', {
      filterGroups: [
        {
          filters: [
            {
              propertyName: 'company_name__associated_',
              operator: 'EQ',
              
