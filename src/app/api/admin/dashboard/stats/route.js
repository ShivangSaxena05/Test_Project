import { NextResponse } from 'next/server';
import DBConnect from '@/app/database/lib/db';
import Candidate from '@/app/database/models/Candidate';
import QA from '@/app/database/models/QA';
import Task from '@/app/database/models/Task';
import Language from '@/app/database/models/Language';
import Sentence from '@/app/database/models/Sentence';
import getUserFromToken from '@/app/database/lib/auth';
import { ADMIN } from '@/app/database/constants/role';
import { UNDER_CANDIDATE, UNDER_QA, COMPLETED } from '@/app/database/constants/constants';

export async function GET(request) {
  try {
    const { user, error } = await getUserFromToken(request);

    if (error) {
      const status = error === "No token found" ? 401 : 403;
      return NextResponse.json({ message: error }, { status });
    }

    if (user.role !== ADMIN) {
      return NextResponse.json(
        { message: `Access denied. Only '${ADMIN}' can view dashboard statistics.` },
        { status: 403 }
      );
    }

    await DBConnect();

    // Get all counts in parallel for performance
    const [
      totalCandidates,
      totalQA,
      totalTasks,
      totalLanguages,
      totalSentences,
      tasksUnderCandidate,
      tasksUnderQA,
      tasksCompleted,
      newCandidatesThisWeek,
      newQAThisWeek
    ] = await Promise.all([
      Candidate.countDocuments({}),
      QA.countDocuments({}),
      Task.countDocuments({}),
      Language.countDocuments({}),
      Sentence.countDocuments({}),
      Task.countDocuments({ status: UNDER_CANDIDATE }),
      Task.countDocuments({ status: UNDER_QA }),
      Task.countDocuments({ status: COMPLETED }),
      Candidate.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      QA.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    ]);

    const stats = {
      users: {
        candidates: totalCandidates,
        qa: totalQA,
        totalUsers: totalCandidates + totalQA,
        newUsersThisWeek: newCandidatesThisWeek + newQAThisWeek
      },
      tasks: {
        total: totalTasks,
        underCandidate: tasksUnderCandidate,
        underQA: tasksUnderQA,
        completed: tasksCompleted
      },
      content: {
        languages: totalLanguages,
        sentences: totalSentences
      }
    };

    return NextResponse.json(
      { message: 'Dashboard statistics fetched successfully', stats },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in /api/admin/dashboard/stats GET API:', error.message);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}

