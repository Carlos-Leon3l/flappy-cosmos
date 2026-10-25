import React, { useState } from 'react';
import { Image } from 'react-native';

export default function RecursoVisual({ fonte, estilo, ajuste = 'contain', children }) {
  const [falhou, definirFalhou] = useState(false);
  if (!fonte || falhou) return children;
  return <Image source={fonte} style={estilo} resizeMode={ajuste} onError={() => definirFalhou(true)} />;
}
