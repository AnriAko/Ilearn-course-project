import { useState } from 'react';
import CONFIG from '../config';
import axios from 'axios';

const Signup = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			console.log("Sign up");
			const { data } = await axios.post(`${CONFIG.apiBaseUrl}${CONFIG.routes.auth.signup}`, { username, email, password, passwordConfirm });
			localStorage.setItem('userToken', data.token);
			console.log('Signup successful');
		}
		catch (e) {
			if (e.response && e.response.data && e.response.data.message) {
				console.error('Signup failed', e.response.data.message);
			} else {
				console.error('Signup failed', e.message);
			}
		}
	}
	return (
		<div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
			<div className='signup container' style={{ maxWidth: '400px', minHeight: '560px', border: '2px solid gray', borderRadius: '5%', padding: '20px' }}>
				<h2 style={{ margin: '20px' }}>Signup</h2>
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
						<label htmlFor="email">Email:</label>
						<input type="email"
							className='form-control'
							name='email'
							id='email'
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder='email@mail.com' />
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
					<div className="form-group" style={{ margin: '20px' }}>
						<label htmlFor="passwordConfirm">Confirm password:</label>
						<input type="password"
							className='form-control'
							name='passwordConfirm'
							id='passwordConfirm'
							value={passwordConfirm}
							onChange={(e) => setPasswordConfirm(e.target.value)}
							placeholder='********' />
					</div>
					<button type="submit" className="btn btn-primary mb-2" style={{ margin: '20px' }}>Sign Up</button>
				</form>
			</div>
		</div>

	)
}

export default Signup;