<div align="center">

# [Nest Firebase Blog API](https://nest-firebase-blog-api.herokuapp.com/api/v1)

#### An API to manage users and blog posts written in TypeScript using NestJS Framework.

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white) ![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase) ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white) ![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) ![GitLab CI](https://img.shields.io/badge/gitlab%20ci-%23181717.svg?style=for-the-badge&logo=gitlab&logoColor=white) ![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)

</div>

&nbsp;

## Features

- Authentication with Firebase Auth
- Users management with Firebase Admin
- Posts management with FireORM and Firestore
- Unit tests with Jest
- Spell checking with CSpell
- Git hooks with Husky
- API docs with Swagger
- Development environment with Docker
- GitLab CI/CD

&nbsp;

## Test Coverage

| Statements | Branches | Functions | Lines  |
| ---------- | -------- | --------- | ------ |
| 90.00%     | 74.12%   | 89.04%    | 90.05% |

&nbsp;

## Instructions

- [Installing](#installing)

- [Running](#running)

- [GitLab CI/CD](#gitlab-cicd)

- [GitLab Runner](#gitlab-runner)

- [Firebase Rules Deploy](#firebase-rules-deploy)

- [Heroku Deploy](#heroku-deploy)

- [Troubleshooting](#troubleshooting)

&nbsp;

## Installing

:warning: **_This app uses PNPM as its package manager and may not work with NPM or YARN_** :warning:

#### 1 - Install PNPM globally:

```
npm install -g pnpm
```

#### 2 - Get the app code:

```
git clone git@github.com:juliohenriqueop/nest-firebase-blog-api.git
```

#### 3 - Enter the app directory:

```
cd nest-firebase-blog-api
```

#### 4 - Use PNPM to install all dependencies:

```
pnpm install
```

&nbsp;

## Running

### Using Docker Compose

#### 1 - Login on Firebase CLI:

```
docker-compose run --rm -p "9005:9005" firebase login
```

#### 2 - Rename .example.env to .development.env:

```
git mv .example.env .development.env
```

#### 3 - Update .development.env to use your Firebase project id:

`GCLOUD_PROJECT="YOUR-FIREBASE-PROJECT-ID-HERE"`

#### 4 - Rename firebase-config.emulator.js to firebase-config.js:

```
git mv public/firebase-config.emulator.js public/firebase-config.js
```

#### 5 - Start Firebase emulators and NodeJS container:

```
docker-compose up -d
```

#### 6 - Open the app:

&nbsp;[Nest Firebase Blog API Swagger Docs](http://localhost:3000/api/v1)

&nbsp;

### Using Firebase CLI and NodeJS

#### 1 - Install Firebase CLI globally:

```
pnpm add -g firebase-tools
```

#### 2 - Rename .example.env to .development.env:

```
git mv .example.env .development.env
```

#### 3 - Update .development.env to use your Firebase project id:

`GCLOUD_PROJECT="YOUR-FIREBASE-PROJECT-ID-HERE"`

#### 4 - Update .development.env to use your local Firebase Auth emulator:

`FIREBASE_AUTH_EMULATOR_HOST="localhost:9099"`

#### 5 - Update .development.env to use your local Firestore emulator:

`FIRESTORE_EMULATOR_HOST="localhost:8080"`

#### 6 - Rename firebase-config.emulator.js to firebase-config.js:

```
git mv public/firebase-config.emulator.js public/firebase-config.js
```

#### 7 - Start Firebase emulators:

```
firebase emulators:start --project YOUR-FIREBASE-PROJECT-ID-HERE
```

#### 8 - Start the app:

```
pnpm start:dev
```

#### 9 - Open the app:

&nbsp;[Nest Firebase Blog API Swagger Docs](http://localhost:3000/api/v1)

&nbsp;

## GitLab CI/CD

#### Before using GitLab CI/CD you have to set the following variables:

###### [NPM log level](https://docs.npmjs.com/cli/v8/using-npm/logging#loglevel)

`NPM_LOG_LEVEL`

###### [PNPM audit level](https://pnpm.io/cli/audit/#--audit-level-severity)

`PNPM_AUDIT_LEVEL`

###### The URL from where your [Firebase web configuration](https://support.google.com/firebase/answer/7015592#web&zippy=%2Cneste-artigo) will be downloaded and saved as public/firebase-config.js.

`FIREBASE_WEB_CONFIG_URL`

###### Your Firebase CI token.

`FIREBASE_TOKEN`

###### The Firebase project id to where your security rules will be deployed.

`FIREBASE_PROJECT`

###### Your Heroku API key.

`HEROKU_API_KEY`

###### The Heroku app to deploy to.

`HEROKU_APP`

&nbsp;

## GitLab Runner

#### You may want to use your own GitLab Runner in GitLab CI/CD.

### Using Docker Compose

#### 1 - Register your GitLab Runner on GitLab:

```
docker-compose run --rm gitlab-runner register
```

#### 2 - Start your GitLab Runner:

```
docker-compose up gitlab-runner
```

&nbsp;

## Firebase Rules Deploy

### Using Docker Compose

:warning: **_Ensure to be logged in as described in the [running instructions](#running)_** :warning:

#### 1 - Deploy your Firebase Rules:

```
docker-compose run --rm firebase deploy --only "firestore:rules,storage" --project YOUR-FIREBASE-PROJECT-ID-HERE
```

&nbsp;

### Using Firebase CLI

#### 1 - Firebase CLI login:

```
firebase login
```

#### 2 - Deploy your Firebase rules:

```
firebase deploy --only "firestore:rules,storage" --project YOUR-FIREBASE-PROJECT-ID-HERE
```

&nbsp;

## Heroku Deploy

#### 1 - Install Heroku CLI globally:

```
pnpm add -g heroku
```

#### 2 - Login on Heroku CLI:

```
heroku login
```

#### 3 - Create your Heroku app:

```
heroku create YOUR-HEROKU-APP-NAME-HERE
```

#### 4 - Add PNPM buildpack:

```
heroku buildpacks:add https://github.com/unfold/heroku-buildpack-pnpm --app YOUR-HEROKU-APP-NAME-HERE
```

#### 5 - Add Slug Cleaner buildpack:

```
heroku buildpacks:add https://github.com/nekopanic/buildpack-slug-cleaner --app YOUR-HEROKU-APP-NAME-HERE
```

#### 6 - Set your Firebase project id environment variable:

```
heroku config:set FIREBASE_PROJECT_ID="YOUR-FIREBASE-PROJECT-ID-HERE" --app YOUR-HEROKU-APP-NAME-HERE
```

#### 7 - Set your Firebase client email environment variable:

```
heroku config:set FIREBASE_CLIENT_EMAIL="YOUR-FIREBASE-CLIENT-EMAIL-HERE" --app YOUR-HEROKU-APP-NAME-HERE
```

#### 8 - Set your Firebase private key environment variable ENCODED AS BASE64:

```
heroku config:set FIREBASE_PRIVATE_KEY_BASE64="YOUR-FIREBASE-PRIVATE-KEY-BASE64-HERE" --app YOUR-HEROKU-APP-NAME-HERE
```

#### 9 - Set your Firebase app URL:

```
heroku config:set FIREBASE_APP_URL="YOUR-FIREBASE-APP-URL-HERE" --app YOUR-HEROKU-APP-NAME-HERE
```

#### 10 - Let GitLab CI/CD handle the deployment (recommended), or deploy to Heroku manually:

##### &emsp; Using GitLab CI/CD

###### &emsp; 1 - Add your GitLab repository:

```
git remote add gitlab YOUR-GITLAB-REPOSITORY-HERE
```

###### &emsp; 2 - Push to your GitLab repository DEFAULT branch:

```
git push gitlab main
```

&nbsp;

##### &emsp; Using Heroku

&emsp; :warning: **_Ensure to [deploy your Firebase rules](#firebase-rules-deploy) before deploy the app to Heroku manually_** :warning:

###### &emsp; 1 - Create a new branch:

```
git checkout -b heroku
```

###### &emsp; 2 - Update public/firebase-config.js with your production configuration:

```js
const firebaseConfig = {
  apiKey: 'YOUR-FIREBASE-WEB-APP-API-KEY-HERE',
  authDomain: 'YOUR-FIREBASE-APP-AUTH-DOMAIN-HERE',
  projectId: 'YOUR-FIREBASE-PROJECT-ID-HERE',
  appId: 'YOUR-FIREBASE-WEB-APP-ID-HERE',
};
```

###### &emsp; 3 - Stage public/firebase-config.js:

```
git add --force public/firebase-config.js
```

###### &emsp; 4 - Commit public/firebase-config.js:

```
git commit -m "chore: add firebase web configuration"
```

###### &emsp; 5 - Add your Heroku repository:

```
heroku git:remote --app YOUR-HEROKU-APP-NAME-HERE
```

###### &emsp; 6 - Push to your Heroku repository main branch:

```
git push heroku heroku:main
```

&nbsp;

## Troubleshooting

#### Permission Denied

##### Some files like firebase.json, firebase/firestore/firestore.rules, and firebase/storage/storage.rules are mounted inside the Firebase container and may have their permissions changed.

##### You can recover access to these files by changing their permissions to allow reading and writing outside the container.

```
sudo chmod +rw -R firebase firebase.json
```

&nbsp;
