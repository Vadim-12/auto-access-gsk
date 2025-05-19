export enum SIGN_UP_ERROR {
	NOT_VALID_PHONE_NUMBER_LENGTH = 'Номер телефона должен состоять из 11 цифр',
	PHONE_NUMBER_ALREADY_EXISTS = 'Пользователь с таким номером телефона уже зарегистрирован',
	PASSWORD_LENGTH_MIN = 'Пароль должен состоять минимум из 6 символов',
	PASSWORDS_DO_NOT_MATCH = 'Пароли не совпадают',
	EMPTY_FIRST_NAME = 'Вы забыли ввести имя',
	EMPTY_LAST_NAME = 'Вы забыли ввести фамилию',
}

export enum SIGN_IN_ERROR {
	NOT_VALID_PHONE_NUMBER_LENGTH = 'Номер телефона должен состоять из 11 цифр',
	PHONE_NUMBER_NOT_FOUND = 'Пользователь с таким номером телефона не найден',
	EMPTY_PASSWORD = 'Вы забыли ввести пароль',
	INVALID_PASSWORD = 'Неверный пароль',
}
