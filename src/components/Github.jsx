import { useState } from "react";

export default function Github() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!username.trim()) return;

    setLoading(true);
    setError("");
    setUser(null);
    setRepos([]);

    try {
     
      const resUser = await fetch(`https://api.github.com/users/${username}`);
      if (!resUser.ok) {
        throw new Error(resUser.status === 404 ? "Usuário não encontrado" : `Erro: ${resUser.status}`);
      }
      const userData = await resUser.json();
      setUser(userData);

     
      const resRepos = await fetch(`${userData.repos_url}?per_page=50`);
      if (!resRepos.ok) throw new Error("Erro ao buscar repositórios");

      setRepos(await resRepos.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setUsername(""); 
    }
  };

  return (
    <div className="relative w-screen h-screen flex justify-center items-center overflow-hidden">
   
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/bg-video.mp4" type="video/mp4" />
      </video>

      <div className="relative bg-white/10 backdrop-blur-md shadow-lg rounded-lg w-[400px] p-6 flex flex-col items-center overflow-y-auto max-h-[90vh]">
        
       
        <div className="flex flex-col items-center gap-3 w-full">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nome do usuário GitHub"
            className="p-2 px-6 text-center text-white w-[300px] rounded-md bg-black/40 outline-none focus:ring-2 focus:ring-[#9dff3d]"
          />
          <button
            onClick={handleSearch}
            className="bg-[#9dff3d] text-[#130033] font-bold hover:bg-[#4a8f2e] hover:text-white p-2 w-[150px] rounded-md transition-all duration-300"
          >
            Buscar
          </button>
        </div>

      
        {loading && <p className="text-white mt-3">Carregando...</p>}
        {error && <p className="text-red-500 mt-3">Erro: {error}</p>}

       
        {user && (
          <div className="mt-6 text-center w-full">
            <img src={user.avatar_url} alt={user.login} className="w-24 h-24 rounded-full mx-auto" />
            <h3 className="font-bold text-xl mt-3 text-[#9dff3d]">{user.name ?? user.login}</h3>
            {user.bio && <p className="text-white mt-2">{user.bio}</p>}
            <p className="text-white font-semibold mt-2">
              Repositórios públicos:{" "}
              <span className="text-yellow-300 text-lg">{user.public_repos}</span>
            </p>

            <h4 className="mt-5 font-bold text-red-500 text-2xl">Repositórios</h4>
            <ul className="mt-3 flex flex-col gap-2">
              {repos.map((r) => (
                <li key={r.id}>
                  <a
                    href={r.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white hover:text-[#9dff3d] transition-all duration-300 hover:underline"
                  >
                    {r.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
