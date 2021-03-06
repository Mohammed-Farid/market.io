import React, { useContext } from 'react';
import numeral from 'numeral';
import StoreContext from '../../../context/store/storeContext';

const ProductItem = ({ product }) => {
	const { setProduct, bundle, removeProduct } = useContext(StoreContext);
	return (
		<li className='tile product-item'>
			<img
				className='product-image'
				src={`data:image/jpeg;base64,${product.image}`}
			/>
			<div className='info'>
				<span className='product-name'>
					{product.name} ({product.discount}%)
				</span>
				<span className='product-prices'>
					<span className='original-price'>${product.price}</span>
					<span>
						{numeral(product.price * (1 - product.discount / 100)).format(
							'0,0[.]00 $',
						)}
					</span>
					<span className='text-red-600'>
						{numeral(
							product.price - product.price * (1 - product.discount / 100),
						).format('0,0[.]00 $')}
					</span>
				</span>
			</div>
			<button
				className='btn btn-primary btn-circle-sm'
				onClick={e => setProduct(product)}
			>
				<i className='fas fa-pen'></i>
			</button>
			<button
				className='btn btn-outlined btn-danger-border btn-circle-sm'
				onClick={e => removeProduct(bundle, product)}
			>
				<i className='fas fa-trash'></i>
			</button>
		</li>
	);
};

export default ProductItem;
