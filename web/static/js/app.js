import 'phoenix_html'
import {Socket, Presence} from 'phoenix'

const user = document.getElementById('User').innerText
const socket = new Socket('/socket', {
  params: {
    user: user
  }
})

socket.connect()