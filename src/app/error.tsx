"use client";
import { faArrowLeft, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { FC } from "react";

type ErrorProperties = {
  error: Error;
  reset: () => void;
};

const error: FC<ErrorProperties> = ({ error }) => {
  return (
    <section className="bg-white">
      <div className="container mx-auto flex min-h-screen items-center px-6 py-12">
        <div className="mx-auto flex max-w-sm flex-col items-center text-center">
          <FontAwesomeIcon
            className="p-3 text-3xl font-medium text-blue-500"
            icon={faCircleInfo}
          />
          <h1 className="mt-3 text-2xl font-semibold text-gray-800 md:text-3xl">
            {error.message}
          </h1>
          <p className="mt-4 text-gray-500">
            The page you are looking for does not exist. Here are some helpful
            links:
          </p>

          <div className="mt-6 flex w-full shrink-0 items-center gap-x-3 sm:w-auto">
            <button
              onClick={() => {
                history.back();
              }}
              className="flex w-1/2 items-center justify-center gap-x-2 rounded-lg border bg-white px-5 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100 sm:w-auto"
            >
              <FontAwesomeIcon icon={faArrowLeft} />

              <span>Go back</span>
            </button>

            <Link
              href="/"
              className="w-1/2 shrink-0 cursor-pointer rounded-lg bg-blue-500 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 hover:bg-blue-600 sm:w-auto"
            >
              Take me home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default error;
