import React, { useReducer } from 'react';
import axios from 'axios';

import GeneralContext from './generalContext';
import generalReducer from './generalReducer';
import {
	SET_LOADING,
	SET_ERROR,
	INITIAL_SEARCH,
	FILTER_RESULTS,
	GET_PRODUCT,
} from '../types';

const GeneralState = props => {
	const initialState = {
		searchResults: [],
		filteredSearchResults: [],
		products: [],
		bundles: [],
		filtered: [],
		product: null,
		bundle: null,
		error: null,
		loading: true,
	};

	const [state, dispatch] = useReducer(generalReducer, initialState);

	/**
	 * Enables loading flag
	 */
	const setLoading = () => {
		dispatch({ type: SET_LOADING });
	};

	/**
	 * Initial search using product or bundle name
	 * @param {string} name product or bundle name
	 */
	const initialSearch = async name => {
		try {
			const response = await axios.get(`/api/search?name=${name}`);
			dispatch({ type: INITIAL_SEARCH, payload: response.data });
		} catch (error) {
			dispatch({ type: SET_ERROR, payload: error });
		}
	};

	/**
	 * Filters the products array in state due to user selected fitlers
	 * @param {array} filters state from search filter component
	 * @param {string} name product or bundle name
	 */
	const filterResults = async (filters, name) => {
		try {
			const categories =
				filters.categories.length > 0
					? encodeURIComponent(filters.categories.join(','))
					: null;

			const manufacturers =
				filters.manufacturers.length > 0
					? encodeURIComponent(filters.manufacturers.join(','))
					: null;

			const colors =
				filters.colors.length > 0
					? encodeURIComponent(filters.colors.join(','))
					: null;

			const url = `/api/search?name=${name}
			${categories ? `&category=${categories}` : ''}
			${manufacturers ? `&manufacturer=${manufacturers}` : ''}
			${colors ? `&color=${colors}` : ''}
			&minPrice=${filters.price[0]}
			&maxPrice=${filters.price[1]}
			`;

			const response = await axios.get(url);
			dispatch({ type: FILTER_RESULTS, payload: response.data });
		} catch (error) {
			dispatch({ type: SET_ERROR, payload: error });
		}
	};

	/**
	 * Gets product by id
	 *
	 * @param {string} id
	 */
	const getProduct = async id => {
		try {
			const response = await axios.get(`/api/products/${id}`);
			dispatch({ type: GET_PRODUCT, payload: response.data });
		} catch (error) {
			dispatch({ type: SET_ERROR, payload: error });
		}
	};

	return (
		<GeneralContext.Provider
			value={{
				searchResults: state.searchResults,
				filteredSearchResults: state.filteredSearchResults,
				products: state.products,
				bundles: state.bundles,
				filtered: state.filtered,
				loading: state.loading,
				product: state.product,
				bundle: state.bundle,

				setLoading,
				initialSearch,
				filterResults,
				getProduct,
			}}
		>
			{props.children}
		</GeneralContext.Provider>
	);
};

export default GeneralState;
