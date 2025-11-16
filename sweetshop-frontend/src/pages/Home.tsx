import React from "react";
import SweetsList from "../components/Sweets/SweetsList";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-lg p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Your neighborhood sweet shop — online</h1>
          <p className="mt-3 text-slate-600 max-w-xl">Discover handcrafted sweets, classic recipes and seasonal specials. Fast delivery, happiest customers.</p>
          <div className="mt-6 flex gap-3">
            <a href="#sweets" className="btn-primary">Shop now</a>
            <a href="#admin" className="px-4 py-2 rounded-md border border-slate-200">Explore</a>
          </div>
        </div>

        <div className="w-full md:w-1/2 grid grid-cols-2 gap-3">
          {/* hero collage: unsplash placeholders */}
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e6/JalebiIndia.jpg" alt="dessert" className="w-full h-40 object-cover rounded-md shadow" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Matkakulfi.jpg" alt="sweets" className="w-full h-40 object-cover rounded-md shadow" />

          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Kheer.jpg/1280px-Kheer.jpg" alt="indian" className="w-full h-40 object-cover rounded-md shadow" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Besan_Laddoo_Sweets_India_cropped.jpg/1024px-Besan_Laddoo_Sweets_India_cropped.jpg" alt="bakery" className="w-full h-40 object-cover rounded-md shadow" />
        </div>
      </section>

      <section id="sweets">
        <h2 className="text-2xl font-semibold mb-4">Available sweets</h2>
        <SweetsList />
      </section>
    </div>
  );
}
