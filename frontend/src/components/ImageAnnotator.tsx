import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image, Shape } from 'react-konva';
import Konva from 'konva';

interface Mask {
  points: number[][];
}

interface Annotation {
  [maskId: number]: string;
}

interface ImageAnnotatorProps {
  image: string;
  masks: Mask[];
  annotations: Annotation;
  onAnnotate: (maskId: number, annotation: string) => void;
}

const ImageAnnotator: React.FC<ImageAnnotatorProps> = ({ image, masks, annotations, onAnnotate }) => {
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [hoveredMask, setHoveredMask] = useState<number | null>(null);
  const [annotationText, setAnnotationText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<Konva.Image>(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (imageRef.current) {
      const img = new window.Image();
      img.src = `data:image/jpeg;base64,${image}`;
      img.onload = () => {
        if (imageRef.current) {
          imageRef.current.image(img);
        }
      };
    }
  }, [image]);

  const handleMaskHover = (maskId: number | null) => {
    setHoveredMask(maskId);
  };

  const handleAnnotationSubmit = () => {
    if (hoveredMask !== null && annotationText.trim() !== '') {
      onAnnotate(hoveredMask, annotationText);
      setAnnotationText('');
      setHoveredMask(null);
    }
  };

  return (
    <div ref={containerRef} style={{ width: '100%', height: '500px', position: 'relative' }}>
      <Stage width={stageSize.width} height={stageSize.height}>
      <Layer>
          <Image ref={imageRef} image={new window.Image()} />
          {masks.map((mask, index) => (
            <Shape
              key={index}
              sceneFunc={(context: Konva.Context, shape: Konva.Shape) => {
                context.beginPath();
                mask.points.forEach(([x, y]) => {
                  context.lineTo(x, y);
                });
                context.closePath();
                context.fillStrokeShape(shape);
              }}
              fill={hoveredMask === index ? 'rgba(255, 0, 0, 0.3)' : 'rgba(0, 0, 255, 0.1)'}
              stroke="black"
              strokeWidth={1}
              onMouseEnter={() => handleMaskHover(index)}
              onMouseLeave={() => handleMaskHover(null)}
            />
          ))}
        </Layer>
      </Stage>
      {hoveredMask !== null && (
        <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'white', padding: '10px' }}>
          <input
            type="text"
            value={annotationText}
            onChange={(e) => setAnnotationText(e.target.value)}
            placeholder="Enter annotation"
          />
          <button onClick={handleAnnotationSubmit}>Save Annotation</button>
        </div>
      )}
      <div style={{ marginTop: '10px' }}>
        <h3>Annotations:</h3>
        <ul>
          {Object.entries(annotations).map(([maskId, annotation]) => (
            <li key={maskId}>Mask {maskId}: {annotation}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ImageAnnotator;