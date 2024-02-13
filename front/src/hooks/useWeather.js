/* eslint-disable no-alert, no-console */

// const apiBaseUrl = 'http://localhost:4051';

// return Promise => for using then
const useWeather = async (lat, lng) => {
  const response = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
  try {
    const data = await response.json();
    return data.data.response.body.items.item;
  } catch (error) {
    console.warn('weather api error', error);
    return null;
  }
};

export default useWeather;
