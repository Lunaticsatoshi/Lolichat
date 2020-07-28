let ws;
let chatUsersCont = document.querySelector('#chatUsers');
let chatusersCount = document.querySelector('#chatUsersCount');

window.addEventListener('DOMContentLoaded', () => {
    ws = new WebSocket(`ws://localhost:3000/ws`);
    ws.addEventListener('open', onConnectionOpen);
    ws.addEventListener('message', onMessageRecieved);
})

function onConnectionOpen(){
    console.log('Establishing Connection');
    const queryParams = getQueryParams()
    console.log(queryParams);
    if (!queryParams.name || !queryParams.group){
        window.location.href = 'chat.html';
        return
    }
    const event = {
        event: 'join',
        groupName: queryParams.group,
        name: queryParams.name
    }
    ws.send(JSON.stringify(event));
}

function onMessageRecieved(event){
    console.log('Recieved message', event);
    event = JSON.parse(event.data);
    console.log(event);
    switch(event.event) {
        case 'users':
            chatUsersCont.innerHTML = '';
            chatusersCount.innerHTML = event.data.length
            event.data.forEach(u => {
                const user1 = document.createElement('div')
                user1.className = 'chat-user';
                user1.innerHTML = u.name;
                chatUsersCont.appendChild(user1)
            })
    }
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