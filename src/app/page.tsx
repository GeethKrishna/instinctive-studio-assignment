import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-center text-2xl">Please go to the dashboard</h1>
      <Link href={"/dashboard/1"}>
        <button className="block mx-auto mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Go to Dashboard
        </button>
      </Link>
    </div>
  );
}
