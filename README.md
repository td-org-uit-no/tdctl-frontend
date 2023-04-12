# TDCTL-Frontend

## 🆕 Getting started

1. Clone the project
2. Install [yarn](https://yarnpkg.com/) with `npm install -g yarn`
3. Install the required packages with using `yarn install`
4. Run the project locally with `yarn start`

## 🏝 Alternative backends

Working remote or without internet access? Or perhaps you're doing some backend work and want to see how the changes affect the frontend?

You can use a local backend instead of the default remote hosted backend you can start the project with:

```
yarn start:local
```

this will use a different set of enivronment variables for defining the backend URL. You can see these over in the `./environments` folder.

## :clap: Contributing

### 💡 Got an idea for a feature, or got a bug to report?

[Create an issue](https://github.com/td-org-uit-no/tdctl-frontend/issues/new/choose)

### 👷‍♂️ Want to get more hands on?

#### 💅 Formatting the code

We use [Prettier](https://prettier.io/) to format the code in this codebase.
Prettier is available for most code editors, and also available through the
command line. Either install it globally on your system, or use the projects
prettier by running `yarn run prettier --write .` from the root of the repository
after installing the dependencies with `yarn install`

#### :twisted_rightwards_arrows: Branches and branch naming

Contribution should be done on separate branches and then use a [pull request](https://github.com/td-org-uit-no/tdctl-frontend/compare) to propose changes.

- `feature/<THE_FEATURE>`
- `bugfix/<THE_BUG>`
