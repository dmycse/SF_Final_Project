import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { fetchAddEmployee } from '../../store/employeeSlice';

import { Formik, Form } from 'formik';
import FormControl from '../forms/FormControl';
import { newEemployeeSchema } from '../forms/schema';

import Button from '../Button';
import ModalWindow from '../ModalWindow';


function EmployeeRegistration() {

	let navigate = useNavigate();

	let dispatch = useDispatch();
	let {fetchStatus, fetchError} = useSelector(state => state.employeeList);

	let [modalWindowIsOpen, setModalWindowIsOpen] = useState(false);

	let initialValues = {
		email: '',
		password: '',
		firstName: '',
		lastName: '',
	};

	let onSubmit = (values, {resetForm, setStatus}) => {
		try {
			dispatch(fetchAddEmployee(values));
			resetForm();
			setModalWindowIsOpen(!modalWindowIsOpen)
		}
		catch(error) {
			setStatus({
        msg: `Ошибка обработки данных: ${error.message}!`
      })
		}
	};
	
	let toggleModal= () => {
    setModalWindowIsOpen(!modalWindowIsOpen);
		navigate('/employeelist');
  };

	return (
		<>
			<div className='form__intro'>
				<p className='form__intro-text'>
					Для внесения нового сотрудника 
					<br/>
					в БД необходимо заполнить форму.
					<br/>
					<br/>
					Пожалуйста, заполните все поля формы и
					<br/> 
					нажмите кнопку &#171;Подвердить&#187;.
				</p>
			</div>
			<div className='form-mobile'>Регистрация сотрудника</div>
			<Formik
				initialValues = {initialValues}
				validationSchema = {newEemployeeSchema}
				onSubmit = {onSubmit}
			>
				{({isSubmitting, handleReset, status, dirty, errors, touched}) => (
					<Form className='form'>
						{status && status.msg && <p style={{color: "#fff"}}>{status.msg}</p>}
						<FormControl 
							control='input' 
							type='email' 
							name='email' 
							label='Email'
							errors={errors}
							touched={touched} 
						/>
						<FormControl 
							control='input' 
							type='password' 
							name='password' 
							label='Пароль'
							errors={errors}
							touched={touched} 
						/>
						<FormControl 
							control='input' 
							name='firstName' 
							label='Имя'
							errors={errors}
							touched={touched} 
						/>
						<FormControl
							control='input'
							name='lastName'
							label='Фамилия'
							errors={errors}
							touched={touched}
						/>
						<div className='form__buttons'>
							<Button 
								type='button'
								label='Очистить'
								disabled={isSubmitting || !dirty}
								className='form__btn'
								onClick={handleReset}
							/>
							<Button
								label='Подтвердить' 
								disabled={isSubmitting || !dirty}
								className='form__btn'
							/>
						</div>
					</Form>
					)
				}
			</Formik>
			<ModalWindow
				isOpen={modalWindowIsOpen}
				onRequestClose={toggleModal}
				title = {fetchStatus === 'loading' ? 'Обновление данных...' : fetchStatus === 'resolved' ? 'Данные нового сотрудника сохранены' : ''}
				textErr =  {fetchError ? `Ошибка: ${fetchError} !` : ''}
				onClick = {toggleModal}
			/>		
		</>
	)
}

export default EmployeeRegistration;