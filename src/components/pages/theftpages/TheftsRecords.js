import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { fetchTheftRecords, fetchTheftRemove, status, bikeType, bikeColor } from '../../store/theftSlice';

import { Formik, Form } from 'formik';
import FormControl from '../forms/FormControl';

import css from './TheftStyles.module.scss';


let handleEnterPress = (e) => {
	if (e.key  === 'Enter') {  
		e.preventDefault();
		return false;
	}
};


function TheftsRecords() {
	let navigate = useNavigate();
	let location = useLocation();

	let dispatch = useDispatch();
	let { theftCase, fetchStatus, fetchError } = useSelector(state => state.theftRecords);
	let employees = useSelector(state => state.employeeList.employees);
	let approvedEmployee = employees.filter(employee => employee.approved);

	let activeTheftCases = theftCase.filter(item => item.status !== 'done')

	let [statusFilter, setStatusFilter] = useState('');

	let printFullName = (id) => {
		let officer = employees.find(employee => employee._id === id);
		let officerFullName = `${officer.lastName} ${officer.firstName}`;
		return officerFullName;
	};

	let printFieldName = (value, name) => {
		let chossedKey =  name.find(item => item.value === value);
		return chossedKey.key;
	};

	let handleRemove = (e, id) => {
		e.stopPropagation();
			dispatch(fetchTheftRemove(id));
	};

	let goTo = () => navigate('/', {state: location});

	useEffect(() => {
		dispatch(fetchTheftRecords())
	}, [dispatch]);

	return (
		<div className={css.theftrecords}>
			<div className={css.theftrecords__title_container}>
				<h1 className={css.theftrecords__title}>Сообщения о кражах</h1>
				<div className={css.theftrecords__info}>
					Активных сообщений о кражах: <span className={css.theftrecords__info_bold}>{activeTheftCases.length}</span>
				</div>
			</div>
			<button type='button' onClick={goTo} className={css.theftrecords__btn}>Coздать сообщение о краже</button>
			{fetchError && <h3 className={css.theftrecords__msgErr}>Ошибка загрузки данных: {fetchError} !</h3>}
			{fetchStatus === 'loading' ? <h3 className={css.theftrecords__msg}>Загрузка данных...</h3> : (theftCase.length < 1 ? <h3 className={css.theftrecords__msg}>Сообщений о кражах нет</h3> : 
			<> 
				<Formik>
					{() => (
						<Form className={css.theftrecords__search}>
							<FormControl 
								control='select' 
								name='status' 
								options={status} 
								label='Найти по статусу: ' 
								onChange={e => setStatusFilter(e.target.value)}
								onKeyPress={handleEnterPress}
								errors={''}
								touched={''} 
							/>
						</Form>
						)	
					}
				</Formik>
				<div className='table__container'>
					<table className='table'>
						<thead className='table__head'>
							<tr>
								<th className='table__th table__th_mobile'>Статус</th>
								<th className='table__th'>Лицензия</th>
								<th className='table__th table__th_tablet'>Арендатор</th>
								<th className='table__th table__th_mobile'>Тип</th>
								<th className='table__th table__th_tablet'>Цвет</th>
								<th className='table__th'>Дата кражи</th>
								<th className='table__th table__th_tablet'>Сотрудник</th>
								<th className='table__th'>Удалить</th>
							</tr>
						</thead>
						<tbody className='table__body'>
							{theftCase
								.filter(elem => (statusFilter === '') ? elem : elem.status === statusFilter)
								.map(item => (
									<tr key={item._id} onClick={() => navigate(`/theftrecords/${item._id}`)} className={`table__body_tr ${item.status === 'done' && 'table__body_done'}`}>
										<td className='table__td table__td_txt table__td_mobile'>{item.status ? printFieldName(item.status, status) : 'не определён'}</td>
										<td className='table__td table__td_txt'>{item.licenseNumber}</td>
										<td className='table__td table__td_tablet'>{item.ownerFullName}</td>
										<td className='table__td table__td_txt table__td_mobile'>{item.type ? printFieldName(item.type, bikeType) : 'не выбран'}</td>
										<td className='table__td table__td_txt table__td_tablet'>{item.color ? printFieldName(item.color, bikeColor) : 'нет данных'}</td>
										<td className='table__td table__td_txt'>{new Date(item.date).toLocaleDateString()}</td>
										<td className='table__td table__td_txt table__td_tablet'>{approvedEmployee.find(elem => elem._id === item.officer) ? printFullName(item.officer) : 'не назначен'}</td>
										<td className='table__td table__td_btn'>
											<button type='button' onClick={(e) => handleRemove(e, item._id)} className='table__btn'>Удалить</button>
										</td>
									</tr>
								))}
							</tbody>
					</table>
				</div>
			</>
			)}
		</div>
	)
}

export default TheftsRecords;