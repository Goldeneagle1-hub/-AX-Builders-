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

/**
 * 발생 일시(occurredAt)가 현재 시각 기준 1시간 이상 과거(최대 7일 이내)이면 'historical'(사후 작성),
 * 그 외에는 'realtime'(즉시 작성) 모드로 판별
 */
export function resolveWeatherQueryMode(
  occurredAt?: string,
  nowMs: number = Date.now()
): { mode: 'realtime' | 'historical'; pastDays: number } {
  if (!occurredAt) return { mode: 'realtime', pastDays: 0 };
  const parsedMs = Date.parse(occurredAt);
  if (Number.isNaN(parsedMs)) return { mode: 'realtime', pastDays: 0 };

  const diffHours = (nowMs - parsedMs) / (1000 * 60 * 60);
  if (diffHours >= 1 && diffHours <= 24 * 7) {
    const days = Math.min(7, Math.max(1, Math.ceil(diffHours / 24)));
    return { mode: 'historical', pastDays: days };
  }
  return { mode: 'realtime', pastDays: 0 };
}

/**
 * Open-Meteo hourly.time 배열에서 목표 시각(occurredAt)과 가장 가까운 정시 인덱스를 탐색
 */
export function findClosestHourlyIndex(times: string[], targetIso: string): number {
  if (!times.length) return -1;
  const targetMs = Date.parse(targetIso);
  if (Number.isNaN(targetMs)) return times.length - 1;

  let bestIdx = 0;
  let minDiff = Infinity;
  for (let i = 0; i < times.length; i++) {
    const tMs = Date.parse(times[i]);
    if (Number.isNaN(tMs)) continue;
    const diff = Math.abs(tMs - targetMs);
    if (diff < minDiff) {
      minDiff = diff;
      bestIdx = i;
    }
  }
  return bestIdx;
}

async function queryOpenMeteo(
  coords: { lat: number; lng: number },
  mode: 'realtime' | 'historical',
  pastDays: number,
  occurredAt?: string
): Promise<{
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  weatherCode: number;
  baseTime: string;
}> {
  if (mode === 'historical' && occurredAt) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,precipitation,weather_code&past_days=${pastDays}&forecast_days=1&timezone=Asia%2FTokyo`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
    const json = (await res.json()) as any;
    const h = json.hourly;
    const idx = findClosestHourlyIndex(h?.time || [], occurredAt);
    if (idx < 0) throw new Error('Open-Meteo hourly index unavailable');

    return {
      temperature: h.temperature_2m[idx],
      humidity: h.relative_humidity_2m[idx],
      windSpeed: h.wind_speed_10m[idx],
      windDirection: h.wind_direction_10m[idx],
      precipitation: h.precipitation[idx],
      weatherCode: h.weather_code[idx],
      baseTime: h.time[idx],
    };
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,precipitation,weather_code&timezone=Asia%2FTokyo`;
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
  const json = (await res.json()) as any;
  const cur = json.current;

  return {
    temperature: cur.temperature_2m,
    humidity: cur.relative_humidity_2m,
    windSpeed: cur.wind_speed_10m,
    windDirection: cur.wind_direction_10m,
    precipitation: cur.precipitation,
    weatherCode: cur.weather_code,
    baseTime: cur.time || new Date().toISOString(),
  };
}

export async function fetchWeather(
  gps?: { lat: number; lng: number },
  city?: string,
  occurredAt?: string
): Promise<WeatherInfo> {
  const isGpsBased = !!(gps && gps.lat && gps.lng);
  const targetCoords = isGpsBased
    ? gps!
    : city?.includes('서귀포')
    ? SEOGWIPO_COORDS
    : JEJU_CITY_COORDS;

  const { mode: queryMode, pastDays } = resolveWeatherQueryMode(occurredAt);
  const locationName = isGpsBased
    ? `사용자 GPS 지정 좌표 (${targetCoords.lat.toFixed(4)}, ${targetCoords.lng.toFixed(4)})`
    : city?.includes('서귀포')
    ? '서귀포시청 대표 좌표 (권역 참고값)'
    : '제주시청 대표 좌표 (권역 참고값)';

  const nowIso = new Date().toISOString();

  // Demo mode: return deterministic model reference matching realtime vs historical
  if (CONFIG.APP_MODE === 'demo') {
    const isSeogwipo = city?.includes('서귀포') || (isGpsBased && targetCoords.lat < 33.35);
    const matchedHour = occurredAt
      ? `${occurredAt.slice(0, 13)}:00`
      : '2026-11-19T07:00';

    return {
      status: 'demo',
      isModelReference: true,
      isGpsBased,
      queryMode,
      matchedTargetTime: queryMode === 'historical' ? matchedHour : undefined,
      locationName,
      coordinates: targetCoords,
      temperature: isSeogwipo ? 17.5 : 15.8,
      humidity: isSeogwipo ? 78 : 68,
      windSpeed: isSeogwipo ? 14.4 : 18.2,
      windDirection: isSeogwipo ? 315 : 290,
      precipitation: 0.0,
      weatherCode: 3,
      weatherDescription:
        queryMode === 'historical'
          ? '흐림 (발생 당시 북서풍 계열 바람)'
          : '흐림 (북서풍 계열 바람)',
      baseTime: queryMode === 'historical' ? matchedHour : nowIso,
      queriedAt: nowIso,
      source:
        queryMode === 'historical'
          ? 'Open-Meteo Hourly Historical Model (발생 당시 시각 사후 매칭 · 시연 참고값)'
          : 'Open-Meteo Forecast API (즉시 조회 시연 모델 참고값)',
    };
  }

  // Live mode: Call Open-Meteo (either current or hourly past_days)
  try {
    const data = await queryOpenMeteo(targetCoords, queryMode, pastDays, occurredAt);
    return {
      status: 'verified',
      isModelReference: true,
      isGpsBased,
      queryMode,
      matchedTargetTime: queryMode === 'historical' ? data.baseTime : undefined,
      locationName: isGpsBased
        ? queryMode === 'historical'
          ? 'Open-Meteo GPS 발생 당시 시간대 사후 기상 연동'
          : 'Open-Meteo 실시간 GPS 기상 연동'
        : `${locationName} (${queryMode === 'historical' ? '발생 당시 시각 매칭' : '실시간 참고 데이터'})`,
      coordinates: { lat: targetCoords.lat, lng: targetCoords.lng },
      temperature: data.temperature,
      humidity: data.humidity,
      windSpeed: data.windSpeed,
      windDirection: data.windDirection,
      precipitation: data.precipitation,
      weatherCode: data.weatherCode,
      weatherDescription: getWeatherDescription(data.weatherCode),
      baseTime: data.baseTime,
      queriedAt: nowIso,
      source:
        queryMode === 'historical'
          ? 'Open-Meteo Hourly Historical Model (발생 시각 기준)'
          : 'Open-Meteo Numerical Weather Prediction Model (현재 시각 기준)',
    };
  } catch {
    // Fallback once to city representative coordinates if GPS query failed
    if (isGpsBased) {
      const fallbackCoords = city?.includes('서귀포') ? SEOGWIPO_COORDS : JEJU_CITY_COORDS;
      try {
        const fbData = await queryOpenMeteo(fallbackCoords, queryMode, pastDays, occurredAt);
        return {
          status: 'verified',
          isModelReference: true,
          isGpsBased: false,
          queryMode,
          matchedTargetTime: queryMode === 'historical' ? fbData.baseTime : undefined,
          locationName: `${city || '제주시'} 대표 좌표 폴백 (권역 참고 데이터)`,
          coordinates: fallbackCoords,
          temperature: fbData.temperature,
          humidity: fbData.humidity,
          windSpeed: fbData.windSpeed,
          windDirection: fbData.windDirection,
          precipitation: fbData.precipitation,
          weatherCode: fbData.weatherCode,
          weatherDescription: getWeatherDescription(fbData.weatherCode),
          baseTime: fbData.baseTime,
          queriedAt: nowIso,
          source: 'Open-Meteo Forecast API (GPS 실패 후 권역 폴백)',
        };
      } catch {
        // Fallback also failed
      }
    }

    return {
      status: 'unavailable',
      isModelReference: true,
      isGpsBased: false,
      queryMode,
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
