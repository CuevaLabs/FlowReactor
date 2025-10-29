import { NextResponse } from 'next/server';

type UnlockPayload = {
    roleKey: string;
    roleLabel: string;
    xp: number;
};

export async function POST(request: Request) {
    try {
        const payload = (await request.json()) as UnlockPayload;
        if (!payload?.roleKey) {
            return NextResponse.json({ ok: false, message: 'roleKey is required' }, { status: 400 });
        }

        console.info('[lock-in] role unlock requested', payload);

        // TODO: Integrate with Whop role management when API access is available.
        // Example: await whopSdk.communities.assignRoleToUser({ ... })

        return NextResponse.json({ ok: true, message: 'Role unlock recorded (stubbed).' });
    } catch (error) {
        console.error('[lock-in] role unlock error', error);
        return NextResponse.json({ ok: false, message: 'Failed to record role unlock.' }, { status: 500 });
    }
}
