let ws;

window.addEventListener('DOMContentLoaded', () => {
    ws = new WebSocket(`ws://localhost:3000/ws`);
    ws.addEventListener('open', onConnectionOpen);
    ws.addEventListener('open', onMessageRecieved);
})

function onConnectionOpen(){
    console.log('Establishing Connection');
}

function onMessageRecieved(){
    console.log('Recieved message', event);
}