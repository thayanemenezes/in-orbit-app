import { DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { CheckCircle2, Plus } from 'lucide-react'
import InOrbitIcon from '../assets/in-orbit-icon.svg'
import { Progress, ProgressIndicator } from './ui/progress-bar'
import { Separator } from './ui/separator'
import { OutlineButton } from './ui/outline-button'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getSummary } from '../http/get-summary'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-BR'
import { PendingGoals } from './pending-goals'
import { undoGoalCompletion } from '../http/undo-goal-competion'

dayjs.locale(ptBR)

export default function Summary() {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['summary'],
    queryFn: getSummary,
    staleTime: 1000 * 60,
  })

  if (!data) {
    return null
  }

  const firstDayOfWeek = dayjs().startOf('week').format('D MMM')
  const lastDayOfWeek = dayjs().endOf('week').format('D MMM')

  const completedPercentage = Math.round((data.completed * 100) / data.total)

  async function handleUndoGoal(goalId: string) {
    await undoGoalCompletion(goalId)
    queryClient.invalidateQueries({ queryKey: ['summary'] })
    queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
  }

  return (
    <div className="py-10 max-w-[500px] px-5 mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={InOrbitIcon} alt="in orbit icon" />
          <span className="text-lg font-bold capitalize">
            {firstDayOfWeek} - {lastDayOfWeek}
          </span>
        </div>
        <DialogTrigger asChild>
          <Button>
            <Plus className="size-sm" />
            Cadastrar meta
          </Button>
        </DialogTrigger>
      </div>
      <div className="flex flex-col gap-3">
        <Progress value={8} max={35}>
          <ProgressIndicator style={{ width: 200 }} />
        </Progress>
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            Você completou{' '}
            <span className="text-zinc-100">{data?.completed}</span> de{' '}
            <span className="text-zinc-100">{data?.total}</span> metas nessa
            semana.
          </span>
          <span>{completedPercentage}%</span>
        </div>
      </div>
      <Separator />
      <PendingGoals />
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-medium">Sua semana</h2>
        {data.goalsPerDay ? (
          Object.entries(data.goalsPerDay).map(([date, goals]) => {
            const weekDay = dayjs(date).format('dddd')
            const formattedDate = dayjs(date).format('D[ de ]MMM')

            return (
              <div className="flex flex-col gap-4 capitalize" key={date}>
                <h3 className="font-medium">
                  {weekDay}{' '}
                  <span className="text-zinc-400 text-xs">
                    ({formattedDate})
                  </span>
                </h3>
                <ul className="flex flex-col gap-3">
                  {goals.map(goal => {
                    const time = dayjs(goal.completedAt).format('HH:mm')
                    return (
                      <li className="flex items-center gap-2" key={goal.id}>
                        <CheckCircle2 className="size-4 text-pink-500" />
                        <span className="text-sm text-zinc-400">
                          Você completou{' '}
                          <span className=" text-zinc-100">"{goal.title}"</span>{' '}
                          às <span className=" text-zinc-100">{time}h</span>
                        </span>
                        <button
                          type="button"
                          className="text-xs mx-2 text-zinc-400 underline cursor-pointer"
                          onClick={() => handleUndoGoal(goal.id)}
                        >
                          Desfazer
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })
        ) : (
          <p className="text-zinc-400">Nenhuma meta para esta semana.</p>
        )}
      </div>
    </div>
  )
}
