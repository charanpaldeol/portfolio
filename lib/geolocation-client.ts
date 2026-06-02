// Purpose: Browser geolocation helpers — GPS retries and IP-based network fallback.

export function geolocationErrorMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "Location access is blocked. Allow location for this site in your browser settings, then try again."
    case error.POSITION_UNAVAILABLE:
      return "GPS location is unavailable on this device. Enable system Location Services or search for a city instead."
    case error.TIMEOUT:
      return "Location request timed out. Try again."
    default:
      return "Could not access your location."
  }
}

export function geolocationUnsupportedMessage(): string | null {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return "Location is not supported in this browser."
  }
  if (typeof window !== "undefined" && !window.isSecureContext) {
    return "Location requires a secure connection (HTTPS)."
  }
  return null
}

type PositionAttempt = {
  enableHighAccuracy: boolean
  timeout: number
  maximumAge: number
  useWatch?: boolean
}

const GPS_ATTEMPTS: PositionAttempt[] = [
  { enableHighAccuracy: true, timeout: 20_000, maximumAge: 0 },
  { enableHighAccuracy: false, timeout: 15_000, maximumAge: 0 },
  { enableHighAccuracy: true, timeout: 20_000, maximumAge: 0, useWatch: true },
]

function getCurrentPosition(options: PositionOptions): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => reject(error),
      options
    )
  })
}

function watchForPosition(options: PositionOptions, timeoutMs: number): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) => {
    let watchId: number | null = null
    const timer = window.setTimeout(() => {
      if (watchId != null) navigator.geolocation.clearWatch(watchId)
      reject(Object.assign(new Error("timeout"), { code: 3, TIMEOUT: 3 }))
    }, timeoutMs)

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        window.clearTimeout(timer)
        if (watchId != null) navigator.geolocation.clearWatch(watchId)
        resolve(position.coords)
      },
      (error) => {
        window.clearTimeout(timer)
        if (watchId != null) navigator.geolocation.clearWatch(watchId)
        reject(error)
      },
      options
    )
  })
}

/** Try several GPS strategies before giving up (common on laptops without GPS fix). */
export async function getDeviceLocation(): Promise<GeolocationCoordinates> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    throw new Error("unsupported")
  }

  let lastError: GeolocationPositionError | null = null

  for (const attempt of GPS_ATTEMPTS) {
    try {
      const options: PositionOptions = {
        enableHighAccuracy: attempt.enableHighAccuracy,
        timeout: attempt.timeout,
        maximumAge: attempt.maximumAge,
      }
      if (attempt.useWatch) {
        return await watchForPosition(options, attempt.timeout)
      }
      return await getCurrentPosition(options)
    } catch (error) {
      if (isGeolocationError(error)) {
        lastError = error
        if (error.code === error.PERMISSION_DENIED) throw error
        continue
      }
      throw error
    }
  }

  throw lastError ?? new Error("unavailable")
}

type ApproximateLocation = {
  lat: number
  lon: number
  label: string
}

/** Network/IP location via BigDataCloud (free client endpoint, no API key). */
export async function fetchApproximateLocation(): Promise<ApproximateLocation> {
  const params = new URLSearchParams({ localityLanguage: "en" })
  const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?${params.toString()}`)
  if (!res.ok) throw new Error(`network location status ${res.status}`)

  const data = (await res.json()) as {
    latitude?: number
    longitude?: number
    city?: string
    locality?: string
    principalSubdivision?: string
    countryName?: string
  }

  if (typeof data.latitude !== "number" || typeof data.longitude !== "number") {
    throw new Error("network location missing coordinates")
  }

  const parts = [data.city ?? data.locality, data.principalSubdivision, data.countryName].filter(
    (part): part is string => typeof part === "string" && part.trim() !== ""
  )

  return {
    lat: data.latitude,
    lon: data.longitude,
    label: parts.join(", ") || "Approximate location",
  }
}

export async function resolveCurrentLocation(): Promise<{
  lat: number
  lon: number
  approximate: boolean
}> {
  try {
    const coords = await getDeviceLocation()
    return { lat: coords.latitude, lon: coords.longitude, approximate: false }
  } catch (error) {
    if (isGeolocationError(error) && error.code === error.PERMISSION_DENIED) throw error
    const approx = await fetchApproximateLocation()
    return { lat: approx.lat, lon: approx.lon, approximate: true }
  }
}

function isGeolocationError(error: unknown): error is GeolocationPositionError {
  return (
    typeof error === "object" &&
    error != null &&
    "code" in error &&
    typeof (error as GeolocationPositionError).code === "number"
  )
}
