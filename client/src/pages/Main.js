import FreshItems from '../components/FreshItems';
import LargestCollectionList from '../components/LargestCollections';

const Main = () => {

	return (
		<div className="Main container-fluid">
			<h1>Main</h1>
			<FreshItems amount={10} />
			<LargestCollectionList amount={5} />
		</div>
	);
}

export default Main;