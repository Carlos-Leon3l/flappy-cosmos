import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ContextoJogo = createContext(null);

export function ProvedorJogo({ children }) {
  const [recorde, definirRecorde] = useState(0);
  const registrarPontuacao = useCallback((pontuacao) => {
    definirRecorde((anterior) => Math.max(anterior, pontuacao));
  }, []);
  const valor = useMemo(() => ({ recorde, registrarPontuacao }), [recorde, registrarPontuacao]);
  return <ContextoJogo.Provider value={valor}>{children}</ContextoJogo.Provider>;
}

export function usarContextoJogo() {
  return useContext(ContextoJogo);
}
