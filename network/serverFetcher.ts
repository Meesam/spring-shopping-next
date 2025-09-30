// utils/serverFetcher.ts (Server-side ONLY)

import { cookies } from 'next/headers'; // App Router Server API
import { redirect } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Simplified type for fetch options
interface CustomFetchOptions extends RequestInit {
    isRetry?: boolean;
}

export async function serverFetch(url: string, options: CustomFetchOptions = {}): Promise<Response> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    const headers = new Headers(options.headers);

    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }

    // 1. Initial Request
    let response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });

    // 2. Check for 401 Unauthorized
    if (response.status === 401 && !options.isRetry) {
        options.isRetry = true;

        // 3. Call the internal Route Handler to perform the refresh and cookie modification
        const refreshResponse = await fetch(`${BASE_URL}/api/auth/internal-refresh`, { method: 'POST' });

        if (refreshResponse.ok) {
            // Refresh succeeded, new cookies are set, get the new token to retry
            const data = await refreshResponse.json();

            // 4. Retry Original Request with the new token
            headers.set('Authorization', `Bearer ${data.newAccessToken}`);
            response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });
        } else {
            // Refresh failed (refresh token expired or invalid)
            redirect('/login');
        }
    }

    // Final check for unhandled errors
    if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
    }

    return response;
}