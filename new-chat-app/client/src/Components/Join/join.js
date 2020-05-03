import React, { useState} from 'react';
import {Link} from 'react-router-dom';
import "./join.css";

const Join = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    return (
        <div className = "d-flex justify-content-center h-100">
            <div className = "card">
                <div className = "card-header">
                    <h3>Harel's Chat</h3>
                </div>
                <div className = "card-body">
                    <form>
                        <div class="input-group form-group">
                            <input className = "input" placeholder="Name" type="text" onChange={(event) => setName(event.target.value)} />                
                        </div>
                        <div className="input-group form-group">
                            
                            <input className = "input" placeholder="Room" type="text" onChange={(event) => setRoom(event.target.value)} />                
                        </div>
                        <div className="form-group">
                            <Link onClick={event => (!name | !room) ? event.preventDefault() : null} to={'/chat?name=' + name + '&room=' + room}>
                                <button className="btn float-left login_btn" type="submit"> Sign In</button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Join;