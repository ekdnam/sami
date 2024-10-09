import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import ImageAnnotator from './components/ImageAnnotator';
import axios from 'axios';
import './App.css';

interface Mask {
  points: number[][];
}

interface Annotation {
  [maskId: number]: string;
}

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [masks, setMasks] = useState<Mask[]>([]);
  const [annotations, setAnnotations] = useState<Annotation>({});

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await axios.post<{ image: string; masks: Mask[] }>('/api/upload', formData);
      setImage(response.data.image);
      setMasks(response.data.masks);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleAnnotation = async (maskId: number, annotation: string) => {
    try {
      await axios.post('/api/annotate', { maskId, annotation });
      setAnnotations(prev => ({ ...prev, [maskId]: annotation }));
    } catch (error) {
      console.error('Error saving annotation:', error);
    }
  };

  return (
    <div className="App">
      <h1>Image Annotator</h1>
      {!image && <ImageUploader onUpload={handleImageUpload} />}
      {image && (
        <ImageAnnotator
          image={image}
          masks={masks}
          annotations={annotations}
          onAnnotate={handleAnnotation}
        />
      )}
    </div>
  );
};

export default App;