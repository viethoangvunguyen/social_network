import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createComment } from '../../redux/actions/commentAction'
import useGetElementCoords from '../../hooks/useGetElementCoords'
import { getDataAPI } from '../../utils/fetchData'
import Icons from '../Icons'
import Popver from './Popver'

const InputComment = ({children, post, onReply, setOnReply}) => {
    const [content, setContent] = useState('')
    const { coords, elmRef, handleGetElementCoords } = useGetElementCoords();
    const { auth, socket, theme } = useSelector(state => state)
    const [listUser, setListUser] = useState(
        [
            {
                id: '',
                name: '',
                avatar: ''
            }
        ]
    );
    const [userChoose, setUserSChoose] = useState();
    const [isShow, setIsShow] = useState(false);
    const dispatch = useDispatch()

    const handleSubmit = (e) => {
        e.preventDefault()
        if(!content.trim()){
            if(setOnReply) return setOnReply(false);
            return;
        }

        setContent('')
        
        const newComment = {
            content,
            likes: [],
            user: auth.user,
            createdAt: new Date().toISOString(),
            reply: onReply && onReply.commentId,
            tag: onReply && onReply.user
        }
        
        dispatch(createComment({post, newComment, auth, socket}))
        if(setOnReply) return setOnReply(false);
    }

    const getData = async() => {
        const res = await getDataAPI(`/user/${auth.user._id}`, auth.token)
        setListUser(mappingData(res.data.user.following))
    }

    const mappingData = (array) => {
        return array.map((item) => {
            return {
                id: item._id,
                name: item.fullname,
                avatar: item.avatar
            }
        })
    }

    const handleTyping = (e) => {
        setContent(e.target.value);
        if (e.target.value.includes('@') && e.target.value.indexOf(' ') <= 0) {
            setIsShow(true);
            handleGetElementCoords(e);   
             getData();
        } else {
            
            setIsShow(false);
        }
    }
    
    const clickItem = (item) => {
        const string = content + item.name;
        setContent(string+ '')
        setIsShow(false);
        setUserSChoose(item);
    }

    return (
        <form className="card-footer comment_input" ref={elmRef}  onSubmit={handleSubmit}>
            {children}
            <input type="text" placeholder="Add your comments..."
            value={content} onChange={e => handleTyping(e)}
            style={{
                filter: theme ? 'invert(1)' : 'invert(0)',
                color: theme ? 'white' : '#111',
                background: theme ? 'rgba(0,0,0,.03)' : '',
            }} />

            <Icons setContent={setContent} content={content} theme={theme} />
            {
                isShow && (<Popver
                    coords={coords}
                    position="right"
                >
                    {
                        listUser.length > 0 &&
                        listUser.map((item) => (
                            <li className="popver-list" onClick={()=> clickItem(item)}>
                            <img className="avatar" src={item.avatar} alt="" />
                            <span className="name">{item.name}</span>
                        </li>
                        ))
                    }
                </Popver>)
            }
            <button type="submit" className="postBtn">
                Post
            </button>
        </form>
    )
}

export default InputComment
