export default {
  translation: {
    name: 'Hexlet Chat', //
    placeholders: {
      login: 'Ваш ник', //
      username: 'Имя пользователя', //
      password: 'Пароль', //
      passwordConfirmation: 'Подтвердите пароль', //
      newMessage: 'Введите сообщение ...', //
    },
    entry: 'Войти', //
    exit: 'Выйти', //
    register: 'Зарегистрироваться', //
    registration: 'Регистрация', //
    noAccount: 'Нет аккаунта?', //
    pageNotFound: 'Страница не найдена', //
    redirect: 'Но вы можете перейти ', //
    mainPage: 'на главную страницу', //
    channelsTitle: 'Каналы', //
    messagesCounter: {
      messages_one: '{{count}} сообщение', //
      messages_few: '{{count}} сообщения', //
      messages_many: '{{count}} сообщений', //
    },
    newMessage: 'Новое сообщение', //
    send: 'Отправить', //
    cancel: 'Отменить', //
    modal: {
      add: 'Добавить канал', //
      unique: 'Должно быть уникальным', //
      lengthParams: 'От 3 до 20 символов', //
      remove: 'Удалить', //
      removeChannel: 'Удалить канал', //
      confirm: 'Уверены?', //
      canalName: 'Имя канала', //
    },
    registrationRules: {
      name: 'От 3 до 20 символов', //
      password: 'Не менее 6 символов', //
      passwordEquality: 'Пароли должны совпадать', //
    },
    errors: {
      invalidFeedback: 'Неверные имя пользователя или пароль', //
      userExist: 'Такой пользователь уже существует',
      required: 'Обязательное поле', //
      network: 'Ошибка соединения',
      message: 'Ошибка добавления сообщения',
      channelAdd: 'Ошибка добавления канала',
      channelRemove: 'Ошибка удаления канала',
      channelRename: 'Ошибка переименования канала',
    },
    success: {
      newChannel: 'Канал создан', //
      removeChannel: 'Канал удалён', //
      renameChannel: 'Канал переименован', //
    },
  },
};