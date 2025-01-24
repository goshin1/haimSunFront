import './login.css'
import { useNavigate } from "react-router-dom"
import { useState } from "react";

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

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Form data
        const id = event.target.id.value;
        const password = event.target.password.value;
        const email = event.target.email ? event.target.email.value : null;
        const name = event.target.name ? event.target.name.value : null;
    
        try {
            if (sign) {
                // 중복 체크
                const duplicateResponse = await fetch('https://heimsunback-production.up.railway.app/duplicate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user_id: id })
                });
    
                const isDuplicate = await duplicateResponse.json();
                if (!duplicateResponse.ok || !isDuplicate) {
                    alert('아이디가 중복되었습니다. 다른 아이디를 사용해주세요.');
                    return;
                }
    
                // 회원가입 요청
                const signResponse = await fetch('https://heimsunback-production.up.railway.app/sign', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_id: id,
                        password,
                        name,
                        email
                    })
                });
    
                if (signResponse.ok) {
                    alert('회원가입이 완료되었습니다! 로그인 해주세요.');
                } else {
                    alert('회원가입에 실패했습니다. 다시 시도해주세요.');
                }
            } else {
                // 로그인 요청
                const loginResponse = await fetch('https://heimsunback-production.up.railway.app/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_id: id,
                        password
                    })
                });
    
                const isSuccess = await loginResponse.json();
                if (loginResponse.ok && isSuccess) {
                    alert('로그인 성공!');
                    navigate('/main', {
                        state: {
                            id
                        }
                    });
                } else {
                    alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('서버와의 통신 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    
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