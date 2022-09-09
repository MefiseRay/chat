# figma
https://www.figma.com/proto/giUWbAWAC38jGuzNgVrhcN/YP-Chat?page-id=0%3A1&node-id=13%3A238&viewport=0%2C0%2C1&scaling=scale-down

# Команды заупска
## На релизе
`npm run start` - данная команда соберет проект и запустит express сервер для раздачи статических файлов и роутинга 
страниц
`npm run build` - данная команда соберет проект. Express не стартует.
`npm run start-server` - запуск сервера express для раздачи статических файлов и роутинга страниц
## При разработке
`npm run dev` - дананя команда соберет проект и будет отслеживать его изменения. Также как и в предыдущей команде
запускает express сервер для раздачи статических файлов и роутинга страниц
`npm run watch` - данная команда убдет отслеживать изменения. Express не стартует.
`npm run delete-files-on-linux` - удаление кеша и собранных файлов (только для MacOS и Linux)
`npm run eslint` - Lint тесты для кода
`npm run stylelint` - Lint тесты для стилей