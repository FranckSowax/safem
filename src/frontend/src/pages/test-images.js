import React from 'react';

export default function TestImages() {
  return (
    <div>
      <h1>Test d'affichage des images</h1>
      
      <h2>Image 1 - Tag img avec Unsplash</h2>
      <img 
        src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1887&auto=format&fit=crop" 
        alt="Légumes"
        width="400"
        height="300"
      />
      
      <h2>Image 2 - Tag img avec CDN</h2>
      <img 
        src="https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png" 
        alt="Placeholder"
        width="400"
        height="300"
      />
      
      <h2>Image 3 - Background Image CSS Inline</h2>
      <div style={{ 
        width: '400px', 
        height: '300px', 
        backgroundImage: "url('https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=2070&auto=format&fit=crop')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}></div>
      
      <h2>Image 4 - Next Image Component avec CSS</h2>
      <div style={{ width: '400px', height: '300px', position: 'relative', backgroundColor: '#eee' }}>
        Emplacement de l'image
      </div>
    </div>
  );
}
