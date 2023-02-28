import React from 'react';
import { Link } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

import css from './Header.module.scss';
import logo from '../../assets/img/bike_icon.png';


function Header() {
	
	let dispatch = useDispatch();
	let { token } = useSelector(state => state.auth);

	return (
		<header className={css.header}>
			<div className={`wrapper ${css.header__wrapper}`}>
				<div className={css.header__logo}>
					<Link to='/'><img src={logo} alt='Логотип' className={css.header__img}/></Link>
				</div>
				<>
					{token ? (
						<ul className={css.header__menu}>
							<li className={css.header__menuItem}><Link to='/theftrecords' className={css.header__link}>Сообщения о кражах</Link></li>
							<li className={css.header__menuItem}><Link to='/employeelist' className={css.header__link}>Сотрудники</Link></li>
							<li className={css.header__menuItem} onClick={() => dispatch(logout())}><Link to='/' className={css.header__link}>Выйти</Link></li>
						</ul>
						) : (
						<ul className={css.header__menu}>
							<li className={css.header__menuItem}><a href="tel:+79992223322" className={css.header__phone}>+7&nbsp;999&nbsp;222&nbsp;33&nbsp;22</a></li>
							<li className={css.header__menuItem}><Link to='/registration' className={css.header__link}>Регистрация</Link></li>
							<li className={css.header__menuItem}><Link to='/auth' className={css.header__link}>Войти</Link></li>
						</ul>
						)
					}
				</>
			</div>
		</header>
	)
}

export default Header;