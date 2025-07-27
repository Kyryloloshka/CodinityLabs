<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Assignment Service

Сервіс для управління завданнями та поданнями рішень студентів.

## Функціональність

- **Управління завданнями**: створення, редагування, видалення завдань
- **Тестові випадки**: кожне завдання має набір тестових випадків
- **Подання рішень**: студенти можуть надсилати код для перевірки
- **Статуси подань**: відстеження статусу обробки рішень

## Структура бази даних

### Assignment
- `id` - унікальний ідентифікатор
- `title` - назва завдання
- `description` - опис завдання
- `difficulty` - складність (1-10)
- `deadline` - термін здачі
- `createdAt` - дата створення
- `updatedAt` - дата оновлення

### TestCase
- `id` - унікальний ідентифікатор
- `input` - вхідні дані
- `expected` - очікуваний результат
- `description` - опис тестового випадку
- `assignmentId` - посилання на завдання

### Submission
- `id` - унікальний ідентифікатор
- `userId` - ідентифікатор студента
- `assignmentId` - ідентифікатор завдання
- `code` - код рішення
- `eslintReport` - звіт ESLint (JSON)
- `testResults` - результати тестів (JSON)
- `score` - оцінка
- `status` - статус обробки
- `createdAt` - дата створення
- `updatedAt` - дата оновлення

## API Endpoints

### Assignments

- `POST /assignments` - створити завдання
- `GET /assignments` - отримати всі завдання
- `GET /assignments/:id` - отримати завдання за ID
- `PATCH /assignments/:id` - оновити завдання
- `DELETE /assignments/:id` - видалити завдання

### Submissions

- `POST /submissions` - створити подання
- `GET /submissions` - отримати всі подання
- `GET /submissions/:id` - отримати подання за ID
- `GET /submissions/user/:userId` - отримати подання користувача
- `GET /submissions/assignment/:assignmentId` - отримати подання завдання
- `DELETE /submissions/:id` - видалити подання

## Налаштування

1. Встановіть залежності:
```bash
pnpm install
```

2. Створіть файл `.env` на основі `.env.example`:
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/assignment_service_db"
PORT=3002
NODE_ENV=development
```

3. Згенеруйте Prisma клієнт:
```bash
pnpm db:generate
```

4. Застосуйте міграції:
```bash
pnpm db:migrate
```

5. Запустіть сервіс:
```bash
pnpm start:dev
```

## Розробка

- `pnpm start:dev` - запуск в режимі розробки
- `pnpm build` - збірка проекту
- `pnpm test` - запуск тестів
- `pnpm lint` - перевірка коду
- `pnpm db:studio` - відкриття Prisma Studio

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
