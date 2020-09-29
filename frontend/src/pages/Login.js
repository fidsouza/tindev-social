import React, {useState} from 'react'
import logo from '../assets/logo.png'
import './Login.css'
import api from '../services/api'


export default function Login({history}) {
    const [username,setusername] = useState('')

    async function handleSubmit (e) {
        e.preventDefault()

        const response = await api.post('/devs', {
            username,
        })

        const {_id} = response.data

        history.push(`/dev/${_id}`)
    }

    return (
        <div className="login-container">
        <form onSubmit={handleSubmit}>
        <img src={logo} alt="tindev"/>

            <input 
            type="text"
            placeholder="digite seu usuario github"
            value={username}
            onChange={ e => setusername(e.target.value)}
            />
            <button type="submit">Entrar
            </button>
        </form>
        </div>
    );
}