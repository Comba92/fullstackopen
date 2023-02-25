const listHelper = require('../utils/list_helper')
const blogs = require('../utils/initialBlogs')


test('dummy returns one', () => {
  const result = listHelper.dummy()
  expect(result).toBe(1)
})

test('author with largest amount of blogs', () => {
  const result = listHelper.mostBlogs(blogs)
  expect(result).toEqual({
    author: 'Robert C. Martin',
    blogs: 3
  })
})

test('author with largest amount of likes', () => {
  const result = listHelper.mostLikes(blogs)
  expect(result).toEqual({
    author: 'Edsger W. Dijkstra',
    likes: 17
  })
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual({
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    })
  })
})