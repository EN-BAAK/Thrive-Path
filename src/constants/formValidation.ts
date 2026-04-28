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

  isImportant: Yup.boolean().required(),

  isCompleted: Yup.boolean().required(),
});

export const addEditChallengeValidation = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .max(100, 'Title must be at most 100 characters'),

  description: Yup.string()
    .max(500, 'Description must be at most 500 characters')
    .nullable(),

  targetValue: Yup.number()
    .required('Target value is required')
    .min(1, 'Target value must be at least 1'),

  maxHearts: Yup.number()
    .required('Max hearts are required')
    .min(0, 'Max hearts must be at least 0'),

  maxStars: Yup.number()
    .required('Max stars are required')
    .min(0, 'Max stars must be at least 0'),

  startDate: Yup.date()
    .required('Start date is required')
    .typeError('Start date must be a valid date'),

  endDate: Yup.date()
    .nullable()
    .typeError('End date must be a valid date')
    .min(Yup.ref('startDate'), 'End date must be after start date'),
});
