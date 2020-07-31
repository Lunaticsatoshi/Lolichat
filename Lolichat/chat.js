import { isWebSocketCloseEvent } from "https://deno.land/std@0.58.0/ws/mod.ts";
import { v4 } from "https://deno.land/std@0.58.0/uuid/mod.ts";

const userMap = new Map();

const groupsMap = new Map();

const messagesMap = new Map();

export default async function chat(ws){
    console.log('Connected');
    const userId = v4.generate();

    for await (let data of ws){
        console.log(data, typeof data);
        const event = typeof data === 'string' ? JSON.parse(data) : data;
        if (isWebSocketCloseEvent(data)){
            const user = userMap.get(userId);
            let users = groupsMap.get(user.groupName) || [];
            users = users.filter(u => u.userId !== userId);
            groupsMap.set(user.groupName, users);
            userMap.delete(userId);
            
            emitUserList(user.groupName);
            break;
        }
        switch (event.event){
            case 'join':
                const user = {
                    userId,
                    name: event.name,
                    groupName: event.groupName,
                    ws
                };
                userMap.set(userId, user);
                const users = groupsMap.get(event.groupName) || [];
                users.push(user);
                groupsMap.set(event.groupName, users);

                emitUserList(event.groupName);
            break;
            case 'message':
                const userObj = userMap.get(userId);
                const message = {
                    userId,
                    name: userObj.name,
                    message: event.data
                }
                emitMessage(userObj.groupName, message, userId)
        }
    }
}

function emitUserList(groupName) {
    const users = groupsMap.get(groupName) || [];
    for (const user of users){
        const event = {
            event: 'users',
            data: getDisplayUsers(groupName)
        }
        user.ws.send(JSON.stringify(event))
    }
}

function getDisplayUsers(groupName) {
    const users = groupsMap.get(groupName) || [];
    return users.map((u) => {
        return {
            userId: u.userId,
            name: u.name,
        }
    })
}

function emitMessage(groupName, message, senderId) {
    const users = groupsMap.get(groupName) || [];
    for (const user of users){
        message.sender = user.userId === senderId ? 'me' : senderId;
        const event = {
            event: 'message',
            data: message,
        }
        user.ws.send(JSON.stringify(event))
    }
}