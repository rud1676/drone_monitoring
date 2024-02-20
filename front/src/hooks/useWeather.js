const useWeather = async (lat, lng) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/weather?lat=${lat}&lng=${lng}`,
  );
  try {
    const data = await response.json();
    console.log(data);
    return data.data.response.body.items.item;
  } catch (error) {
    console.warn('weather api error', error);
    return null;
  }
};

export default useWeather;
