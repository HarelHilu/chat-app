const users = [];

const addUser = ({id, name, room}) => {
    //name = name;
    //room = room;
    const user = { id, name, room};
    users.push(user);
}

const removeUser = (id) => {
    const inde = users.findIndex((user) => user.id === id);

    if(index !== -1) {
        return users.slice(index, 1)[0];
    }
}

const getUser = (id) => {
    users.find((user) => user.id === id);
}

const usersInRoom = (room) => {
    users.filter((user) => user.room === room);
}

module.exports = {addUser, removeUser, getUser,usersInRoom};