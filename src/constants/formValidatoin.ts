import * as Yup from 'yup';

export const addEditGoalValidation = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  points: Yup.number().required('Points are required').positive().integer(),
});