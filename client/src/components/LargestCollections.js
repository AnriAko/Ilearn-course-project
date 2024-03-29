import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Импортируем Link из react-router-dom
import CONFIG from '../config';

const LargestCollectionList = ({ amount }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [collections, setCollections] = useState(null);

	useEffect(() => {
		axios.get(`${CONFIG.apiBaseUrl}${CONFIG.routes.collections.biggest}`)
			.then((response) => {
				setCollections(response.data);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error('Error fetching data: ', error);
				setIsLoading(false);
			});
	}, []);

	if (amount === 0 || !collections) {
		return <p>No collections to display.</p>;
	}

	let largestCollections = isLoading ? [] : collections.slice(0, amount || collections.length);

	return (
		<div className="collection-table mt-3">
			<h2>Largest {amount} collection</h2>
			{isLoading ? <div>Loading collections...</div> :
				<table className="table table-striped table-hover">
					<thead>
						<tr>
							<th>CollectionID</th>
							<th>Title</th>
							<th>Theme</th>
							<th>Items</th>
							<th>Author</th>
						</tr>
					</thead>
					<tbody>
						{largestCollections.map((collection) => (
							<tr key={collection.CollectionID}>
								<td>{collection.CollectionID}</td>
								<td>
									<Link to={`/collections/${collection.CollectionID}`}>
										{collection.Title}
									</Link>
								</td>
								<td>{collection.Theme}</td>
								<td>{collection.ItemAmount}</td>
								<td><Link to={`/users/${collection.AuthorID}`}> {collection['User.Username']}</Link></td>
							</tr>
						))}
					</tbody>
				</table>
			}
		</div>
	);
}

export default LargestCollectionList;
