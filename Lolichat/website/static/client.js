let ws;

window.addEventListener('DOMContentLoaded', () => {
    ws = new WebSocket(`ws://localhost:3000/ws`);
    ws.addEventListener('open', onConnectionOpen);
    ws.addEventListener('open', onMessageRecieved);

    const queryParams = getQueryParams()
    console.log(queryParams);
})

function onConnectionOpen(){
    console.log('Establishing Connection');
}

function onMessageRecieved(event){
    console.log('Recieved message', event);
}

function getQueryParams(){
    const search = window.location.search.substring(1);
    const parameters = search.split('&');
    const params = {};
    for (const parameter of parameters){
        const parts = parameter.split('=');
        params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
    }

    return params;
}