import { useState } from 'react';
import CONFIG from '../config';
import axios from 'axios';

const Login = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const { data } = await axios.post(`${CONFIG.apiBaseUrl}${CONFIG.routes.auth.login}`, { username, password });
			localStorage.setItem('userToken', data.token);
			console.log('Login successful');
		}
		catch (e) {
			if (e.response && e.response.data && e.response.data.message) {
				console.error('Login failed', e.response.data.message);
			} else {
				console.error('Login failed', e.message);
			}
		}

	}
	return (
		<div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
			<div className='signup container' style={{ maxWidth: '400px', minHeight: '360px', border: '2px solid gray', borderRadius: '5%', padding: '20px' }}>
				<h2 style={{ margin: '20px' }}>Log in</h2>
				<form onSubmit={handleSubmit}>
					<div className="form-group" style={{ margin: '20px' }}>
						<label htmlFor="username">Username:</label>
						<input type="text"
							className='form-control'
							name='username'
							id='username'
							required
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder='Username' />
					</div>
					<div className="form-group" style={{ margin: '20px' }}>
						<label htmlFor="password">Password</label>
						<input type="password"
							className='form-control'
							name='password'
							id='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder='********' />
					</div>

					<button type="submit" className="btn btn-primary mb-2" style={{ margin: '20px' }}>Log in</button>
				</form>
			</div>
		</div>
	)
}

export default Login;