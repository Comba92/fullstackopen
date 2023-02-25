const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, curr) => sum + curr.likes, 0)
}

const favoriteBlog = (blogs) => {
  const likes = blogs.map(blog => blog.likes)
  const maxLikes = Math.max(...likes)
  return blogs.find(blog => blog.likes === maxLikes)
}

const mostBlogs = (blogs) => {
  const blogsPerAuthor = new Map()
  // Make hashmap with {author: blogsCount}, time O(n)
  blogs.forEach(blog => {
    if (blogsPerAuthor.has(blog.author))
      blogsPerAuthor.set(blog.author, blogsPerAuthor.get(blog.author) + 1)
    else blogsPerAuthor.set(blog.author, 1)
  })

  // Find max blogCount in hashmap, O(n)
  const maxBlogs = Math.max(...blogsPerAuthor.values())

  // Convert hashmap to array of {pair, key}, and find the one with the max blogCount, O(n)
  return [...blogsPerAuthor]
    .map( ([author, blogsCount]) => ({ author, blogs: blogsCount }) )
    .find(author => author.blogs === maxBlogs)
}

const mostLikes = (blogs) => {
  const likesPerAuthor = new Map()

  // Make hashmap with {author: likesCount}, time O(n)
  blogs.forEach(blog => {
    if (likesPerAuthor.has(blog.author))
      likesPerAuthor.set(blog.author, likesPerAuthor.get(blog.author) + blog.likes)
    else likesPerAuthor.set(blog.author, blog.likes)
  })

  // Find max blogCount in hashmap, O(n)
  const maxLikes = Math.max(...likesPerAuthor.values())

  // Convert hashmap to array of {pair, key}, and find the one with the max blogCount, O(n)
  return [...likesPerAuthor]
    .map( ([author, blogsCount]) => ({ author, likes: blogsCount }) )
    .find(author => author.likes === maxLikes)
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}