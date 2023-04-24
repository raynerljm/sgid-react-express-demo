import useFetch from "../hooks/useFetch";
import { GetUserInfoRes } from "../types/api";

const WhoAmIPage = () => {
  const { data, isLoading, error } = useFetch<GetUserInfoRes>({
    endpoint: `${import.meta.env.VITE_BACKEND_URL}/api/whoami`,
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
      <h2>User info page</h2>
      {renderContent()}
    </div>
  );
};

export default WhoAmIPage;
