import useFetch from "../hooks/useFetch";
import { GetProtectedRes } from "../types/api";

const ProtectedPage = () => {
  const { data, isLoading, error } = useFetch<GetProtectedRes>({
    endpoint: `${import.meta.env.VITE_BACKEND_URL}/api/protected-message`,
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
        <div>{`Hidden message: ${data.message}`}</div>
      </>
    );
  };

  return (
    <div>
      <h2>Protected page</h2>

      {renderContent()}
    </div>
  );
};

export default ProtectedPage;
