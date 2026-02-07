import { NextRequest, NextResponse } from 'next/server';
import { processJobRecords } from '@/lib/processor';
import type { JobRecord } from '@/lib/types';

export const maxDuration = 60; // Vercel Pro版の場合は60秒

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json() as { data: JobRecord[] };

    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    if (data.length === 0) {
      return NextResponse.json(
        { error: 'No data provided' },
        { status: 400 }
      );
    }

    if (data.length > 30000) {
      return NextResponse.json(
        { error: 'Too many records (max 30,000)' },
        { status: 400 }
      );
    }

    // 処理実行
    const results = await processJobRecords(data);

    // 統計情報
    const stats = {
      total: results.length,
      canPublish: results.filter(r => r.canPublish).length,
      cannotPublish: results.filter(r => !r.canPublish).length,
      vocationalIntroduction: results.filter(r => r.isVocationalIntroduction).length,
      directHire: results.filter(r => r.isDirectHire).length,
      minimumWageViolations: results.filter(r => r.minimumWageViolation).length,
    };

    return NextResponse.json({
      success: true,
      results,
      stats,
    });
  } catch (error) {
    console.error('Processing error:', error);
    return NextResponse.json(
      { error: 'Processing failed' },
      { status: 500 }
    );
  }
}
