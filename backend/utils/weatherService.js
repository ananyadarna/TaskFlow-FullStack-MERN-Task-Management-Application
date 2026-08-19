const axios = require('axios');

// Fetch current weather context from OpenWeatherMap REST API
const getWeatherByCity = async (city) => {
  if (!city || typeof city !== 'string' || !city.trim()) {
    return null;
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;

  // Return realistic mock weather if API key is not configured
  if (!apiKey || apiKey === 'your_openweather_api_key') {
    return {
      temp: 24,
      description: 'partly cloudy',
      icon: '03d',
      cityName: city.trim(),
    };
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city.trim()
      )}&appid=${apiKey}&units=metric`
    );

    const { data } = response;
    return {
      temp: Math.round(data.main.temp),
      description: data.weather[0]?.description,
      icon: data.weather[0]?.icon,
      cityName: data.name,
    };
  } catch (error) {
    console.error(`Failed to fetch weather for "${city}":`, error.message);
    return null;
  }
};

module.exports = { getWeatherByCity };
