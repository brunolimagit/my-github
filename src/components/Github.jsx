
import { useState } from "react";

export default function Github() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!username) return;
    setLoading(true);
    setError("");
    setUser(null);
    setRepos([]);
    setUsername("")
    

    try {
      const resUser = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}`
      );

      if (!resUser.ok) {
        if (resUser.status === 404) throw new Error("Usuário não encontrado");
        throw new Error(`Erro: ${resUser.status}`);
      }

      const userData = await resUser.json();
      setUser(userData);

     
      const resRepos = await fetch(`${userData.repos_url}?per_page=50`);
      if (!resRepos.ok) throw new Error("Erro ao buscar repositórios");

      const reposData = await resRepos.json();
      setRepos(reposData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black p-4">
    <div className="flex flex-col items-center bg-[#130033] border-1 rounded-[7px] m-auto w-[400px] ">
    <div className="flex flex-col items-center p-6 gap-1 ">
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Nome do usuário GitHub"
        className="border p-2 px-6 text-center text-white w-[300px] rounded-[7px]"
      />
      <button
        onClick={handleSearch}
        className="ml-2 bg-[#9dff3d] text-[#130033] font-bold cursor-pointer hover:bg-[#4a8f2e] p-2 w-[150px] rounded-[7px]"
      >
        Buscar
      </button>

      {loading && <p className="text-white">Carregando...</p>}
      {error && <p className="text-red-500">Erro: {error}</p>}

      {user && (
        <div className="mt-7 text-center flex flex-col items-center">
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-30 h-30 rounded-full text-center"
          />
          <h3 className="font-bold text-[20px] p-3 text-[#9dff3d]">{user.name ?? user.login}</h3>
          <p>{user.bio}</p>
          <p className="text-white font-semibold">Repositórios públicos: <span className="text-[yellow] text-[20px]">{user.public_repos}</span> </p>

          <h4 className="mt-3 font-bold p-2 text-[red] text-[25px] ">Repositórios</h4>
          <ul className="list-none pl-6 ">
            {repos.map((r) => (
              <li key={r.id}>
                <a
                  href={r.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white hover:underline flex flex-col hover:text-[#9dff3d] transition-all duration-300 cursor-pointer hover:scale-115"
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
    </div>
  );
}

