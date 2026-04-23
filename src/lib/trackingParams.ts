const TRACKING_PARAMS_KEY = "umi_tracking_params";
const TRACKING_DEBUG_KEY = "umi_tracking_debug";

const TRACKING_PARAM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
  "ttclid",
  "msclkid",
  "gbraid",
  "wbraid",
] as const;

type TrackingParamKey = (typeof TRACKING_PARAM_KEYS)[number];

type TrackingParams = Partial<Record<TrackingParamKey, string>>;

function isTrackingDebugEnabled(): boolean {
  if (typeof window === "undefined") return false;

  try {
    return window.localStorage.getItem(TRACKING_DEBUG_KEY) === "1";
  } catch {
    return false;
  }
}

function readStoredTrackingParams(): TrackingParams {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(TRACKING_PARAMS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as TrackingParams;
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
}

export function appendTrackingParamsToUrl(url: string, context?: string): string {
  if (typeof window === "undefined") return url;

  const debugEnabled = isTrackingDebugEnabled();
  const stored = readStoredTrackingParams();
  const targetUrl = new URL(url, window.location.origin);
  const appended: Partial<Record<TrackingParamKey, string>> = {};

  TRACKING_PARAM_KEYS.forEach((key) => {
    const value = stored[key];
    if (value && !targetUrl.searchParams.has(key)) {
      targetUrl.searchParams.set(key, value);
      appended[key] = value;
    }
  });

  if (debugEnabled) {
    console.info("[tracking] checkout params", {
      context: context || "unknown",
      originalUrl: url,
      finalUrl: targetUrl.toString(),
      appended,
    });
  }

  return targetUrl.toString();
}
