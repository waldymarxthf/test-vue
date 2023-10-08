# Канбан-система управления продуктами на Vue 3

Этот проект представляет собой канбан-систему для управления продуктами. Проект разработан с использованием следующих технологий и инструментов:

[Демо проекта](https://test-vue-waldymarxthf.vercel.app/)

- [Vue 3](https://v3.vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Ant Design Vue](https://2x.antdv.com/docs/vue/introduce/)
- [VueDraggable](https://github.com/SortableJS/Vue.Draggable)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Sass](https://sass-lang.com/)
- [pnpm](https://pnpm.io/)

![image](https://github.com/waldymarxthf/test-vue/assets/56730796/938c3b07-f7a9-4e05-9336-61ce6642c3bc)


## Особенности проекта

1. **Загрузка данных продуктов**: Данные продуктов загружаются из [Fake Store API](https://fakestoreapi.com) при помощи fetch.
2. **Отображение данных продукта**: Все данные продукта, включая изображения, отображаются на карточке продукта.
3. **Управление карточками продукта**: Пользователи могут создавать новые карточки продукта, удалять и редактировать существующие карточки.
4. **Перемещение карточек**: Карточки можно перетаскивать из колонки в колонку, как с помощью drag & drop, так и с помощью клика.
5. **Сортировка карточек**: В колонке карточки можно сортировать по рейтингу.

## Установка и запуск проекта

1. Убедитесь, что у вас установлен Node.js и pnpm.
2. Клонируйте репозиторий на свой компьютер:
   ```bash
   git clone https://github.com/waldymarxthf/test-vue.git
   ```
3. Перейдите в каталог проекта:
   ```bash
   cd test-vue
   ```
4. Установите зависимости:
   ```bash
   pnpm install
   ```
5. Запустите проект:
   ```bash
   pnpm dev
   ```
