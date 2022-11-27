import Button from "../components/Button";

import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate()
  return (
    <section className="h-screen bg-Bull bg-cover font-[Poppins] md:bg-top bg-center select-none">
      <div className="flex flex-col justify-center text-center items-center h-3/4">
        <h2 className="text-white text-2xl font-medium">Hey, there!</h2>
        <h1 className="md:text-5xl text-3xl text-white font-semibold py-5">
           Manage your investments and track your stocks across multiple portfolios here.
        </h1>
        <div className="text-xl">
          <Button text="Get Started" onClick={() => navigate("/login")}/>
        </div>
      </div>
    </section>
  );
};

export default Home;