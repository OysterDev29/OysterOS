export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-5xl font-bold mb-8">
        Parc à Huîtres Intelligent
      </h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-green-500/20 border border-green-500 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-2">
            Zone retournée
          </h2>
          <p>Poches déjà secouées / retournées.</p>
          <p className="mt-4 text-green-300">
            Prochaine intervention : 25 mars 2026
          </p>
        </div>

        <div className="bg-blue-500/20 border border-blue-500 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-2">
            Zone vendable
          </h2>
          <p>Huîtres taille 4 presque taille 3.</p>
          <p className="mt-4 text-blue-300">
            Vente bientôt possible
          </p>
        </div>

        <div className="bg-pink-500/20 border border-pink-500 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-2">
            Zone croissance
          </h2>
          <p>Huîtres ayant besoin de pousser.</p>
          <p className="mt-4 text-pink-300">
            Contrôle : 25 avril 2026
          </p>
        </div>
      </div>

      <div className="mt-10 bg-slate-900 rounded-3xl p-8 border border-slate-800">
        <h2 className="text-3xl font-bold mb-4">
          Carte du Parc
        </h2>

        <div className="grid grid-cols-6 gap-3">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className={`h-24 rounded-2xl ${
                i < 8
                  ? 'bg-green-500/30 border border-green-500'
                  : i < 16
                  ? 'bg-blue-500/30 border border-blue-500'
                  : 'bg-pink-500/30 border border-pink-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}