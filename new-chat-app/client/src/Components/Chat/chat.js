import React, {useState, useEffect} from 'react';
import querystring from 'query-string';
import io from 'socket.io-client';
import ReactEmoji from 'react-emoji';
import "./chat.css";

let socket;

const Chat = ({location}) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT = 'localhost:5000';

    useEffect(()=>{
        const {name, room} = querystring.parse(location.search);

        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);
        
        socket.emit('join', {name, room});

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, location.search);

    useEffect(()=> {
        socket.on('message', (message) => {
            const arr = [...messages, message];
            setMessages(arr);
        })
    }, [messages]);
    
    const sendMessage = (event) => {
        socket.emit('sendMessage', message, () => setMessage(''));
    }

    return (
        <div>
            <div className="container">
                <div className="container-fluid h-100">
                    <div className="row justify-content-center h-100 col-md-8 col-xl-6 chat card">
                        <div className="card-header msg_head">
                            <div className="d-flex bd-highlight">
                                <div className="user_info">
                                    <span>Room Name: {room}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className = "card-body msg_card_body">
                    { 
                    messages.map((message, i) => <div className="d-flex justify-content-start mb-4 msg_cotainer" key={i}><b>{message.user}</b>---> {ReactEmoji.emojify(message.text)}</div>)
                    } 
                </div>
                <div className="card-footer">
                    <div className="input-group">  
                       
                            <input className="form-control type_msg" value={message} 
                                    type="text"
                                    placeholder="Type a message..."
                                    onChange={(event) => setMessage(event.target.value)}
                                    onKeyPress = {event=> event.key === 'Enter' ? sendMessage(event) : null}
                            />
                        
                        <div className="input-group-append">
                            <span className="input-group-text send_btn" onClick={(event)=>sendMessage(event)}>
                                <i className="fas fa-location-arrow"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chat;