interface Result {
  periodLength: number,
  trainingDays: number,
  target: number,
  average: number,
  success: boolean,
  rating: number,
}

export default function calculateExercises (hours: number[], target: number): Result {
  const trainingDays = hours.filter(h => h != 0).length
  const average = hours.reduce((sum, curr) => sum+curr) / hours.length
  const rating = (average / target) < 0.5
    ?  1
    : (average / target) < 0.75
      ? 2
      : 3

  return {
    periodLength: hours.length,
    trainingDays,
    success: target == trainingDays,
    rating,
    target,
    average
  }
}


function parseArguments (args: string[]): { hours: number[], target: number } {
  if (args.length < 4) throw new Error('Not enough arguments')
  
  const hours = args.slice(2, -1).map(val => Number(val))
  const target = Number(args[args.length-1])

  if(hours.some(val => isNaN(val)) || isNaN(target)) {
    throw new Error('Some values were not numbers!')
  }

  return {
    hours,
    target
  }
}

try {
  const {hours, target} = parseArguments(process.argv)
  console.log(calculateExercises(hours, target))
} catch(error: unknown) {
  if (error instanceof Error) {
    console.log('Error', error.message)
  } else {
    console.log('Something bad happened...')
  }
}