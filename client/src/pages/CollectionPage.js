import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import CONFIG from '../config';

const CollectionPage = () => {
	const [collection, setCollection] = useState(null);
	const { id } = useParams();

	useEffect(() => {
		const collectionUrl = CONFIG.apiBaseUrl + CONFIG.routes.collections.single.replace(':collectionID', id);
		axios.get(collectionUrl)
			.then(response => {
				setCollection(response.data.collection);
				console.log(response.data.collection);
			})
			.catch(error => console.error('Error fetching collection:', error));
	}, [id]);

	if (!collection) {
		return <div>Loading collection...</div>;
	}

	return (
		<div>

			<h1>Collection title: {collection.Title}</h1>
			<h2>Description: {collection.Description}</h2>
			<h2>Theme: {collection.Theme}</h2>
			<h2>Author: <Link to={`/users/${collection.AuthorID}`}> {collection.User.Username} </Link></h2>

		</div>
	);
};

export default CollectionPage;
