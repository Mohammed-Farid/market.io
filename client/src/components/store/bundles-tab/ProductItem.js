import React, { useContext } from 'react';
import StoreContext from '../../../context/store/storeContext';

const ProductItem = ({ item: { discount, product } }) => {
	const { setProduct, bundle, removeProduct } = useContext(StoreContext);
	return (
		<li className='tile product-item'>
			<img
				className='product-image'
				src={`data:image/jpeg;base64,${Buffer.from(product.image.data).toString(
					'base64',
				)}`}
			/>
			<div className='info'>
				<span className='product-name'>
					{product.name} ({discount}%)
				</span>
				<span>
					<span className='original-price'>${product.price}</span> $
					{product.price * (1 - discount / 100)}
				</span>
			</div>
			<button
				className='btn btn-primary btn-circle-sm'
				onClick={e => setProduct(product)}
			>
				<i className='fas fa-pen fa-sm'></i>
			</button>
			<button
				className='btn btn-outlined btn-danger-border btn-circle-sm'
				onClick={e => removeProduct(bundle, product)}
			>
				<i className='fas fa-trash fa-sm'></i>
			</button>
		</li>
	);
};

export default ProductItem;
