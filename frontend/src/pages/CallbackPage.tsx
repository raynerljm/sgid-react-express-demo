import { useNavigate, useSearchParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { GetCallbackRes } from "../types/api";

const CallbackPage = () => {
  const [searchParams] = useSearchParams();

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const { data, isLoading, error } = useFetch<GetCallbackRes>({
    endpoint: `${
      import.meta.env.VITE_BACKEND_URL
    }/api/callback?code=${code}&state=${state}`,
    options: {
      credentials: "include",
    },
  });

  const renderContent = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    } else if (error || !data) {
      return <div>{`${error}`}</div>;
    }

    return (
      <>
        <div>{`sgID: ${data.sub}`}</div>
        <div>{`MyInfo Name: ${data.data["myinfo.name"]}`}</div>
      </>
    );
  };

  return (
    <div>
      <h2>Callback page</h2>

      {renderContent()}
    </div>
  );
};

export default CallbackPage;
