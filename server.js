import express from 'express';

const app = express();

app.get('/api/weather', async (req, res) => {
  const { latitude, longitude } = req.query;
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
  );
  const data = await response.json();
  res.json(data);
});

app.use(express.static('dist'));

app.listen(3000, () => console.log('Server running on port 3000'));