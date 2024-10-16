import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/signup`,
        { name, email, password },
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success("Login successful");
      } else {
        toast.error("Login failed");
      }

      const user = res.data;
      console.log(user);
      navigate("/");
      localStorage.setItem("user", JSON.stringify(user));
      console.log(localStorage.getItem("user"));
    } catch (err) {
      console.log(err);
      toast.error("Login failed");
    }
  };

  return (
    <div>
      <Toaster />
      <div>
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-lg">
            <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">
              Get started today
            </h1>

            <p className="mx-auto mt-4 max-w-md text-center text-gray-800">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Obcaecati sunt dolores deleniti inventore quaerat mollitia?
            </p>

            <div className="mb-0 mt-6 space-y-4 rounded-lg  p-4 shadow-lg sm:p-6 lg:p-8">
              <p className="text-center text-lg font-medium">
                Sign up to your account
              </p>

              <div>
                <label htmlFor="name" className="sr-only">
                  Name
                </label>

                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border-gray-600 p-4 pe-12 text-sm shadow-sm"
                    placeholder="Enter Name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>

                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border-gray-600 p-4 pe-12 text-sm shadow-sm"
                    placeholder="Enter email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>

                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    className="w-full rounded-lg border-gray-600 p-4 pe-12 text-sm shadow-sm"
                    placeholder="Enter password"
                  />
                </div>
              </div>

              <button
                onClick={handleLogin}
                type="submit"
                className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
              >
                Sign in
              </button>

              <p className="text-center text-sm text-gray-500">
                No account?
                <Link className="underline" to="/login">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
