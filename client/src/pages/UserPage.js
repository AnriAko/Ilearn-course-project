import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CONFIG from '../config';

const AuthorPage = () => {
	const [user, setUser] = useState(null);
	const { userID } = useParams();

	useEffect(() => {
		const userURL = `${CONFIG.apiBaseUrl}/users/${userID}`;
		axios.get(userURL)
			.then(response => {
				console.log(response.data)
				setUser(response.data);
			})
			.catch(error => console.error('Error fetching author:', error));
	}, [userID]);

	if (!user) {
		return <div>Loading user...</div>;
	}

	return (
		<div>
			<h1>Username: {user.Username}</h1>
			<h2>Email: {user.Email}</h2>
			<h2>Language: {user.Language}</h2>
		</div>
	);
};

export default AuthorPage;