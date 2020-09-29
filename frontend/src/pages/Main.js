import React, {useEffect,useState} from 'react'
import {Link} from 'react-router-dom'
import io from 'socket.io-client'
import api from '../services/api'
import './Main.css'
import logo from '../assets/logo.png'
import like from '../assets/like.png'
import dislike from '../assets/dislike.png'
import itsamatch from '../assets/itsamatch.png'





export default function Main({match}){

    const [users ,setUsers] = useState([])
    const [matchDev,setMatchDev] = useState(null)

    useEffect(function(){
        async function  loadUsers(){
            const response = await api.get('/devs',{
                headers: {
                    user:match.params.id
                }
            })

            setUsers(response.data)

        }
        loadUsers()
    },[match.params.id])

    useEffect(function(){
        const socket = io('http://localhost:3333',{
            query:{
                user:match.params.id
            }
        })

        socket.on('match', dev => { 
            setMatchDev(dev)
        })

    },[match.params.id])

    async function handleLike(id){
        await api.post(`devs/${id}/likes` , null , {
            headers:{
                user:match.params.id
            }
        })

        setUsers(users.filter(user => user._id !== id))    }


    async function handleDisLike(id){
        await api.post(`devs/${id}/dislikes` , null , {
            headers:{
                user:match.params.id
            }
        })

        setUsers(users.filter(user => user._id !== id))
    }

    return (
        <div className="main-container">
            <Link to="/">
            <img src={logo} alt="tindev"/>
            </Link>
            { users.length > 0 ? (
                <ul>
            {users.map( user => (

                <li key={user._id}>
                    <img src={user.avatar} alt={user.name}/>
                    <footer>
                        <strong>
                            {user.name}
                        </strong>
                        <p>
                        {user.bio}
                        </p>
                    </footer>

                    <div className="buttons">
                        <button type="button" onClick = {function(){handleLike(user._id)}} ><img src={like} alt="Like"/></button>
                        <button type="button" onClick = {function(){handleDisLike(user._id)}}><img src={dislike} alt="Dislike"/></button>

                    </div>
                </li>
            ))}
             

            </ul>
            ) : (
                <div className="empty">Acabou =(</div>
            )}

        {matchDev && (
            <div className="match-container">
                <img src={itsamatch} alt="its a match"/>
                <img className = "avatar" src={matchDev.avatar} alt=""/>
                <strong>{matchDev.name}</strong>
                <p>{matchDev.bio}</p>
                <button type="button" onClick={function(){setMatchDev(null)}}>Fechar</button>
            </div>
        )}
        </div>
    )
}