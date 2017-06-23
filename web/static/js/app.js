import 'phoenix_html'
import {Socket, Presence} from 'phoenix'

const user = document.getElementById('User').innerText
const socket = new Socket('/socket', {
  params: {
    user: user
  }
})

socket.connect()

// User List
let presences = {}

const formatTimestamp = timestamp => {
  const date = new Date(timestamp)

  return date.toLocaleTimeString()
}

const listBy = (user, {metas: metas}) => {
  return {
    user: user,
    onlineAt: formatTimestamp(metas[0].online_at)
  }
}

const userList = document.getElementById('UserList')

const render = presences => {
  userList.innerHTML = Presence.list(presences, listBy)
    .map(presence => `
      <li>
        ${presence.user}
        <br>
        <small>online since ${presence.onlineAt}</small>
      </li>
    `)
    .join('')
  }

  // Channels
  const room = socket.channel('room:lobby')
  
  room.on('presence_state', state => {
    presences = Presence.syncState(presences, state)
    render(presences)
  })

  room.on('presence_diff', diff => {
    presences = Presence.syncDiff(presences, diff)
    render(presences)
  })

  room.join()