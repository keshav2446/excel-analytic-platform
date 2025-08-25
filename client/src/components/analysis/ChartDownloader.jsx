import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { toPng, toJpeg, toSvg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/slices/uiSlice';

const ChartDownloader = ({ chartRef, chartId, title, is3D }) => {
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const downloadLinkRef = useRef(null);

  // Format filename
  const formatFilename = (format) => {
    const sanitizedTitle = (title || 'chart')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${sanitizedTitle}-${timestamp}.${format}`;
  };

  // Download as PNG
  const downloadAsPng = async (quality = 1) => {
    try {
      setIsProcessing(true);
      
      let dataUrl;
      if (is3D) {
        // For 3D charts, we need to get the canvas from the Three.js renderer
        const canvas = document.querySelector(`canvas[data-chart-id="${chartId}"]`);
        if (!canvas) {
          throw new Error('Canvas element not found');
        }
        dataUrl = canvas.toDataURL('image/png');
      } else {
        // For 2D charts, use html-to-image
        const element = document.getElementById(chartId);
        if (!element) {
          throw new Error('Chart element not found');
        }
        
        dataUrl = await toPng(element, {
          quality,
          pixelRatio: 2,
          skipFonts: true,
          canvasWidth: element.offsetWidth * 2,
          canvasHeight: element.offsetHeight * 2
        });
      }
      
      // Create download link
      const link = downloadLinkRef.current;
      link.href = dataUrl;
      link.download = formatFilename('png');
      link.click();
      
      dispatch(addNotification({
        id: uuidv4(),
        type: 'success',
        message: 'Chart downloaded as PNG'
      }));
    } catch (error) {
      console.error('Error downloading chart as PNG:', error);
      dispatch(addNotification({
        id: uuidv4(),
        type: 'error',
        message: `Failed to download chart: ${error.message}`
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  // Download as JPEG
  const downloadAsJpeg = async (quality = 0.9) => {
    try {
      setIsProcessing(true);
      
      let dataUrl;
      if (is3D) {
        // For 3D charts, we need to get the canvas from the Three.js renderer
        const canvas = document.querySelector(`canvas[data-chart-id="${chartId}"]`);
        if (!canvas) {
          throw new Error('Canvas element not found');
        }
        dataUrl = canvas.toDataURL('image/jpeg', quality);
      } else {
        // For 2D charts, use html-to-image
        const element = document.getElementById(chartId);
        if (!element) {
          throw new Error('Chart element not found');
        }
        
        dataUrl = await toJpeg(element, {
          quality,
          pixelRatio: 2,
          skipFonts: true,
          canvasWidth: element.offsetWidth * 2,
          canvasHeight: element.offsetHeight * 2
        });
      }
      
      // Create download link
      const link = downloadLinkRef.current;
      link.href = dataUrl;
      link.download = formatFilename('jpg');
      link.click();
      
      dispatch(addNotification({
        id: uuidv4(),
        type: 'success',
        message: 'Chart downloaded as JPEG'
      }));
    } catch (error) {
      console.error('Error downloading chart as JPEG:', error);
      dispatch(addNotification({
        id: uuidv4(),
        type: 'error',
        message: `Failed to download chart: ${error.message}`
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  // Download as SVG (only for 2D charts)
  const downloadAsSvg = async () => {
    if (is3D) {
      dispatch(addNotification({
        id: uuidv4(),
        type: 'error',
        message: 'SVG export is not supported for 3D charts'
      }));
      return;
    }
    
    try {
      setIsProcessing(true);
      
      const element = document.getElementById(chartId);
      if (!element) {
        throw new Error('Chart element not found');
      }
      
      const dataUrl = await toSvg(element, {
        skipFonts: true
      });
      
      // Create download link
      const link = downloadLinkRef.current;
      link.href = dataUrl;
      link.download = formatFilename('svg');
      link.click();
      
      dispatch(addNotification({
        id: uuidv4(),
        type: 'success',
        message: 'Chart downloaded as SVG'
      }));
    } catch (error) {
      console.error('Error downloading chart as SVG:', error);
      dispatch(addNotification({
        id: uuidv4(),
        type: 'error',
        message: `Failed to download chart: ${error.message}`
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  // Download as PDF
  const downloadAsPdf = async () => {
    try {
      setIsProcessing(true);
      
      let dataUrl;
      if (is3D) {
        // For 3D charts, we need to get the canvas from the Three.js renderer
        const canvas = document.querySelector(`canvas[data-chart-id="${chartId}"]`);
        if (!canvas) {
          throw new Error('Canvas element not found');
        }
        dataUrl = canvas.toDataURL('image/png');
      } else {
        // For 2D charts, use html-to-image
        const element = document.getElementById(chartId);
        if (!element) {
          throw new Error('Chart element not found');
        }
        
        dataUrl = await toPng(element, {
          pixelRatio: 2,
          skipFonts: true,
          canvasWidth: element.offsetWidth * 2,
          canvasHeight: element.offsetHeight * 2
        });
      }
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add title if provided
      if (title) {
        pdf.setFontSize(16);
        pdf.text(title, 14, 14);
        pdf.setFontSize(10);
        pdf.text(`Generated on ${new Date().toLocaleString()}`, 14, 22);
      }
      
      // Calculate aspect ratio to fit the image properly
      const imgWidth = 277; // A4 width in mm (landscape) - margins
      const imgHeight = 180; // A4 height in mm (landscape) - margins - title space
      
      // Add image to PDF
      pdf.addImage(dataUrl, 'PNG', 14, title ? 30 : 14, imgWidth, imgHeight);
      
      // Save PDF
      pdf.save(formatFilename('pdf'));
      
      dispatch(addNotification({
        id: uuidv4(),
        type: 'success',
        message: 'Chart downloaded as PDF'
      }));
    } catch (error) {
      console.error('Error downloading chart as PDF:', error);
      dispatch(addNotification({
        id: uuidv4(),
        type: 'error',
        message: `Failed to download chart: ${error.message}`
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  // Download chart based on format
  const downloadChart = (format, quality = 1) => {
    switch (format) {
      case 'png':
        downloadAsPng(quality);
        break;
      case 'jpg':
      case 'jpeg':
        downloadAsJpeg(quality);
        break;
      case 'svg':
        downloadAsSvg();
        break;
      case 'pdf':
        downloadAsPdf();
        break;
      default:
        downloadAsPng(quality);
    }
  };

  return (
    <>
      {/* Hidden download link */}
      <a 
        ref={downloadLinkRef} 
        style={{ display: 'none' }} 
        href="/" 
        download="chart.png"
      >
        Download
      </a>
      
      {/* Download Modal */}
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Download Chart</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* PNG Option */}
          <button
            type="button"
            onClick={() => downloadChart('png')}
            disabled={isProcessing}
            className="flex flex-col items-center justify-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-10 h-10 text-gray-500 dark:text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-gray-900 dark:text-white">PNG Image</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Best quality, larger file size</span>
          </button>
          
          {/* JPEG Option */}
          <button
            type="button"
            onClick={() => downloadChart('jpeg', 0.9)}
            disabled={isProcessing}
            className="flex flex-col items-center justify-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-10 h-10 text-gray-500 dark:text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-gray-900 dark:text-white">JPEG Image</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Smaller file size, good quality</span>
          </button>
          
          {/* PDF Option */}
          <button
            type="button"
            onClick={() => downloadChart('pdf')}
            disabled={isProcessing}
            className="flex flex-col items-center justify-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-10 h-10 text-gray-500 dark:text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-gray-900 dark:text-white">PDF Document</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Professional format, printable</span>
          </button>
          
          {/* SVG Option (only for 2D charts) */}
          <button
            type="button"
            onClick={() => downloadChart('svg')}
            disabled={isProcessing || is3D}
            className={`flex flex-col items-center justify-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg ${
              is3D ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            } transition-colors`}
          >
            <svg className="w-10 h-10 text-gray-500 dark:text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9l-3 3m0 0l3 3m-3-3h8m-3-3l3 3m0 0l-3 3" />
            </svg>
            <span className="text-sm font-medium text-gray-900 dark:text-white">SVG Vector</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {is3D ? 'Not available for 3D charts' : 'Scalable, best for web use'}
            </span>
          </button>
        </div>
        
        {isProcessing && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Processing...</span>
          </div>
        )}
      </div>
    </>
  );
};

ChartDownloader.propTypes = {
  chartRef: PropTypes.object,
  chartId: PropTypes.string.isRequired,
  title: PropTypes.string,
  is3D: PropTypes.bool
};

ChartDownloader.defaultProps = {
  title: '',
  is3D: false
};

export default ChartDownloader;
