import Amplify, { Auth, Storage } from "aws-amplify";
import React from "react";
import { useAsync } from "react-async";
import { withAuthenticator } from "@aws-amplify/ui-react";

// Replace with deployment outputs
const config = {
  aws_user_files_s3_bucket: "x",
  aws_user_pools_id: "x",
  aws_user_pools_web_client_id: "x",
  aws_cognito_identity_pool_id: "x",
  aws_cognito_region: "x",
  aws_user_files_s3_bucket_region: "x"
};

Amplify.configure(config);

function App() {
  return (
    <React.Fragment>
      <section>
        <h1>Upload assets</h1>
        <UploadAsset />
      </section>
      <section>
        <h1>List assets</h1>
        <ListAssets />
      </section>
      <section>
        <h1>Current user</h1>
        <CurrentUser />
      </section>
    </React.Fragment>
  );
}

const getCurrentUser = async () => {
  Auth.currentCredentials().then(cred => console.log(cred.identityId));
  return Auth.currentAuthenticatedUser();
};

function CurrentUser() {
  const { data, error, isPending } = useAsync(getCurrentUser);
  if (error) {
    return <p>{error.message}</p>;
  }

  if (isPending) {
    return <p>Loading...</p>;
  }

  return (
    <code style={{ whiteSpace: "pre" }}>{JSON.stringify(data, null, 2)}</code>
  );
}

function UploadAsset() {
  const handleOnChange = async event => {
    const file = event.target.files[0];
    try {
      await Storage.put(file.name, file, { level: "private" });
      alert(`File uploaded. \n name: ${file.name}`);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <form>
      <input type="file" multiple={false} onChange={handleOnChange} />
    </form>
  );
}

// Instead of list this could be GET or other operations.
// The GET will use presigned URL underneath, there is no other mechanism no share files from s3 with people who do not have their own AWS Account.
const getAssets = () => Storage.list("", { level: "private" });

function ListAssets() {
  const { data, error, isPending } = useAsync(getAssets);
  if (error) {
    return <p>{error.message}</p>;
  }

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (data.length === 0) {
    return <p>Nothing was uploaded</p>;
  }

  return (
    <ul>
      {data.map(uploadedFile => {
        return <li>{JSON.stringify(uploadedFile, null, 2)}</li>;
      })}
    </ul>
  );
}

export default withAuthenticator(App);
