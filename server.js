const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Store allocations in memory (for demo)
const allocations = new Map();

app.post('/api/allocations', (req, res) => {
  const { dealId, brands } = req.body;
  allocations.set(dealId, brands);
  res.json({ success: true });
});

app.get('/api/allocations/:dealId', (req, res) => {
  const allocation = allocations.get(req.params.dealId);
  res.json(allocation || null);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
