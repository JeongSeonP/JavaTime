const StoreLoading = () => {
  return (
    <main className="pt-10 pb-20">
      <div className=" flex flex-col items-center justify-center">
        <div className="animate-pulse w-40 h-12 mb-3 bg-[#f1efef] rounded-full"></div>
        <div className="flex mb-2 md:w-4/5 w-[350px]  animate-pulse  items-center justify-center max-w-xl ">
          <div className="w-1/3 h-[130px]  bg-[#f1efef] mr-2 rounded-xl"></div>
          <div className="w-2/3 bg-[#f1efef]  h-[130px] ml-1 rounded-xl md:ml-4"></div>
        </div>
        <div className=" md:w-4/5 w-[350px] max-w-xl mb-2 bg-[#f1efef] h-[180px] ml-1 rounded-xl md:ml-4"></div>
        <div className=" md:w-4/5 w-[350px] max-w-xl bg-[#f1efef] h-[350px] ml-1 rounded-xl md:ml-4"></div>
      </div>
    </main>
  );
};
export default StoreLoading;
