import { useState, useEffect } from 'react';
import axios from 'axios';
import CONFIG from '../config';

const FreshItems = ({ amount }) => {
	const [isLoading, setIsLoading] = useState(true);

	const [items, setItems] = useState(null);
	useEffect(() => {
		axios.get(`${CONFIG.apiBaseUrl}${CONFIG.routes.items.base}`)
			.then((response) => {
				setItems(response.data);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error('Error fetching data: ', error);
				setIsLoading(false);
			});
	}, []);

	if (amount === 0 || !items) {
		return <p>No item to display.</p>;
	}
	let firstItems = isLoading ? [] : items.slice(0, amount || items.length);

	return (
		<div className="item-table mt-3">
			<h2>The newest {amount} items</h2>
			{isLoading ? <div>Loading items...</div> :
				<table className="table table-striped table-hover">
					<thead>
						<tr>
							<th>Title</th>
							<th>Collection Title</th>
							<th>Author</th>
						</tr>
					</thead>
					<tbody>
						{firstItems.map((item) => (
							<tr key={item.ItemID}>
								<td>{item.Title}</td>
								<td>{item.Collection.Title}</td>
								<td>{item.Collection.User.Username}</td>
							</tr>
						))}
					</tbody>
				</table>
			}
		</div>
	);
}

export default FreshItems;