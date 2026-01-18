"use client";

import { useState, useEffect, useRef } from "react";
import { searchUsersSmart, type NeonAuthUserRow } from "../actions/User"; // Ajuste o caminho

// Hook simples para debounce (evita muitas chamadas ao servidor enquanto digita)
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

interface UserSearchMultiSelectProps {
  selectedUsers: NeonAuthUserRow[];
  setSelectedUsers: (users: NeonAuthUserRow[]) => void;
}

export function UserSearchMultiSelect({ selectedUsers, setSelectedUsers }: UserSearchMultiSelectProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NeonAuthUserRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  // Efeito para buscar usuários quando a query muda (com debounce)
  useEffect(() => {
    async function fetchUsers() {
      if (debouncedQuery.length < 1) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const data = await searchUsersSmart(debouncedQuery);
        // Filtra usuários que já foram selecionados
        const filtered = data.filter(user => !selectedUsers.some(selected => selected.id === user.id));
        setResults(filtered);
        setIsOpen(true);
      } catch (error) {
        console.error("Erro na busca:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, [debouncedQuery, selectedUsers]);

  // Fecha o dropdown se clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (user: NeonAuthUserRow) => {
    setSelectedUsers([...selectedUsers, user]);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const handleRemove = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-sm font-medium text-white/70 mb-1.5 ml-1">
        Adicionar Membros
      </label>

      <div className="bg-white/[0.04] border border-white/10 rounded-lg p-1.5 flex flex-wrap gap-1.5 focus-within:border-white/20 transition-all">
        {/* Badges dos usuários selecionados */}
        {selectedUsers.map(user => (
          <div key={user.id} className="bg-white/10 text-white/90 text-sm rounded-md pl-2 pr-1 py-1 flex items-center gap-1">
            <span>{user.name || user.email.split('@')[0]}</span>
            <button
              type="button"
              onClick={() => handleRemove(user.id)}
              className="text-white/50 hover:text-white p-0.5 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        ))}

        {/* Input de busca */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if(results.length > 0) setIsOpen(true) }}
          placeholder={selectedUsers.length === 0 ? "Buscar por nome ou email..." : ""}
          className="bg-transparent outline-none text-white text-[15px] placeholder:text-white/30 flex-1 min-w-[150px] px-2 py-1.5"
        />
        {isLoading && (
            <div className="pr-2 flex items-center">
                <svg className="animate-spin h-4 w-4 text-white/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        )}
      </div>

      {/* Dropdown de Resultados */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-[#1c1c1f] border border-white/10 rounded-lg shadow-xl max-h-60 overflow-auto animate-in fade-in slide-in-from-top-1">
          <ul className="py-1">
            {results.map(user => (
              <li key={user.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(user)}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-white/5 transition-colors flex flex-col"
                >
                  <span className="text-white text-sm font-medium">{user.name || 'Sem nome'}</span>
                  <span className="text-white/50 text-xs">{user.email}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {isOpen && results.length === 0 && query.length > 0 && !isLoading && (
           <div className="absolute z-10 mt-1 w-full bg-[#1c1c1f] border border-white/10 rounded-lg shadow-xl p-3 text-white/50 text-sm">
              Nenhum usuário encontrado.
           </div>
      )}
    </div>
  );
}