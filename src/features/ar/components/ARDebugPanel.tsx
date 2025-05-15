import React, { useState } from 'react';
import { Button, Collapse, Switch, Card, Slider } from 'antd';
import { BugOutlined, CloseOutlined, SettingOutlined } from '@ant-design/icons';
import useARStore from '../store/arStore';
import * as THREE from 'three';

const { Panel } = Collapse;

interface DebugPanelProps {
  modelRef: React.RefObject<THREE.Group>;
  cameraRef: React.RefObject<THREE.Camera>;
  visible: boolean;
  onClose: () => void;
  setAutoRotate: (value: boolean) => void;
  setModelScale: (value: number) => void;
}

/**
 * Debug panel for development and testing
 * Only shown in development mode
 */
const ARDebugPanel: React.FC<DebugPanelProps> = ({
  modelRef,
  cameraRef,
  visible,
  setAutoRotate,
  setModelScale,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(false);
  
  const { 
    isARReady, 
    isModelLoaded, 
    hasCameraPermission,
    loadingProgress,
    selectPattern,
    selectedPattern,
    modelInfo,
  } = useARStore();
  
  if (!visible || process.env.NODE_ENV !== 'development') return null;
  
  const togglePanel = () => {
    setExpanded(!expanded);
  };
  
  // Get model position and rotation
  const getModelInfo = () => {
    if (!modelRef.current) return { position: [0, 0, 0], rotation: [0, 0, 0] };
    
    const position = modelRef.current.position;
    const rotation = modelRef.current.rotation;
    
    return {
      position: [
        parseFloat(position.x.toFixed(2)),
        parseFloat(position.y.toFixed(2)),
        parseFloat(position.z.toFixed(2)),
      ],
      rotation: [
        parseFloat(rotation.x.toFixed(2)),
        parseFloat(rotation.y.toFixed(2)),
        parseFloat(rotation.z.toFixed(2)),
      ],
    };
  };
  
  // Get camera position and rotation
  const getCameraInfo = () => {
    if (!cameraRef.current) return { position: [0, 0, 0], rotation: [0, 0, 0] };
    
    const position = cameraRef.current.position;
    const rotation = cameraRef.current.rotation;
    
    return {
      position: [
        parseFloat(position.x.toFixed(2)),
        parseFloat(position.y.toFixed(2)),
        parseFloat(position.z.toFixed(2)),
      ],
      rotation: [
        parseFloat(rotation.x.toFixed(2)),
        parseFloat(rotation.y.toFixed(2)),
        parseFloat(rotation.z.toFixed(2)),
      ],
    };
  };
  
  const currentModelInfo = getModelInfo();
  const cameraInfo = getCameraInfo();
  
  return (
    <div 
      style={{
        position: 'fixed',
        right: 10,
        bottom: 10,
        zIndex: 1000,
        maxWidth: 350,
        maxHeight: '80vh',
        overflow: 'auto',
      }}
    >
      <Card 
        size="small"
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>
              <BugOutlined /> AR Debug
            </span>
            <div>
              <Button 
                type="text" 
                size="small" 
                icon={expanded ? <CloseOutlined /> : <SettingOutlined />} 
                onClick={togglePanel}
              />
            </div>
          </div>
        }
        style={{ opacity: 0.9 }}
      >
        {expanded && (
          <Collapse defaultActiveKey={['status']}>
            <Panel header="Status" key="status">
              <div style={{ marginBottom: 8 }}>
                <div>AR Ready: {isARReady ? '✅' : '❌'}</div>
                <div>Model Loaded: {isModelLoaded ? '✅' : '❌'}</div>
                <div>Camera Permission: {hasCameraPermission ? '✅' : '❌'}</div>
                <div>Loading Progress: {loadingProgress.toFixed(0)}%</div>
                <div>Selected Pattern: {selectedPattern?.name || 'None'}</div>
              </div>
            </Panel>
            
            <Panel header="Controls" key="controls">
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>Auto Rotate:</span>
                  <Switch 
                    defaultChecked 
                    size="small" 
                    onChange={setAutoRotate}
                  />
                </div>
                
                <div style={{ marginBottom: 8 }}>
                  <span>Model Scale:</span>
                  <Slider 
                    min={0.1} 
                    max={2} 
                    step={0.1} 
                    defaultValue={0.5}
                    onChange={setModelScale}
                  />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>Show Coordinates:</span>
                  <Switch 
                    size="small" 
                    onChange={setShowCoordinates}
                  />
                </div>
              </div>
            </Panel>
            
            {showCoordinates && (
              <Panel header="Coordinates" key="coordinates">
                <div style={{ marginBottom: 8 }}>
                  <h4>Model:</h4>
                  <div>Position: [{currentModelInfo.position.join(', ')}]</div>
                  <div>Rotation: [{currentModelInfo.rotation.join(', ')}]</div>
                  
                  <h4>Camera:</h4>
                  <div>Position: [{cameraInfo.position.join(', ')}]</div>
                  <div>Rotation: [{cameraInfo.rotation.join(', ')}]</div>
                </div>
              </Panel>
            )}
            
            <Panel header="Patterns" key="patterns">
              <div style={{ marginBottom: 8 }}>
                {modelInfo.patterns.map((pattern) => (
                  <div 
                    key={pattern.id} 
                    style={{ 
                      marginBottom: 4,
                      padding: 4,
                      border: selectedPattern?.id === pattern.id 
                        ? '1px solid #005c4e' 
                        : '1px solid transparent',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                    onClick={() => selectPattern(
                      selectedPattern?.id === pattern.id ? null : pattern.id
                    )}
                  >
                    <div>{pattern.name}</div>
                    <div style={{ fontSize: '0.8em', color: '#888' }}>
                      Pos: [{pattern.position.join(', ')}]
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </Collapse>
        )}
      </Card>
    </div>
  );
};

export default ARDebugPanel;