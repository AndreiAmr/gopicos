const generator = (plop) => {
  plop.setGenerator('store', {
    description: 'Create a store',
    prompts: [
      {
        type: 'input',
        name: 'nameStore',
        message: 'What is your store name ?',
      },
      {
        type: 'input',
        name: 'nameModule',
        message: 'What is your module name?',
      },
    ],
    actions: [
      {
        type: 'add',
        path: '../store/{{camelCase nameStore}}/{{camelCase nameStore}}Actions.ts',
        templateFile: 'templates/StoreActions.ts.hbs',
      },
      {
        type: 'add',
        path: '../store/{{camelCase nameStore}}/{{camelCase nameStore}}Queries.ts',
        templateFile: 'templates/StoreQueries.ts.hbs',
      },
      {
        type: 'add',
        path: '../store/{{camelCase nameStore}}/{{camelCase nameStore}}Reducer.ts',
        templateFile: 'templates/StoreReducer.ts.hbs',
      },
      {
        type: 'add',
        path: '../store/{{camelCase nameStore}}/{{camelCase nameStore}}Repository.ts',
        templateFile: 'templates/StoreRepository.ts.hbs',
      },
      {
        type: 'add',
        path: '../store/{{camelCase nameStore}}/{{camelCase nameStore}}Sagas.ts',
        templateFile: 'templates/StoreSagas.ts.hbs',
      },
      {
        type: 'add',
        path: '../store/{{camelCase nameStore}}/{{camelCase nameStore}}Selectors.ts',
        templateFile: 'templates/StoreSelectors.ts.hbs',
      },
      {
        type: 'add',
        path: '../store/{{camelCase nameStore}}/{{camelCase nameStore}}Types.ts',
        templateFile: 'templates/StoreTypes.ts.hbs',
      },
    ],
  });
};

export default generator;
