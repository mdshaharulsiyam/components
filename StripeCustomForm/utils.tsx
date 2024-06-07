
interface ResultProps {
    children: React.ReactNode;
  }
  import React, {useState, useEffect} from 'react';
    // @ts-ignore
  export const logEvent = (name) => (event) => {
    console.log(`[${name}]`, event);
  };
  export const Result: React.FC<ResultProps> = ({children}) => <div className="result">{children}</div>;
  
  export const ErrorResult: React.FC<ResultProps> = ({children}) => (
    <div className="error">{children}</div>
  );
  
  export const useDynamicFontSize = () => {
    const [fontSize, setFontSize] = useState(
      window.innerWidth < 450 ? '14px' : '18px'
    );
  
    useEffect(() => {
      const onResize = () => {
        setFontSize(window.innerWidth < 450 ? '14px' : '18px');
      };
  
      window.addEventListener('resize', onResize);
  
      return () => {
        window.removeEventListener('resize', onResize);
      };
    }, []);
  
    return fontSize;
  };