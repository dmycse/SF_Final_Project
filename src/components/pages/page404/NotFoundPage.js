import React from 'react';
import { Link } from 'react-router-dom';

import css from './NotFoundPage.module.scss';

function NotFoundPage() {
	return (
		<article className={css.notfoundpage}>
			<h1 className={css.notfoundpage__title}>Ошибка 404</h1>
			<p className={css.notfoundpage__title}>Страница не существует</p>
			<p className={css.notfoundpage__title}>перейти на <Link to='/' className={css.notfoundpage__btn}>Главная</Link></p>
		</article>
	);
}

export default NotFoundPage;