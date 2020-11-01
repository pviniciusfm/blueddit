import { Button } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import React from "react";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";

export const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          //   const response = await login(values);
          //   if (response.data?.login.errors) {
          //     setErrors(toErrorMap(response.data?.login.errors));
          //   }
          //   if (response.data?.login.user) {
          //     router.push("/");
          //   }
        }}
      >
        {({ values, handleChange, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <InputField
              name="newPassword"
              label="new password"
              type="password"
              placeholder="newPassword"
            />
            <Button
              mt={4}
              variantColor="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default ChangePassword;
