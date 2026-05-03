# GigaChat Chat App

Итоговая версия учебного чат-приложения на React + TypeScript с интеграцией GigaChat API.

## Возможности

- чат с сообщениями пользователя и ассистента в хронологическом порядке;
- streaming-ответы GigaChat через SSE;
- markdown-рендеринг ответов и подсветка блоков кода;
- typing indicator, автоскролл к последнему сообщению;
- копирование ответов ассистента в буфер обмена;
- остановка генерации через `AbortController`;
- sidebar со списком чатов;
- создание, переключение, переименование и удаление чатов;
- поиск по названию чата и содержимому сообщений;
- сохранение истории и настроек в `localStorage`;
- настройки модели: `model`, `temperature`, `top_p`, `max_tokens`, `repetition_penalty`, system prompt, streaming;
- светлая и тёмная темы через CSS-переменные.

## Переменные окружения

Создайте файл `.env` в корне проекта:

```env
CLIENT_ID=ваш-rquid-или-client-id
SCOPE=GIGACHAT_API_PERS
AUTHORIZATION_KEY=ваш-base64-authorization-key
```

Опционально:

```env
GIGACHAT_REJECT_UNAUTHORIZED=true
```

По умолчанию локальный proxy отключает строгую TLS-проверку для Node.js, потому что у GigaChat в некоторых окружениях цепочка сертификатов вызывает `SELF_SIGNED_CERT_IN_CHAIN`.

## Установка

```bash
npm install
```

## Запуск в разработке

Нужно запустить два процесса.

Терминал 1 — локальный proxy к GigaChat API:

```bash
npm run server
```

Терминал 2 — React-приложение:

```bash
npm start
```

Откройте:

[http://localhost:3000](http://localhost:3000)

React dev server проксирует запросы `/api/*` на `http://localhost:3001`.

## Production-запуск

```bash
npm run build
npm run server
```

После этого приложение будет доступно на:

[http://localhost:3001](http://localhost:3001)

## Проверки

```bash
npm test -- --watchAll=false
npm run build
```

## API-слой

Клиент не хранит секреты GigaChat. React отправляет запросы на локальный endpoint:

```text
POST /api/chat/completions
GET /api/models
```

Node proxy:

- получает access token через `POST https://ngw.devices.sberbank.ru:9443/api/v2/oauth`;
- кеширует токен до истечения срока действия;
- отправляет запросы в `POST https://gigachat.devices.sberbank.ru/api/v1/chat/completions`;
- передаёт контекст диалога в формате `system/user/assistant`;
- проксирует streaming SSE-ответ в браузер.

## Пример работы

1. Нажмите `Новый чат`.
2. Напишите сообщение и нажмите Enter или кнопку `Отправить`.
3. Во время ответа появится индикатор загрузки.
4. Ответ GigaChat будет появляться постепенно.
5. Кнопка `Стоп` прерывает генерацию.
6. У ответа ассистента можно нажать `Копировать`.
7. Название нового чата создаётся автоматически по первому сообщению.
