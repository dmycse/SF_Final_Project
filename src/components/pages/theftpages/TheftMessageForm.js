import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { fetchAddTheftCase, fetchNewTheftCase, bikeType, bikeColor } from '../../store/theftSlice';
import { fetchEmployeeList } from '../../store/employeeSlice';

import { Formik, Form } from 'formik';
import FormControl from '../forms/FormControl';
import { theftMessageSchema } from '../forms/schema';

import Button from '../Button';
import ModalWindow from '../ModalWindow';

import css from './TheftStyles.module.scss';


function TheftMessageForm() {
	let location = useLocation();
	let navigate = useNavigate();

	let dispatch = useDispatch();
	let { token } = useSelector(state => state.auth);
	let {fetchStatus, fetchError} = useSelector(state => state.theftRecords);
	let approvedEmployee = useSelector(state => state.employeeList.employees).filter(employee => employee.approved);

	let [modalWindowIsOpen, setModalWindowIsOpen] = useState(false);
	
	let officerList = [{key: 'Выберите из списка', value: ''}, ...approvedEmployee.map(employee => (
		{key: `${employee.lastName} ${employee.firstName}`, value: employee._id}))];

	let initialValues = {
		licenseNumber: '',
		ownerFullName: '',
		type: '',
		color: '',
		date: null,
		description: '',
		officer: ''
	};

	let onSubmit = (values, {resetForm, setStatus}) => {
		try {
			token ? dispatch(fetchAddTheftCase(values)) : dispatch(fetchNewTheftCase(values));
			resetForm();
			setModalWindowIsOpen(!modalWindowIsOpen);
		}
		catch(error) {
			setStatus({
				msg: `Ошибка обработки данных ${error.message}!`
			})
		}
	};

	let goBack = () => navigate(location.state?.pathname ?? '/');

	let toggleModal= () => {
    setModalWindowIsOpen(!modalWindowIsOpen);
		goBack();
  };

	useEffect(() => {
		if(token){
			dispatch(fetchEmployeeList())
		}
	},[]);


	return (
		<>
			<div className={`form__intro ${css.theft__intro}`}>
				<p className='form__intro-text'>
					Мы делаем всё необходимое, чтобы Вы
					могли пользоваться современными и
					исправными велосипедами.
					<br/>
					И такие велосипеды у Вас могут украсть.
					<br/>
					<br/>
					Для скорейшего поиска украденного велосипеда,
					пожалуйста, заполните форму и нажмите кнопку &#171;Отправить&#187;.
				</p>
			</div>
			<div className={`form-mobile ${css.theft__tablet}`}>Сообщение о краже</div>
			<Formik
				initialValues = {initialValues}
				validationSchema = {theftMessageSchema}
				onSubmit = {onSubmit}
				enableReinitialize
			>
			{formikProps => {
				let { isSubmitting, status, dirty, handleReset, errors, touched } = formikProps;
				return (
					<Form className={`form ${css.theft__form}`}>
						{status && status.msg && <p style={{color: "#fff"}}>{status.msg}</p>}
						<div className={css.theft__block}>
							<FormControl
								control='input'
								name='licenseNumber'
								label='Номер лицензии'
								errors={errors}
								touched={touched}
							/>
							<div className='data_reg'>
								<FormControl
									control='date'
									name='date'
									label='Дата кражи'
									maxDate={new Date()}
									placeholderText='Выберите дату'
									errors={errors}
									touched={touched}
								/>
							</div>
						</div>
						<FormControl
							control='input'
							name='ownerFullName'
							label='ФИО арендатора'
							errors={errors}
							touched={touched}
						/>
						<div className={css.theft__block}>
							<FormControl
								control='select'
								type='select'
								name='type'
								options={bikeType}
								label='Тип велосипеда'
								errors={errors}
								touched={touched}
							/>
							<FormControl
								control='select'
								type='select'
								name='color'
								options={bikeColor}
								label='Цвет велосипеда'
								errors={errors}
								touched={touched}
							/>
						</div>
						<FormControl
							control='textarea'
							name='description'
							label='Дополнительная информация'
							placeholder=''
							errors={''}
							touched={''}
						/>
						{token ? 
							<FormControl
								control='select'
								type='select'
								name='officer'
								options={officerList}
								label='Ответственный сотрудник'
								errors={errors}
								touched={touched}
							/> : ''
						}
						<div className='form__buttons'>
							<Button 
								type='button'
								label='Очистить' 
								disabled={isSubmitting || !dirty} 
								onClick={handleReset}
								className='form__btn'
							/>
							<Button 
								label='Отправить'
								disabled={isSubmitting || !dirty}
								className='form__btn'
							/>
						</div>
					</Form>
					)
				}
			}
			</Formik>
			<ModalWindow
				isOpen={modalWindowIsOpen}
				onRequestClose={toggleModal}
				title = {fetchStatus === 'loading' ? 'Отправка данных...' : fetchStatus === 'resolved' ? 'Сообщение о краже отправлено' : ''}
				text = {fetchStatus === 'resolved' ? 'Спасибо за Ваше сообщение!' : ''}
				textErr =  {fetchError ? `Ошибка: ${fetchError} !` : ''}
				onClick = {toggleModal}
			/>		
		</>
	)
}

export default TheftMessageForm;