import React from "react";
import Form from "../components/signup-form";
import Loader from "../components/Loading";

function SignUp() {
  const [loading, setLoading] = React.useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[--color-bg-primary]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center items-center min-h-screen">
      <Form setLoading={setLoading} />
    </div>
  );
}

export default SignUp;
