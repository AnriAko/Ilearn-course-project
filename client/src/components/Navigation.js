import { Link } from 'react-router-dom';

const Navigation = ({ searchQuery, setSearchQuery, handleSearch }) => {
	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<div className="container-fluid">
				<Link to="/" className="navbar-brand">Main</Link>
				<div className="d-flex justify-content-center flex-grow-1">
					<form className="d-flex" onSubmit={handleSearch}>
						<input
							className="form-control me-2"
							type="search"
							placeholder="Search"
							aria-label="Search"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						<button className="btn btn-outline-success" type="submit">Search</button>
					</form>
				</div>
				<div>
					<ul className="navbar-nav mb-2 mb-lg-0">
						<li className="nav-item">
							<Link to="/login" className="nav-link">Log in</Link>
						</li>
						<li className="nav-item">
							<Link to="/signup" className="nav-link">Sign up</Link>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Navigation;