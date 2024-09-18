export async function undoGoalCompletion(goalId: string) {
  await fetch('http://localhost:3333/completions/undo', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      goalId,
    }),
  }).then(res => console.log(res))
}
