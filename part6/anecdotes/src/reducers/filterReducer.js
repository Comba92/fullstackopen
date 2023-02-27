const filterReducer = (state='', action) => {
  if (action.type === 'UPDATE')
    return action.filter.toLowerCase()
  return state
}

export default filterReducer