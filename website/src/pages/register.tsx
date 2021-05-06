import { Form, Formik } from 'formik';
import { useRegisterMutation } from '../generated/graphql';
import { withApollo } from '../utils/with_apollo';

const RegisterPage: React.FC<{}> = () => {
  const [register] = useRegisterMutation();

  const submitForm = async (values: { username: string; email: string; password: string }) => {
    const { username, email, password } = values;
    const response = await register({ variables: { username, email, password } });

    console.log(response);
  };

  return (
    <Formik initialValues={{ username: '', email: '', password: '' }} onSubmit={submitForm}>
      {({ values, handleChange }) => (
        <Form>
          <input
            type="text"
            placeholder="Email"
            onChange={handleChange}
            value={values.email}
            name="email"
          />
          <input
            type="password"
            placeholder="Username"
            onChange={handleChange}
            value={values.username}
            name="username"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={handleChange}
            value={values.password}
            name="password"
          />
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};

export default withApollo({ ssr: false })(RegisterPage);
