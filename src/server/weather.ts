import { WeatherInfo } from '../shared/types.js';
import { CONFIG, JEJU_CITY_COORDS, SEOGWIPO_COORDS } from './config.js';

export function getWeatherDescription(code: number): string {
  switch (code) {
    case 0:
      return '맑음';
    case 1:
      return '대체로 맑음';
    case 2:
      return '구름 조금';
    case 3:
      return '흐림';
    case 45:
    case 48:
      return '안개';
    case 51:
    case 53:
    case 55:
      return '이슬비';
    case 61:
    case 63:
    case 65:
      return '비';
    case 71:
    case 73:
    case 75:
      return '눈';
    case 80:
    case 81:
    case 82:
      return '소나기';
    case 95:
    case 96:
    case 99:
      return '뇌우';
    default:
      return '구름 많음';
  }
}

export async function fetchWeather(
  gps?: { lat: number; lng: number },
  city?: string
): Promise<WeatherInfo> {
  const isGpsBased = !!(gps && gps.lat && gps.lng);
  const targetCoords = isGpsBased
    ? gps!
    : city?.includes('서귀포')
    ? SEOGWIPO_COORDS
    : JEJU_CITY_COORDS;

  const locationName = isGpsBased
    ? `사용자 GPS 지정 좌표 (${targetCoords.lat.toFixed(4)}, ${targetCoords.lng.toFixed(4)})`
    : city?.includes('서귀포')
    ? '서귀포시청 대표 좌표 (권역 참고값)'
    : '제주시청 대표 좌표 (권역 참고값)';

  const nowIso = new Date().toISOString();

  // If in demo mode, return deterministic model reference weather
  if (CONFIG.APP_MODE === 'demo') {
    const isSeogwipo = city?.includes('서귀포') || (isGpsBased && targetCoords.lat < 33.35);
    return {
      status: 'demo',
      isModelReference: true,
      isGpsBased,
      locationName,
      coordinates: targetCoords,
      temperature: isSeogwipo ? 17.5 : 15.8,
      humidity: isSeogwipo ? 78 : 68,
      windSpeed: isSeogwipo ? 14.4 : 18.2, // km/h
      windDirection: isSeogwipo ? 315 : 290, // 북서풍 / 서북서풍
      precipitation: 0.0,
      weatherCode: 3,
      weatherDescription: '흐림 (북서풍 계열 바람)',
      baseTime: '2026-11-19T07:00:00Z',
      queriedAt: nowIso,
      source: 'Open-Meteo Forecast API (시연 모드 모델 기반 참고 데이터)',
    };
  }

  // Live mode: Call Open-Meteo
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${targetCoords.lat}&longitude=${targetCoords.lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,precipitation,weather_code&timezone=Asia%2FTokyo`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) {
      throw new Error(`Open-Meteo HTTP ${res.status}`);
    }
    const json = (await res.json()) as any;
    const cur = json.current;

    return {
      status: 'verified',
      isModelReference: true,
      isGpsBased,
      locationName: isGpsBased
        ? 'Open-Meteo 실시간 GPS 기상 연동 (조회 시점 모델 기반 참고 데이터)'
        : `${locationName} (조회 시점 모델 기반 참고 데이터)`,
      coordinates: { lat: targetCoords.lat, lng: targetCoords.lng },
      temperature: cur.temperature_2m,
      humidity: cur.relative_humidity_2m,
      windSpeed: cur.wind_speed_10m,
      windDirection: cur.wind_direction_10m,
      precipitation: cur.precipitation,
      weatherCode: cur.weather_code,
      weatherDescription: getWeatherDescription(cur.weather_code),
      baseTime: cur.time || nowIso,
      queriedAt: nowIso,
      source: 'Open-Meteo Numerical Weather Prediction Model',
    };
  } catch (err) {
    // If GPS failed, attempt single fallback to city coords if we didn't already
    if (isGpsBased) {
      const fallbackCoords = city?.includes('서귀포') ? SEOGWIPO_COORDS : JEJU_CITY_COORDS;
      const fallbackUrl = `https://api.open-meteo.com/v1/forecast?latitude=${fallbackCoords.lat}&longitude=${fallbackCoords.lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,precipitation,weather_code&timezone=Asia%2FTokyo`;
      try {
        const fbRes = await fetch(fallbackUrl, { signal: AbortSignal.timeout(4000) });
        if (fbRes.ok) {
          const fbJson = (await fbRes.json()) as any;
          const fbCur = fbJson.current;
          return {
            status: 'verified',
            isModelReference: true,
            isGpsBased: false,
            locationName: `${city || '제주시'} 대표 좌표 폴백 (권역 참고 데이터)`,
            coordinates: fallbackCoords,
            temperature: fbCur.temperature_2m,
            humidity: fbCur.relative_humidity_2m,
            windSpeed: fbCur.wind_speed_10m,
            windDirection: fbCur.wind_direction_10m,
            precipitation: fbCur.precipitation,
            weatherCode: fbCur.weather_code,
            weatherDescription: getWeatherDescription(fbCur.weather_code),
            baseTime: fbCur.time || nowIso,
            queriedAt: nowIso,
            source: 'Open-Meteo Forecast API (GPS 실패 후 권역 폴백)',
          };
        }
      } catch (fbErr) {
        // Fallback also failed
      }
    }

    // Both failed or no coords
    return {
      status: 'unavailable',
      isModelReference: true,
      isGpsBased: false,
      locationName: '기상 데이터 조회 불가 (네트워크 연결 확인 필요)',
      coordinates: targetCoords,
      temperature: 0,
      humidity: 0,
      windSpeed: 0,
      windDirection: 0,
      precipitation: 0,
      weatherCode: -1,
      weatherDescription: '조회 실패',
      baseTime: nowIso,
      queriedAt: nowIso,
      source: 'Open-Meteo Forecast API (연결 실패)',
    };
  }
}
