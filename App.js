import React from 'react';
import { InfoProvider } from './src/contexts/GlobalContext';

import Rotas from './src/telas/Rotas/Rotas';

export default function App() {

  
  return (
    <InfoProvider>
    

      <Rotas />
      
    </InfoProvider>
  );
}


