const Header = ({ course }) => (
  <>
    <h1>{course}</h1>
  </>
)

const Part = ({ part }) => {
  const {name, exercises} = part

  return (
    <>
      <p>{name} {exercises}</p>
    </>
  )
}

const Content = ({ parts }) => {
  return parts.map(part => {
    return <Part part={part} />
  })
}

const Total = ({ parts }) => {
  const sum = parts.reduce( (sum, curr) => sum + curr.exercises, 0)
  
  return (
    <>
      <p>Number of exercises {sum}</p>
    </>
  )
}

const Course = ({ courses }) => {
  return courses.map(course => {
    return (
      <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
  })
}