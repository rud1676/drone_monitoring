const useWeather = async (lat: number, lng: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/weather?lat=${lat}&lng=${lng}`,
  );
  try {
    const data = await response.json();
    return data.data.response.body.items.item;
  } catch (error) {
    console.warn('weather api error', error);
    return null;
  }
};

export default useWeather;
