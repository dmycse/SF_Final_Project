import React, { useState } from 'react';
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { fetchChangeDetails } from '../../store/employeeSlice';

import { Formik, Form } from 'formik';
import FormControl from '../../pages/forms/FormControl';
import { employeeDetailsSchema } from '../../pages/forms/schema';

import Button from '../Button';
import ModalWindow from '../ModalWindow';

import css from './Employee.module.scss';


function EmployeeDetails() {

	let navigate = useNavigate();
	let {_id} = useParams();
	
	let dispatch = useDispatch();
	let {employees, fetchStatus, fetchError} = useSelector(state => state.employeeList);
	let savedValues = employees.find(employee => employee._id === _id);

	let [passwordVisible, setPasswordVisible] = useState(false);
	let [modalWindowIsOpen, setModalWindowIsOpen] = useState(false);

	let showPassword = () => {
		setPasswordVisible(passwordVisible = !passwordVisible)
	};

	let toggleModal= () => {
    setModalWindowIsOpen(!modalWindowIsOpen);
		navigate('/employeelist');
  };
	
	let onSubmit = (values, {setSubmitting, setStatus}) => {
		try {
			dispatch(fetchChangeDetails(values));
			setSubmitting(false);
			setModalWindowIsOpen(!modalWindowIsOpen);
		}
		catch(error) {
			setStatus({
        msg: `Ошибка обработки данных: ${error.message}!`
      })
			return error.message;
		}
	};

	if(!savedValues) {
		return <Navigate to='/*' />
	}

	return (
		<section className={css.employeedetails}>
			<h1 className={css.employeedetails__title}>Информация о сотруднике</h1>
			{/* don't use fetchStatus and fetchError here as getting data from store, not from server
			{fetchStatus === 'loading' && <h3 className={css.employeedetails__msg}>Загрузка данных...</h3>}
			{fetchError && <h3 className={css.employeedetails__msgErr}>Ошибка загрузки данных: {fetchError} !</h3>} */}
			<Formik
				initialValues = {savedValues}
				validationSchema = {employeeDetailsSchema}
				onSubmit = {onSubmit}
				enableReinitialize
			>
			{({values, isSubmitting, status, dirty, errors, touched}) => {
				return (
					<Form>
						{status && status.msg && <h3>{status.msg}</h3>}
						<table>
							<tbody>
								<tr>
									<td className={css.employeedetails__detail}>ID:</td>
									<td>
										<FormControl 
											control='input' 
											name='_id'
											errors={''}
											touched={''} 
											disabled
										/>
									</td>
								</tr>
								<tr>
									<td className={css.employeedetails__detail}>Фамилия:</td>
									<td>
										<FormControl 
										control='input' 
										name='lastName'
										errors={errors}
										touched={touched} 
										/>
									</td>
								</tr>
								<tr>
									<td className={css.employeedetails__detail}>Имя:</td>
									<td>
										<FormControl 
											control='input' 
											name='firstName'
											errors={errors}
											touched={touched} 
										/>
									</td>
								</tr>
								<tr>
									<td className={css.employeedetails__detail}>Email:</td>
									<td>
										<FormControl 
											control='input' 
											type='email' 
											name='email'
											errors={''}
											touched={''} 
											disabled
										/>
										</td>
								</tr>
								<tr>
									<td className={css.employeedetails__detail}>Пароль:</td>
									<td>
										<FormControl 
											control='input' 
											type={passwordVisible ? 'text' : 'password'} 
											name='password'
											errors={''}
											touched={''}
											disabled 
										/>
										<Button
											type='button'
											label='&#128065;'
											onClick={showPassword}
											className={css.employeedetails__btnpass} 
											disabled
										/>
									</td>
								</tr>
								<tr>
									<td className={css.employeedetails__detail}>ClientID:</td>
									<td>
										<FormControl 
											control='input' 
											name='clientId'
											errors={''}
											touched={''} 
											disabled 
										/>
									</td>		
								</tr>
								<tr>
									<td className={css.employeedetails__detail}>Одобрен: </td>
									<td>
										<FormControl 
											control='checkbox' 
											name='approved' 
											label={values.approved ? 'Да' : 'Нет'} 
										/>
									</td>
								</tr>
							</tbody>
						</table>
						<Button
							label='Cохранить изменения'
							disabled={isSubmitting || !dirty}
							className={`form__btn ${css.employeedetails__btn}`}
						/>
						<Link to='/employeelist' className={`form__btn ${css.employeedetails__btn}`}>Закрыть</Link>
					</Form>
					)
				}
			}
			</Formik>
			<ModalWindow
				isOpen={modalWindowIsOpen}
				onRequestClose={toggleModal}
				title = {fetchStatus === 'loading' ? 'Обновление данных...' : fetchStatus === 'resolved' ? 'Данные обновлены' : ''}
				textErr =  {fetchError ? `Ошибка: ${fetchError} !` : ''}
				onClick = {toggleModal}
			/>
		</section>		
	)
}

export default EmployeeDetails;