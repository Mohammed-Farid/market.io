import React, { useContext } from 'react';
import { Route, useHistory } from 'react-router-dom';
import StoreNavbar from '../layout/StoreNavbar';

import AuthContext from '../../context/auth/authContext';
import Statistics from '../store/Statistics';
import ProductsTab from '../store/products-tab/ProductsTab';
import BundlesTab from '../store/bundles-tab/BundlesTab';

const Dashboard = ({ match }) => {
	const authContext = useContext(AuthContext);
	const { client, loading } = authContext;
	let history = useHistory();

	if (loading) {
		return <h4>Loading Dashboard...</h4>;
	} else if (!client || client.role !== 'Store') {
		history.push('/');
	}

	return (
		<section className='store-dashboard'>
			<StoreNavbar />
			<div className='body'>
				<Route path={`${match.url}/`} exact component={Statistics} />
				<Route path={`${match.url}/products`} exact component={ProductsTab} />
				<Route path={`${match.url}/bundles`} exact component={BundlesTab} />
			</div>
		</section>
	);
};

export default Dashboard;
