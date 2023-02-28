import React from 'react';
import css from './Footer.module.scss';

function Footer() {
	return (
		<footer className={css.footer}>
			<div className={`wrapper ${css.footer__wrapper}`}>
				<div className={css.footer__copiright}>©2023. Bike Rent & Service</div>
				<div><a href='mailto:info@bikerent.ru' target='_blank' className={css.footer__link}>info@bike.rent</a></div>	
			</div>
		</footer>
	)
}

export default Footer;