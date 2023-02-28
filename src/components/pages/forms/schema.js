import * as Yup from 'yup';

export let signUpSchema = Yup.object({
	email: Yup.string()
						.email('Недействительный email-формат')
						.required('Должно быть заполнено'),
	password: Yup.string()
							.min(4, 'Минимум 4 символа')
							.required('Должно быть заполнено'),
	clientId: Yup.string(),
	firstName: Yup.string(),
	lastName: Yup.string(),
	approved: Yup.boolean()
});


export let signInSchema = Yup.object({
	email: Yup.string()
					.email('Недействительный формат email')
					.required('Должно быть заполнено'),
	password: Yup.string()
							.min(4, 'Пароль слишком короткий')
							.required('Должно быть заполнено'),
});


export let newEemployeeSchema = Yup.object({
	email: Yup.string()
						.email('Недействительный email-формат')
						.required('Должно быть заполнено'),
	password: Yup.string()
							.min(4, 'Минимум 4 символа')
							.required('Должно быть заполнено'),
	firstName: Yup.string(),
	lastName: Yup.string(),
	approved: Yup.boolean()
});


export let employeeDetailsSchema = Yup.object({
	password: Yup.string()
						.min(4, 'Минимум 4 символа')
						.required('Должно быть заполнено'), 
	firstName: Yup.string()
					.typeError('Должно быть строкой')
					.min(2, 'Введённое имя слишком мало')
					.required('Должно быть заполнено'), 
	lastName: Yup.string()
					.min(2, 'Введённая фамилия слишком мала')
					.required('Должно быть заполнено'),
	approved: Yup.boolean()	
});


export let theftMessageSchema = Yup.object({
	licenseNumber: Yup.string().required('Должно быть заполнено'),
	ownerFullName: Yup.string()
									.min(6, 'Введённое ФИО слишком мало')
									.required('Должно быть заполнено'),
	type: Yup.string().required('Выберите модель'),								
	color: Yup.string().nullable(),
	date: Yup.date()
					.nullable()
					.required('Выберите дату'),
	officer: Yup.string(),				
	description: Yup.string().nullable()
});


export let theftRecordSchema = Yup.object({
	// id: Yup.string(),
	status:  Yup.string().required('Выберите статус'),
	licenseNumber: Yup.string().required('Должно быть заполнено'),
	type: Yup.string().required('Выберите тип'),
	ownerFullName: Yup.string()
									.min(6, 'Введённое ФИО слишком мало')	
									.required('Должно быть заполнено'),
	clientId: Yup.string(),
	createdAt: Yup.date().nullable(),
	updatedAt: Yup.date().nullable(),
	color: Yup.string().nullable(),
	date: Yup.date(),
	newTheftDate: Yup.date().nullable(),
	description: Yup.string().nullable(),
	resolution: Yup.string()
								.nullable()
								.when('status', {
									is: 'done',
									then: Yup.string().nullable().required('Напишите комментарий')
								}),
	officer: Yup.string().nullable()
});