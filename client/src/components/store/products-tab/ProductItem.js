import React, { useContext } from 'react';
import ProductContext from '../../../context/product/productContext';

const ProductItem = ({ product }) => {
  const productContext = useContext(ProductContext);
  const { image, name, amount, price, discount } = product;
  const { setCurrent, deleteProduct } = productContext;

  const editProduct = () => {
    setCurrent(product);
  };

  const onDelete = () => {
    deleteProduct(product);
  };

  return (
    <li className='tile product-item'>
      <div className='field'>
        {image ? (
          <img
            className='product-image'
            src={`data:image/jpeg;base64,${Buffer.from(image.data).toString(
              'base64'
            )}`}
            alt={`${name}`}
          />
        ) : (
          <p className='product-image'>No Image for this product</p>
        )}
      </div>

      <div className='field'>
        <p>{name}</p>
      </div>
      <div className='field'>
        <p>{amount}</p>
      </div>
      <div className='field'>
        <p>${price}</p>
      </div>
      <div className='field'>
        <p>{discount}%</p>
      </div>
      <div className='field'>
        <button className='btn btn-primary' onClick={editProduct}>
          <i class='fas fa-pencil-alt'></i>
        </button>
      </div>
      <div className='field'>
        <button
          className='btn btn-outlined btn-danger-border'
          onClick={onDelete}
        >
          <i class='fas fa-trash-alt'></i>
        </button>
      </div>
    </li>
  );
};

export default ProductItem;
