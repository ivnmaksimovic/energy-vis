import express from 'express';
import request from 'request';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from Express');
});

app.get('/api/installed_power', (req, res) => {
  const url = 'https://api.energy-charts.info/installed_power?country=de&time_step=yearly&installation_decommission=false';
  req.pipe(request(url)).pipe(res);
  // res.send('Hello from installed_power');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
