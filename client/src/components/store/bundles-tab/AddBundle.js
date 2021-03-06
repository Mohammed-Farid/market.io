import React, { Fragment, useContext, useState, useEffect } from 'react';
import useForm from 'react-hook-form';
import StoreContext from '../../../context/store/storeContext';

const AddBundle = () => {
	const { register, handleSubmit, errors, setValue } = useForm();

	const { clearBundle, addBundle, updateBundle, bundle } = useContext(
		StoreContext,
	);

	useEffect(() => {
		setValue('_id', bundle ? bundle._id : undefined);
		setValue('name', bundle ? bundle.name : '');
	}, [bundle]);

	const onSubmit = data => {
		if (bundle) {
			updateBundle({ _id: bundle._id, ...data });
		} else {
			addBundle(data);
		}
	};

	const onClear = e => {
		e.preventDefault();
		clearBundle();
	};

	return (
		<section className='tile add-bundle'>
			<h3>Add Bundle</h3>
			<button
				className={`btn ${!!!bundle ? 'btn-disabled' : 'btn-accent'}`}
				disabled={!!!bundle}
				onClick={onClear}
			>
				Clear
			</button>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='form-group'>
					<input
						className='input'
						name='name'
						id='name'
						placeholder='Name'
						ref={register({ required: true })}
					/>
					{errors.category && errors.category.type === 'required' && (
						<small>Category is required</small>
					)}
				</div>

				<button type='submit' className='btn btn-primary'>
					{bundle ? 'Edit Bundle' : 'Add Bundle'}
				</button>
			</form>
		</section>
	);
};

export default AddBundle;
