import React, { useState, useContext, useEffect } from 'react';
import queryString from 'query-string';
import { useLocation, useHistory } from 'react-router-dom';
import { Range, getTrackBackground } from 'react-range';
import uuid from 'uuid';

import GeneralContext from '../../context/general/generalContext';
const SearchFilters = () => {
	const { products, bundles, filtered, filterResults } = useContext(
		GeneralContext,
	);

	/**
	 * Page Location (query)
	 */
	const location = useLocation();

	/**
	 * Browser history to track filtering
	 */
	const history = useHistory();

	/**
	 * hold search value
	 * @type {string}
	 */
	const { name } = queryString.parse(location.search);

	const [properties, setProperties] = useState({
		categories: [],
		colors: [],
		manufacturers: [],
		prices: {
			products: {
				max: Infinity,
				min: 0,
			},
			bundles: {
				max: Infinity,
				min: 0,
			},
			get total() {
				const max = Math.max(this.products.max, this.bundles.max);
				const min = Math.min(this.products.min, this.bundles.min);
				return { max, min };
			},
		},
	});

	const { categories, colors, manufacturers, prices } = properties;

	const [filters, setFilters] = useState({
		categories: [],
		colors: [],
		manufacturers: [],
		price: [prices.total.min || 0, prices.total.max || Infinity],
	});

	const STEP = 1;
	const MIN = prices.total.min;
	const MAX = prices.total.max;
	// runs for the main search point
	// contains all categories, colors, etc.
	useEffect(() => {
		setProperties({
			...properties,
			categories: [...new Set(filtered.map(product => product.category))],
			colors: [...new Set(filtered.map(product => product.color))],
			manufacturers: [
				...new Set(filtered.map(product => product.manufacturer)),
			],

			prices: {
				products: {
					max: Math.max(...filtered.map(product => product.price)),
					min: Math.min(...filtered.map(product => product.price)),
				},
				bundles: {
					max: Math.max(...bundles.map(bundle => bundle.bill)),
					min: Math.min(...bundles.map(bundle => bundle.bill)),
				},
				get total() {
					const max = Math.max(this.products.max, this.bundles.max);
					const min = Math.min(this.products.min, this.bundles.min);
					return { max, min };
				},
			},
		});
	}, [products, filtered, bundles]);

	// runs whenever filtered products change
	useEffect(() => {
		setFilters({
			...filters,
			price: [prices.total.min, prices.total.max],
		});
	}, [filtered, prices]);

	useEffect(() => {
		// console.log('properties', properties);
		// console.log('filters', filters);
	}, [properties, filters]);

	// Sets the filters checks
	useEffect(() => {
		const categories = queryString.parse(location.search).category
			? queryString.parse(location.search).category.split(',')
			: [];

		const manufacturers = queryString.parse(location.search).manufacturer
			? queryString.parse(location.search).manufacturer.split(',')
			: [];

		setFilters({
			...filters,
			categories,
			manufacturers,
		});
	}, [history.length]);

	/**
	 * Changes filter state according to user action
	 * @param {event} e user action
	 */
	const onCheckboxCheck = e => {
		const { name } = e.target;
		const value = e.target.id;

		setFilters({
			...filters,
			[name]: filters[name].find(f => f === value)
				? filters[name].filter(f => f !== value)
				: [...filters[name], value],
		});
	};

	/**
	 * Filters submission
	 * @param {event} e user click
	 */
	const onFilter = e => {
		filterResults(filters, name);

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

		const maxPrice =
			properties.prices.total.max !== filters.price.max
				? filters.price[1]
				: null;

		const minPrice =
			properties.prices.total.min !== filters.price.min
				? filters.price[0]
				: null;

		const url = `/search?name=${name}
			${categories ? `&category=${categories}` : ''}
			${manufacturers ? `&manufacturer=${manufacturers}` : ''}
			${colors ? `&color=${colors}` : ''}
			${maxPrice ? `&maxPrice=${maxPrice}` : ''}
			${minPrice ? `&minPrice=${minPrice}` : ''}
			`;

		history.replace(url);
	};

	return (
		<section className='tile search-filters'>
			<div className='filter-group'>
				<p>Category</p>
				{categories.map(category => (
					<div key={uuid.v4()} className='filter-option'>
						<input
							className='inp-checkbox'
							type='checkbox'
							name='categories'
							id={category}
							onChange={onCheckboxCheck}
							checked={
								filters.categories.find(cat => cat === category) ? true : false
							}
						/>{' '}
						<label className='checkbox' htmlFor={category}>
							<span>
								<svg width='12px' height='10px' viewBox='0 0 12 10'>
									<polyline points='1.5 6 4.5 9 10.5 1' />
								</svg>
							</span>
							<span>{category}</span>
						</label>
					</div>
				))}
			</div>

			<div className='filter-group'>
				<p>Manufacturer</p>
				{manufacturers.map(manufacturer => (
					<div key={uuid.v4()} className='filter-option'>
						<input
							className='inp-checkbox'
							type='checkbox'
							name='manufacturers'
							id={manufacturer}
							onChange={onCheckboxCheck}
							checked={
								filters.manufacturers.find(manu => manu === manufacturer)
									? true
									: false
							}
						/>{' '}
						<label className='checkbox' htmlFor={manufacturer}>
							<span>
								<svg width='12px' height='10px' viewBox='0 0 12 10'>
									<polyline points='1.5 6 4.5 9 10.5 1' />
								</svg>
							</span>
							<span>{manufacturer}</span>
						</label>
					</div>
				))}
			</div>

			<div className='filter-group'>
				<p>Colors</p>
				{colors.map(color => (
					<div key={uuid.v4()} className='filter-option'>
						<input
							className='inp-checkbox'
							type='checkbox'
							name='colors'
							id={color}
							onChange={onCheckboxCheck}
							checked={filters.colors.find(col => col === color) ? true : false}
						/>{' '}
						<label className='checkbox' htmlFor={color}>
							<span>
								<svg width='12px' height='10px' viewBox='0 0 12 10'>
									<polyline points='1.5 6 4.5 9 10.5 1' />
								</svg>
							</span>
							<span>{color}</span>
						</label>
					</div>
				))}
			</div>

			<div className='filter-group'>
				<p>Price Range</p>

				<div className='range-container'>
					<input
						type='number'
						className='input'
						value={filters.price[0]}
						disabled
					/>
					<input
						type='number'
						className='input'
						value={filters.price[1]}
						disabled
					/>
				</div>

				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						flexWrap: 'wrap',
					}}
				>
					<Range
						values={filters.price}
						step={STEP}
						min={MIN}
						max={MAX}
						onChange={values => {
							// setRange(values);
							setFilters({ ...filters, price: values });
							// console.log('values', values);
						}}
						renderTrack={({ props, children }) => (
							<div
								onMouseDown={props.onMouseDown}
								onTouchStart={props.onTouchStart}
								style={{
									...props.style,
									height: '36px',
									display: 'flex',
									width: '100%',
								}}
							>
								<div
									ref={props.ref}
									style={{
										height: '5px',
										width: '100%',
										borderRadius: '4px',
										background: getTrackBackground({
											values: filters.price,
											colors: ['#ccc', '#548BF4', '#ccc'],
											min: MIN,
											max: MAX,
										}),
										alignSelf: 'center',
									}}
								>
									{children}
								</div>
							</div>
						)}
						renderThumb={({ props, isDragged }) => (
							<div
								{...props}
								style={{
									...props.style,
									height: '15px',
									width: '15px',
									borderRadius: '4px',
									backgroundColor: '#FFF',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									boxShadow: '0px 2px 6px #AAA',
								}}
							></div>
						)}
					/>
				</div>
			</div>
			{/* 
			<div className='filter-group'>
				<p>Price Range</p>
				<label htmlFor='min-price'>Minimum Price</label>
				<input
					className='input'
					type='text'
					disabled
					value={filters.price.min}
				/>
				<input
					type='range'
					name='min-price'
					id='min-price'
					max={filters.price.max}
					min={prices.total.min}
					value={filters.price.min}
					step={1}
					onChange={e =>
						setFilters({
							...filters,
							price: {
								max: filters.price.max,
								min: e.target.value,
							},
						})
					}
				/>
			</div>

			<div className='filter-group'>
				<label htmlFor='min-price'>Maximum Price</label>
				<input
					className='input'
					type='text'
					disabled
					value={filters.price.max}
				/>
				<input
					type='range'
					name='min-price'
					id='min-price'
					max={prices.total.max}
					min={filters.price.min}
					step={1}
					value={filters.price.max}
					onChange={e =>
						setFilters({
							...filters,
							price: {
								min: filters.price.min,
								max: e.target.value,
							},
						})
					}
				/>
			</div> */}

			<button className='btn btn-accent' onClick={onFilter}>
				Filter
			</button>
		</section>
	);
};

export default SearchFilters;
