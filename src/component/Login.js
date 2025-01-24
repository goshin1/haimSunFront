import './login.css'
import { useNavigate } from "react-router-dom"
import { use, useState } from "react";

export default function Login(){
    const navigate = useNavigate();
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [sign, setSign] = useState(false);

    const handleIdChange = (event) => {
        setId(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handleNameChange = (event) => {
        setName(event.target.value)
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if(sign){
            // 회원가입
        }else{
            // 로그인
            
            navigate('/main', {
                state : {
                    id : 'id'
                }
            })
        }
        console.log('아이디:', id, '비밀번호:', password);
    };

    return <div className="login-form">
        <div className="logo">
            HaimSun
        </div>
        <form onSubmit={handleSubmit} style={{height : sign ? '50vh' : '40vh'}}>
            <input
                name='id'
                type="text"
                placeholder="ID"
                value={id}
                onChange={handleIdChange}
            />
            <input
                name='password'
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
            />
            <input
                name='email'
                type="text"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                style={{height : sign ? '5vh' : '0vh', opacity : sign ? '100%' : '0%'}}
            />
            <input
                name='name'
                type="text"
                placeholder="Name"
                value={name}
                onChange={handleNameChange}
                style={{height : sign ? '5vh' : '0vh', opacity : sign ? '100%' : '0%'}}
            />
            
            <button type="submit">{sign ? 'Sign' : 'Login'}</button>
            <button type="button" onClick={() => {
                setSign(!sign)
            }}>{sign ? 'Cancle' : 'Now Sign'}</button>
        </form>
    </div>
}