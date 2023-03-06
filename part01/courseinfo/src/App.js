const Header = (props) => (
  <>
    <h1>{props.course}</h1>
  </>
)

const Part = (props) => {
  const {name, exercises} = props.part

  return (
    <>
      <p>{name} {exercises}</p>
    </>
  )
}

const Content = (props) => {
  return props.parts.map(part => {
    return <Part part={part} />
  })
}

const Total = (props) => {
  const sum = props.parts.reduce( (sum, curr) => sum + curr.exercises, 0)
  
  return (
    <>
      <p>Number of exercises {sum}</p>
    </>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App