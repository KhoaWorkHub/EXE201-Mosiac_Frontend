import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ARViewer from '../components/ARViewer';
import { Spin, Result, Button } from 'antd';

const ARExperiencePage: React.FC = () => {
  const { qrId } = useParams<{ qrId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // These would typically come from API based on qrId
  const [targetImageUrl, setTargetImageUrl] = useState<string | null>(null);
  const [modelPath, setModelPath] = useState<string | null>(null);
  
  // Set up feature info based on QR code or location state
  useEffect(() => {
    const fetchARData = async () => {
      try {
        setLoading(true);
        
        // In a real app, we would fetch this data from an API based on qrId
        // For now, we'll use hardcoded data for Da Nang traditional clothing
        
        // If there's a region specified in location state, use that
        const regionFromState = location.state?.region;
        
        // Default to Da Nang as requested
        const region = regionFromState || 'danang';
        
        // Set paths based on region
        switch (region.toLowerCase()) {
          case 'danang':
            setTargetImageUrl('/assets/targets/danang-target.mind');
            setModelPath('/models/danang-aodai.glb');
            break;
          case 'hue':
            setTargetImageUrl('/assets/targets/hue-target.mind');
            setModelPath('/models/hue-aodai.glb');
            break;
          case 'hochiminh':
            setTargetImageUrl('/assets/targets/hochiminh-target.mind');
            setModelPath('/models/hochiminh-aodai.glb');
            break;
          default:
            // Fallback to Da Nang
            setTargetImageUrl('/assets/targets/danang-target.mind');
            setModelPath('/models/danang-aodai.glb');
        }
        
        // In a production app, we would use an API call like:
        // const response = await api.get(`/api/v1/ar/experiences/${qrId}`);
        // setTargetImageUrl(response.data.targetImageUrl);
        // setModelPath(response.data.modelPath);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching AR data:', err);
        setError('Failed to load AR experience. Please try again.');
        setLoading(false);
      }
    };
    
    fetchARData();
  }, [qrId, location.state]);
  
  // Handle close AR experience
  const handleClose = () => {
    // Navigate back or to products page
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate('/products');
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-white">Loading AR Experience...</p>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error || !targetImageUrl || !modelPath) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900">
        <Result
          status="error"
          title="AR Experience Failed to Load"
          subTitle={error || "Could not load required assets for AR experience."}
          extra={[
            <Button 
              type="primary" 
              key="try-again" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>,
            <Button 
              key="back" 
              onClick={handleClose}
            >
              Go Back
            </Button>,
          ]}
        />
      </div>
    );
  }
  
  // Render AR Viewer
  return (
    <ARViewer
      targetImage={targetImageUrl}
      modelPath={modelPath}
      onClose={handleClose}
    />
  );
};

export default ARExperiencePage;