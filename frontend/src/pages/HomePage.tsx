import useFetch from "../hooks/useFetch";
import { GetAuthorizationUrlRes } from "../types/api";

const HomePage = () => {
  const { data, isLoading, error } = useFetch<GetAuthorizationUrlRes>({
    endpoint: `${import.meta.env.VITE_BACKEND_URL}/api/authorization-url`,
  });

  const handleRedirectToAuthorizationUrl = () => {
    if (!data || !data.url) {
      return;
    }

    window.location.href = data.url;
  };

  const renderContent = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    } else if (error) {
      return <div>{`${error}`}</div>;
    }

    return (
      <button onClick={handleRedirectToAuthorizationUrl}>
        Sign in with sgID
      </button>
    );
  };

  return (
    <div>
      <h2>Home page</h2>

      {renderContent()}
    </div>
  );
};

export default HomePage;
