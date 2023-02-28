import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSignIn } from '../../store/authSlice';

import { Formik, Form } from 'formik';
import FormControl from '../forms/FormControl';
import { signInSchema } from '../forms/schema';

import Button from '../Button';
import ModalWindow from '../ModalWindow';


function AuthPage() {

	let location = useLocation();
	let navigate = useNavigate();
	let [modalWindowIsOpen, setModalWindowIsOpen] = useState(false);

	let dispatch = useDispatch();
	let { token, fetchStatus, fetchError } = useSelector(state => state.auth);

	// getting state in location of AuthPage from RequireAuth: <Navigate to='/auth' state={{from: location}} />
	let fromPage = location.state?.from?.pathname ?? '/';

	let initialValues = {
		email: '',
		password: ''
	};

	let onSubmit = (values, {resetForm, setStatus}) => {
		try {
			dispatch(fetchSignIn(values))
			resetForm()
			setModalWindowIsOpen(!modalWindowIsOpen);
		}
		catch(err) {
			setStatus({
        msg: `Ошибка обработки данных: ${err.message}`
      })
			return err.message;
		}
	}
	
	let toggleModal = () => {
    setModalWindowIsOpen(!modalWindowIsOpen);
		navigate(fromPage, {replace: true});
  };

	return (
		<>
			<div className='form__intro'>
				<p className='form__intro-text'>
					Для доступа к информационным системам
					требуется авторизация.
					<br/>
					<br/>
					Пожалуйста, заполните все поля формы и
					нажмите кнопку &#171;Подвердить&#187;.
				</p>
			</div>
			<div className='form-mobile'>Авторизация</div>
			<Formik
				initialValues = {initialValues}
				validationSchema = {signInSchema}
				onSubmit = {onSubmit}
			>
				{formikProps => {
					let { status, dirty, errors, touched } = formikProps;
					return (
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
							<Button 
								label='Подтвердить'
								disabled={!formikProps.isValid || !dirty}
								className='form__btn'
							/>
						</Form>
						)
					}
				}
			</Formik>
			<ModalWindow
				isOpen={modalWindowIsOpen}
				onRequestClose={toggleModal}
				title = {fetchStatus === 'loading' ? 'Проверка данных...' : fetchStatus === 'resolved' && token ? 'Авторизация прошла успешно' : ''}
				textErr =  {fetchError ? `Ошибка авторизации: ${fetchError} !` : ''}
				onClick = {toggleModal}
			/>
		</>
	)
}

export default AuthPage;