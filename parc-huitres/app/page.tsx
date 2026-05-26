"use client";

export default function Home() {

  function test() {
    alert("ça marche !");
  }

  return (
    <div className="p-10">
      <button
        onClick={test}
        className="bg-blue-500 text-white px-6 py-4 rounded-xl"
      >
        Clique moi
      </button>
    </div>
  );
}