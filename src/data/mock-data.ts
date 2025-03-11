
export const environmentalData = {
  temperature: {
    value: '78°F',
    change: '+3°F',
    trend: 'up' as const
  },
  humidity: {
    value: '65%',
    change: '-5%',
    trend: 'down' as const
  },
  soilMoisture: {
    value: '42%',
    change: '+2%',
    trend: 'up' as const
  }
};

export const criValue = 62;

export const criTrendData = [
  { date: 'Mon', value: 32 },
  { date: 'Tue', value: 40 },
  { date: 'Wed', value: 45 },
  { date: 'Thu', value: 58 },
  { date: 'Fri', value: 62 },
  { date: 'Sat', value: 58 },
  { date: 'Sun', value: 62 }
];

export const alertsData = [
  {
    id: 1,
    title: 'High Disease Risk Detected',
    description: 'Early blight risk increased by 24% in the last 48 hours. Consider applying fungicide.',
    timestamp: 'Today, 9:32 AM',
    riskLevel: 'high' as const
  },
  {
    id: 2,
    title: 'Weather Warning',
    description: 'Forecasted high humidity (80%+) for the next 3 days increases disease spread risk.',
    timestamp: 'Yesterday, 4:15 PM',
    riskLevel: 'medium' as const
  },
  {
    id: 3,
    title: 'Treatment Reminder',
    description: 'Scheduled fungicide application due in 2 days based on previous diagnosis.',
    timestamp: 'Jun 12, 10:00 AM',
    riskLevel: 'medium' as const
  },
  {
    id: 4,
    title: 'Critical Temperature Alert',
    description: 'Sustained temperatures above 85°F forecasted. Increase irrigation to prevent stress.',
    timestamp: 'Jun 10, 2:45 PM',
    riskLevel: 'critical' as const
  },
  {
    id: 5,
    title: 'Disease Progression',
    description: 'Existing early blight infection may spread to adjacent plants. Monitor closely.',
    timestamp: 'Jun 8, 9:15 AM',
    riskLevel: 'high' as const
  },
  {
    id: 6,
    title: 'Nutrition Recommendation',
    description: 'Potassium deficiency detected in recent scan. Consider soil amendment.',
    timestamp: 'Jun 5, 11:30 AM',
    riskLevel: 'low' as const
  }
];

export const insightsData = [
  {
    id: 1,
    image: 'https://extension.umn.edu/sites/extension.umn.edu/files/early%20blight.jpg',
    diagnosis: 'Early Blight',
    confidence: 92,
    date: 'Jun 12, 2023',
    cri: 62,
    temperature: '78°F',
    humidity: '65%',
    windSpeed: '8 mph',
    recommendation: 'Apply copper-based fungicide within 24-48 hours. Remove infected leaves and improve air circulation between plants.'
  },
  {
    id: 2,
    image: 'https://www.gardeningknowhow.com/wp-content/uploads/2019/05/septoria-leaf-spot.jpg',
    diagnosis: 'Septoria Leaf Spot',
    confidence: 88,
    date: 'Jun 5, 2023',
    cri: 45,
    temperature: '75°F',
    humidity: '70%',
    windSpeed: '5 mph',
    recommendation: 'Apply fungicide treatment and ensure proper spacing between plants to improve air circulation. Remove severely infected leaves.'
  },
  {
    id: 3,
    image: 'https://content.ces.ncsu.edu/media/images/Figure1-7_-_Late_blight_on_tomato_leaves_copy.original.jpg',
    diagnosis: 'Late Blight',
    confidence: 85,
    date: 'May 28, 2023',
    cri: 78,
    temperature: '68°F',
    humidity: '85%',
    windSpeed: '3 mph',
    recommendation: 'Immediate fungicide application needed. Consider protective measures for nearby plants. Monitor weather forecasts for high humidity.'
  },
  {
    id: 4,
    image: 'https://extension.umn.edu/sites/extension.umn.edu/files/tomato-bacterial-spot-leaf-lesions.jpg',
    diagnosis: 'Bacterial Spot',
    confidence: 76,
    date: 'May 20, 2023',
    cri: 52,
    temperature: '72°F',
    humidity: '60%',
    windSpeed: '7 mph',
    recommendation: 'Apply copper-based bactericide. Avoid overhead irrigation to prevent spread. Remove and destroy severely affected leaves.'
  },
  {
    id: 5,
    image: 'https://www.gardeningknowhow.com/wp-content/uploads/2020/11/tomato-yellow-leaf-curl-virus.jpg',
    diagnosis: 'Tomato Yellow Leaf Curl Virus',
    confidence: 94,
    date: 'May 15, 2023',
    cri: 83,
    temperature: '80°F',
    humidity: '55%',
    windSpeed: '10 mph',
    recommendation: 'Control whitefly populations, which transmit the virus. Remove and destroy infected plants. Consider resistant varieties for future plantings.'
  },
  {
    id: 6,
    image: 'https://extension.umn.edu/sites/extension.umn.edu/files/healthy-tomato.jpg',
    diagnosis: 'Healthy Plant',
    confidence: 98,
    date: 'May 10, 2023',
    cri: 12,
    temperature: '74°F',
    humidity: '58%',
    windSpeed: '6 mph',
    recommendation: 'Continue regular maintenance and monitoring. Current growing conditions are favorable for tomato development.'
  }
];
