const API_BASE_URL = 'https://collectionproject.com';

const ROUTES = {
	auth: {
		login: '/auth/login',
		signup: '/auth/signup',
	},
	admin: {
		collectionsItems: '/admin/collections/:id/items',
		users: '/admin/users',
		user: '/admin/users/:userId',
		blockUser: '/admin/users/:userId/block',
		unblockUser: '/admin/users/:userId/unblock',
		addAdmin: '/admin/users/:userId/addAdmin',
		removeAdmin: '/admin/users/:userId/removeAdmin',
		deleteUser: '/admin/users/:userId',
	},
	collections: {
		biggest: '/collections/biggest',
		base: '/collections',
		single: '/collections/:collectionID',
		userCollections: '/collections/users-collection/:userID',
	},
	items: {
		base: '/allItems',
		inCollection: '/collections/:collectionID/items',
		single: '/collections/:collectionID/items/:itemID',
	}
};

const CONFIG = {
	apiBaseUrl: API_BASE_URL,
	routes: ROUTES,
};

export default CONFIG;