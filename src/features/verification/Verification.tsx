import { useModal } from "@/context/ModalContext";
import useGetSumSubToken from "@/features/verification/useGetSumSubToken";
import SumsubWebSdk from "@sumsub/websdk-react";
import { useEffect } from "react";

const SumsubWidget = () => {
  const { data, isError, refetch } = useGetSumSubToken();
  const { showModal } = useModal();

  useEffect(() => {
    if (isError) {
      showModal("error", "Something went wrong", "Please try again later");
    }
  }, [isError, showModal]);

  const accessTokenExpirationHandler = async (): Promise<string> => {
    try {
      const result = await refetch();
      return result.data?.token || "";
    } catch (error) {
      showModal("error", "Something went wrong", "Please try again");
      return "";
    }
  };

  // if (isLoading) {
  //   return <Loader />;
  // }

  if (!data?.token) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-[#1b1b1f]">
      <SumsubWebSdk
        className="w-full h-full"
        accessToken={data.token}
        expirationHandler={accessTokenExpirationHandler}
        config={{
          lang: "en",
        }}
        options={{
          addViewportTag: false,
          adaptIframeHeight: true,
        }}
        onMessage={(type: string, payload: any) => {
          console.log("Событие Sumsub:", type, payload);
        }}
        onError={(error: any) => {
          console.error("Ошибка Sumsub:", error);
        }}
      />
    </div>
  );
};

export default SumsubWidget;
