// app/api/auth/internal-refresh/route.ts (Internal endpoint)
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export async function POST(request: NextRequest) {
    debugger
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    console.log('POST', refreshToken)

    if (!refreshToken) {
        return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
    }

    try {
        // 1. Call external API to get new tokens
        const apiResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: refreshToken }),
        });
        console.log('POST', await apiResponse.json())

        if (!apiResponse.ok) {
            // Throw to jump to catch block
            throw new Error('External refresh failed');
        }

        const { accessToken, refreshToken: newRefreshToken } = await apiResponse.json();

        // 2. 🔑 SUCCESS: Modify cookies (ALLOWED in Route Handler)
        cookieStore.set('access_token', accessToken, { path: '/', maxAge: 60 });
        cookieStore.set('refresh_token', newRefreshToken, { path: '/', httpOnly: true, maxAge: 60 * 60 * 24 * 30 });

        return NextResponse.json({ success: true, newAccessToken: accessToken }, { status: 200 });

    } catch (error) {
        // 3. FAILURE: Delete cookies
        cookieStore.delete('access_token');
        cookieStore.delete('refresh_token');
        return NextResponse.json({ message: 'Session expired' }, { status: 401 });
    }
}