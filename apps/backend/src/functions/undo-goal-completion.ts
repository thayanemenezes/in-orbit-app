import { and, desc, eq, gte, lte } from 'drizzle-orm'
import { db } from '../db'
import { goalCompletions } from '../db/schema'
import dayjs from 'dayjs'

interface UndoGoalCompletionReq {
  goalId: string
}

export async function undoGoalCompletion({ goalId }: UndoGoalCompletionReq) {
  try {
    if (!goalId) {
      throw new Error('Invalid goalId')
    }

    await db
      .delete(goalCompletions)
      .where(eq(goalCompletions.id, goalId))
      .returning()

    return { message: 'Goal completion undone successfully' }
  } catch (error) {
    console.error('Error undoing goal completion:', error)
    return {
      status: 500,
      message: 'Internal server error',
    }
  }
}
