import * as Yup from 'yup';
import { iconList } from '../misc/global';
import { Status } from '../types/variables';

export const addEditGoalValidation = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .max(100, 'Name must be at most 100 characters'),

  description: Yup.string()
    .max(500, 'Description must be at most 500 characters')
    .nullable(),

  isImportant: Yup.boolean(),

  points: Yup.number()
    .positive('Points must be positive')
    .integer('Points must be an integer'),

  deadline: Yup.date()
    .required('Deadline is required')
    .typeError('Deadline must be a valid date'),

  status: Yup.mixed<Status>()
    .oneOf([Status.CANCELED, Status.COMPLETED, Status.PENDING], 'Invalid status')
    .required('Status is required'),

  priority: Yup.number()
    .min(1, 'Priority must be at least 1'),

  categoryId: Yup.number()
    .required('Category is required')
    .typeError('Category must be selected'),
});

export const addEditCategoryValidation = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  color: Yup.string()
    .matches(/^#(?:[0-9a-fA-F]{3}){1,2}$/, 'Invalid color hex')
    .required('Color is required'),
  icon: Yup.string()
    .oneOf(iconList, "Invalid icon")
    .required('Icon is required'),
});

export const addEditTaskValidation = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must be less than 100 characters'),

  description: Yup.string()
    .max(500, 'Description must be less than 500 characters')
    .nullable(),

  points: Yup.number()
    .positive('Points must be positive')
    .integer('Points must be an integer'),

  isImportant: Yup.boolean().required(),

  isCompleted: Yup.boolean().required(),

  categoryId: Yup.number()
    .required('Category is required')
    .typeError('Invalid category selection'),
});

export const addEditSubtaskValidation = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must be less than 100 characters'),

  points: Yup.number()
    .positive('Points must be positive')
    .integer('Points must be an integer'),

  isImportant: Yup.boolean().required(),

  isCompleted: Yup.boolean().required(),
});