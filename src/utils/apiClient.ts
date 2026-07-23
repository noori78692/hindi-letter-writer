/**
 * Centralized API Client with support for VITE_API_BASE_URL,
 * response type verification, timeout, retry, and Android Capacitor safety.
 */

const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.replace(/\/+$/, '');
  }
  // Default to relative path for standard web preview / fullstack Express
  return '';
};

export async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {},
  retries = 2
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Timeout controller (15 seconds max)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type') || '';

      // Check if server returned HTML fallback (like index.html on 404/misroute)
      if (contentType.includes('text/html')) {
        throw new Error(
          'सर्वर से अमान्य प्रतिक्रिया (HTML) प्राप्त हुई। कृपया जांचें कि बैकएंड सर्वर (API) सही तरीके से चल रहा है।'
        );
      }

      const textData = await response.text();
      let jsonData: any = {};
      try {
        jsonData = textData ? JSON.parse(textData) : {};
      } catch (e) {
        throw new Error('सर्वर से अमान्य डेटा स्वरूप (Invalid JSON) प्राप्त हुआ।');
      }

      if (!response.ok) {
        const errorMsg =
          jsonData.error ||
          jsonData.message ||
          `सर्वर त्रुटि (${response.status}): ${response.statusText}`;
        throw new Error(errorMsg);
      }

      return jsonData as T;
    } catch (err: any) {
      lastError = err;
      if (err.name === 'AbortError') {
        lastError = new Error('सर्वर प्रतिक्रिया में समय सीमा समाप्त (Timeout) हो गई। पुनः प्रयास करें।');
      }

      // Don't retry if aborted or explicitly received text/html
      if (
        attempt < retries &&
        !err.message?.includes('HTML') &&
        err.name !== 'AbortError'
      ) {
        await new Promise((res) => setTimeout(res, 800 * (attempt + 1)));
      } else {
        break;
      }
    }
  }

  throw lastError || new Error('अनजान नेटवर्क त्रुटि। कृपया अपना इंटरनेट कनेक्शन जांचें।');
}
