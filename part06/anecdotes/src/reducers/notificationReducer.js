const notificationReducer = (state='', action) => {
  if(action.type === 'ADD' || action.type === 'VOTE') {
    return action.payload.notification
  }

  if(action.type === 'HIDE-NOTIFY')
    return ''
  
  return state
}

export default notificationReducer