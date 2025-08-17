import * as Yup from 'yup';
import { iconList } from '../misc/global';
import { HabitType, RepeatInterval, Status } from '../types/variables';

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

export const addEditHabitValidation = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .max(100, 'Title must be at most 100 characters'),

  description: Yup.string()
    .max(500, 'Description must be at most 500 characters')
    .nullable(),

  habitType: Yup.mixed<HabitType>()
    .oneOf([HabitType.GOOD, HabitType.BAD], 'Invalid type')
    .required('Habit type is required'),

  winPoints: Yup.number()
    .required('Win points required')
    .min(0, 'Win points must be ≥ 0')
    .integer('Must be an integer'),

  losePoints: Yup.number()
    .required('Lose points required')
    .min(0, 'Lose points must be ≥ 0')
    .integer('Must be an integer'),

  repeatInterval: Yup.mixed<RepeatInterval>()
    .oneOf(
      [RepeatInterval.DAILY, RepeatInterval.WEEKLY, RepeatInterval.MONTHLY, RepeatInterval.CUSTOM],
      'Invalid repeat interval'
    )
    .required('Repeat interval is required'),

  customIntervalDays: Yup.number()
    .nullable()
    .when('repeatInterval', {
      is: RepeatInterval.CUSTOM,
      then: (schema) =>
        schema
          .required('Custom interval days required')
          .min(1, 'Must be at least 1 day')
          .integer('Must be an integer'),
      otherwise: (schema) => schema.nullable(),
    }),

  repeatWeekDay: Yup.number()
    .nullable()
    .when('repeatInterval', {
      is: RepeatInterval.WEEKLY,
      then: (schema) =>
        schema
          .required('Weekday is required')
          .min(0, 'Invalid day')
          .max(6, 'Invalid day'),
      otherwise: (schema) => schema.nullable(),
    }),

  repeatMonthDay: Yup.number()
    .nullable()
    .when('repeatInterval', {
      is: RepeatInterval.MONTHLY,
      then: (schema) =>
        schema
          .required('Day of month required')
          .min(1, 'Day must be between 1 and 31')
          .max(31, 'Day must be between 1 and 31'),
      otherwise: (schema) => schema.nullable(),
    }),

  deadline: Yup.date()
    .nullable()
    .typeError('Deadline must be a valid date'),
});

export const addEditChallengeValidation = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .max(100, 'Title must be at most 100 characters'),

  description: Yup.string()
    .max(500, 'Description must be at most 500 characters')
    .nullable(),

  target: Yup.number()
    .required('Target is required')
    .min(1, 'Target must be at least 1'),

  repeatInterval: Yup.mixed<RepeatInterval>()
    .oneOf(
      [RepeatInterval.DAILY, RepeatInterval.WEEKLY, RepeatInterval.MONTHLY, RepeatInterval.CUSTOM],
      'Invalid repeat interval'
    )
    .required('Repeat interval is required'),

  startDate: Yup.date()
    .required('Start date is required')
    .typeError('Start date must be a valid date'),

  deadline: Yup.date()
    .nullable()
    .typeError('Deadline must be a valid date')
    .min(Yup.ref('startDate'), 'Deadline must be after start date'),
});