import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { undoGoalCompletion } from '../../functions/undo-goal-completion'

export const undoCompletionRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/completions/undo',
    {
      schema: {
        body: z.object({
          goalId: z.string(),
        }),
      },
    },
    async (req, reply) => {
      const { goalId } = req.body

      const result = await undoGoalCompletion({ goalId })

      if (result.status === 404) {
        reply.status(404).send(result.message)
      } else {
        reply.send(result.message)
      }
    }
  )
}
