import { required, confirmed, email, min } from 'vee-validate/dist/rules';
import { extend } from 'vee-validate';

extend('required', {
  ...required,
  message: 'This {_field_} is required'
});

extend('email', {
  ...email,
  message: 'This {_field_} must be a valid email'
});

extend('confirmed', {
  ...confirmed,
  message: 'This {_field_} confirmation does not match'
});

extend('min', {
  ...min,
  message: 'This {_field_} must be 6 characters long'
});
