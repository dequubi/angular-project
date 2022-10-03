# Angular project

[Angular CLI](https://github.com/angular/angular-cli) v.14.2.3.

Мини бэкенд на json-server.

Toast-уведомления только на странице просмотра. Всплывают при достижении непосредственно даты _и времени_ окончания элемента.

Локализация выполнена с помощью i18n.

## Запуск

Установка зависимостей

```
npm install
```

Dev-скрипт. Запускает Angular на `http://localhost:4200/`, json-server на `http://localhost:3000/`.

```
npm run dev
```

Dist-скрипт. Запускает содержимое папки `dist` на `http://127.0.0.1:4201/`, json-server на `http://localhost:3000/`.

```
npm run serve-dist
```

## Сборка

```
ng build --localize
```
