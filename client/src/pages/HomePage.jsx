import React from "react";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const particles = Array.from({ length: 30 });

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
      {/* Glowing particles */}
      {particles.map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${3 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 5}s`
          }}
        ></div>
      ))}

      <Navbar />

      {/* Main content */}
      <main className="p-10 mt-28 text-center backdrop-blur-sm bg-white/5 rounded-xl max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Welcome to <br />Excel Analytic Platform</h1>
        <p className="text-xl font-light mb-4 italic text-purple-200">
          Explore <span className="font-semibold text-white">analytics like never before.</span>
        </p>
        <p className="text-md text-purple-300">
          Import, analyze, and visualize your Excel data effortlessly.
        </p>
      </main>
      {/* <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi aliquam saepe numquam dolore obcaecati, soluta laborum magnam iusto ea culpa doloremque veritatis nemo. Cumque cupiditate voluptates esse ea velit nam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid cupiditate laudantium, totam sed tempora officiis aspernatur dolores dolorem sit vitae. lorem500 Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum assumenda dolor repudiandae suscipit veniam aperiam temporibus neque tempore qui est esse doloribus, necessitatibus praesentium unde quod voluptates commodi. Iure enim cupiditate labore quo, tenetur sit non exercitationem, modi dicta odio nam quisquam. A iure nesciunt quod dicta? Quam voluptatum qui repellat nam molestiae repellendus ab, ad quasi temporibus eos expedita minus. Tempore, molestias quasi? Eius hic praesentium, rerum assumenda saepe distinctio, dolorem officia asperiores optio officiis neque animi, illo unde nihil. Illum quis natus nihil assumenda praesentium exercitationem inventore delectus similique dicta nam officia culpa, eos suscipit quisquam repellendus accusantium, incidunt, provident beatae ipsum cupiditate iste asperiores in vitae quae? Atque, possimus! Omnis harum id, non, voluptate pariatur eius sit cum saepe eaque, quaerat suscipit ea doloribus ducimus commodi. Fuga vel obcaecati, delectus magnam id velit aspernatur accusamus iusto accusantium nobis sint quia nihil qui doloremque explicabo atque aliquam nam deleniti quam odit eaque. Quibusdam quisquam nobis expedita autem eligendi ex doloribus illum deleniti obcaecati error? Non quas similique repellat magnam sunt, accusamus unde quos voluptates a aliquid dolore laudantium quidem rem adipisci debitis quod esse quam? Nam ipsa tempore ea magnam qui ex aliquam vero. Placeat temporibus quae incidunt.</p> */}
    </div>
  );
};

export default HomePage;

